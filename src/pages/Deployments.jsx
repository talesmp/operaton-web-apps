import { useContext, useState } from 'preact/hooks'
import { AppState } from '../state.js'
import { useLocation, useRoute } from 'preact-iso'
import { useSignal } from '@preact/signals'
import engine_rest, { RequestState } from '../api/engine_rest.jsx'
import { BpmnViewer } from '../components/Bpmn-Viewer.jsx'

const DeploymentsPage = () => {
  const state = useContext(AppState),
    { params } = useRoute(),
    { route } = useLocation()

  if (params.deployment_id === undefined || state.api.deployment.all.value === undefined) {
    void engine_rest.deployment.all(state)
      .then(() => route(`/deployments/${state.api.deployment.all.value.data[0].id}`))
  }
  if (params.deployment_id) {
    void engine_rest.deployment.resource(state, params.deployment_id)
      .then(() => {
        if (params.resource_name) {
          state.selected_resource.value = state.api.deployment.resource.value.data.find((res) => res.id === params.resource_name)
        }
      })
  } else {
    // reset state
    // todo fix me with new state api signals
    state.selected_process_statistics.value = null
    state.selected_deployment.value = null
  }
  if (params.resource_name && state.selected_resource.value !== null) {
    void engine_rest.process_definition.by_deployment_id(state, params.deployment_id, params.resource_name)
    void engine_rest.process_instance.count(state, params.deployment_id)
  }

  return (
    <main class="fade-in list-container">
      <h2 class="screen-hidden">Deployments</h2>
      <DeploymentsList />
      <ResourcesList />
      <ProcessDetails />
    </main>
  )
}

const DeploymentsList = () => {
  const
    state = useContext(AppState),
    { params } = useRoute()

  return (
    <div class="list-wrapper">
      <h3 class="screen-hidden">Queried deployments</h3>
      <ul class="list">
        <RequestState
          signl={state.api.deployment.all}
          on_success={() => <>{
            state.api.deployment.all.value?.data.map((deployment) => (
              <li
                key={deployment.id}
                class={params.deployment_id === deployment.id ? 'selected' : null}
              >
                <a href={`/deployments/${deployment.id}`}>
                  <div class="title">
                    {deployment?.name || deployment?.id}
                  </div>
                  <footer>
                    <time datetime={deployment.deploymentTime}>{new Date(deployment.deploymentTime).toLocaleDateString()}</time>
                  </footer>
                </a>
              </li>
            ))
          }</>} />
      </ul>
    </div>
  )
}

const ResourcesList = () => {
  const
    state = useContext(AppState),
    { params } = useRoute()

  return <div class="list-wrapper">
    <h3 class="screen-hidden">Resources</h3>
    {(params.deployment_id)
      ? <RequestState
        signl={state.api.deployment.resource}
        on_success={() => <ul class="list">
          {state.api.deployment.resource.value?.data.map((resource) => (
            <li
              key={resource.id}
              class={params.resource_name === resource.name ? 'selected' : ''}>
              <a href={`/deployments/${params.deployment_id}/${resource.name}`}>
                  <span class="title">
                    {resource.name.includes('/')
                      ? resource.name.split('/').pop().trim()
                      : resource.name || 'N/A'}
                  </span>
              </a>
            </li>
          )) ?? 'No deployments found'}
        </ul>
        } />
      : <p class="info-box">Select a deployment to show its resources</p>}
  </div>
}

const ProcessDetails = () => {
  const
    state = useContext(AppState),
    {
      api: {
        process: {
          definition: { one: process_definition },
          instance: { count: instance_count }
        }
      }
    } = state,
    show_modal = useSignal(false),
    cascade = useState(false),
    skip_custom_listeners = useState(true),
    skip_io_mappings = useState(true),
    { params } = useRoute(),
    handleDelete = () => {
      delete_deployment(state, state.selected_deployment.value.id, {
        cascade: cascade.value,
        skipCustomListeners: skip_custom_listeners.value,
        skipIoMappings: skip_io_mappings.value,
      })
        .then(() => get_deployment(state))
        .then((data) => (state.deployments.value = data))
        .catch((error) => {
          console.error('Deletion failed:', error)
        })
        .finally(() => show_modal.value = false)
      // .then((response) => {
      //   if (response.ok) {
      //     get_deployment(state)
      //     state.selected_deployment.value = null
      //     state.deployment_resources.value = []
      //     state.selected_resource.value = null
      //     state.selected_process_statistics.value = null
      //   } else {
      //     response.json().then((json) => {
      //       console.error(`Deletion failed: ${json.message}`)
      //     })
      //   }
      // })
    },
    openModal = () => {
      // if (state.selected_deployment.value) {
      //   get_deployment_instance_count(state, state.selected_deployment.value.id)
      //     .then((data) => {
      //       instance_count.value = data.count || 0
      //     })
      //     .catch((error) => {
      //       console.error('Error fetching instance count:', error)
      //       instance_count.value = 0
      //     })
      // }
      show_modal.value = true
    }

  console.log(process_definition.value?.data)

  return <div class="process-details">
    <RequestState
      signl={process_definition}
      on_nothing={() => <p className="info-box">No resource selected</p>}
      on_success={() => <>
        <h3>{process_definition.value?.data[0].name || 'N/A - Process name is not defined'}</h3>
        <p class={process_definition.value?.data[0].suspended ? 'status-suspended' : 'status-active'}>
          {process_definition.value?.data[0].suspended ? 'Suspended' : 'Active'}
        </p>

        <dl>
          <dt>Name</dt>
          <dd>{process_definition.value?.data[0].name || "?"}</dd>
          <dt>Key</dt>
          <dd>{process_definition.value?.data[0].key || "?"}</dd>
          <dt>Instance Count</dt>
          <dd>
            <RequestState
              signl={instance_count}
              on_success={() => instance_count.value?.data.count}
            />
          </dd>
        </dl>

        <BpmnViewer process_definition_id={process_definition.value.data[0].id} />

        <button onClick={openModal} class="delete-button">
          Delete Deployment
        </button>
      </>
      } />
  </div>
}

/*
 <table class="process-details-table">
          <thead class="screen-hidden">
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Value</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th scope="row">Running Instances</th>
            <td>{process_definition.value?.data.instances || 0}</td>
          </tr>
          <tr>
            <th scope="row">Open Incidents</th>
            <td>{process_definition.value?.data.incidents.length || 0}</td>
          </tr>
          <tr>
            <th scope="row">Failed Jobs</th>
            <td>{process_definition.value?.data.failedJobs || 0}</td>
          </tr>
          <tr>
            <th scope="row">Tenant</th>
            <td>{process_definition.value?.data.definition.tenant || 'N/A'}</td>
          </tr>
          <tr>
            <th scope="row">Version</th>
            <td>{process_definition.value?.data.definition.version || 'N/A'}</td>
          </tr>
          <tr>
            <th scope="row">Version Tag</th>
            <td>{process_definition.value?.data.definition.versionTag || 'N/A'}</td>
          </tr>
          <tr>
            <th scope="row">Startable in Tasklist</th>
            <td>{process_definition.value?.data.definition.startableInTasklist ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th scope="row">History Time to Live</th>
            <td>{process_definition.value?.data.definition.historyTimeToLive || 'N/A'}</td>
          </tr>
          <tr>
            <th scope="row">Process Definition ID</th>
            <td>
              <a href={`/processes/${process_definition.value?.data.definition.id}/instances`}>
                {process_definition.value?.data.definition.id || 'N/A'}
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">Process Definition Key</th>
            <td>{process_definition.value?.data.definition.key || 'N/A'}</td>
          </tr>
          </tbody>
        </table>
 */

// {/*{show_modal.value && (*/}
// {/*  <div class="modal-overlay">*/}
// {/*    <div class="modal-content">*/}
// {/*      <div class="title">*/}
// {/*        <h3>Delete Deployment: {state.selected_deployment.value?.name}</h3>*/}
// {/*      </div>*/}
// {/*      <div class="modal-body">*/}
// {/*        <hr />*/}
// {/*        {instance_count.value > 0 && (*/}
// {/*          <p class="info-box warning">*/}
// {/*            There are {instance_count.value} running process instances which belong to this deployment. <br />In order to delete this deployment, it is necessary to enable the Cascade*/}
// {/*            flag.*/}
// {/*          </p>*/}
// {/*        )}*/}
// {/*        <form>*/}
// {/*          <div class="form-group">*/}
// {/*            <label class="checkbox-hover">*/}
// {/*              <input*/}
// {/*                type="checkbox"*/}
// {/*                checked={cascade.value}*/}
// {/*                onChange={(e) => cascade.value = e.target.checked}*/}
// {/*              />*/}
// {/*              Cascade*/}
// {/*              <span>*/}
// {/*              If enabled, all instances and historic instances related to this deployment will be deleted.*/}
// {/*            </span>*/}
// {/*            </label>*/}
// {/*          </div>*/}
// {/*          <div className="form-group">*/}
// {/*            <label class="checkbox-hover">*/}
// {/*              <input*/}
// {/*                type="checkbox"*/}
// {/*                checked={skip_custom_listeners.value}*/}
// {/*                onChange={(e) => skip_custom_listeners.value = e.target.checked}*/}
// {/*              />*/}
// {/*              Skip Custom Listeners*/}
// {/*              <span>*/}
// {/*              If enabled, only built-in listeners will be notified of the end event.*/}
// {/*            </span>*/}
// {/*            </label>*/}
// {/*          </div>*/}
// {/*          <div className="form-group">*/}
// {/*            <label class="checkbox-hover">*/}
// {/*              <input*/}
// {/*                type="checkbox"*/}
// {/*                checked={skip_io_mappings.value}*/}
// {/*                onChange={(e) => skip_io_mappings.value = e.target.checked}*/}
// {/*              />*/}
// {/*              Skip IO Mappings*/}
// {/*              <span>*/}
// {/*              If enabled, IO mappings will be skipped during deployment removal.*/}
// {/*            </span>*/}
// {/*            </label>*/}
// {/*          </div>*/}
// {/*        </form>*/}
// {/*        <hr />*/}
// {/*      </div>*/}
// {/*      <div class="modal-footer">*/}
// {/*        <p class="modal-footer-hint">*/}
// {/*          Are you sure you want to permanently delete this deployment?*/}
// {/*        </p>*/}
// {/*        <div class="modal-footer-buttons">*/}
// {/*          <button class="btn btn-secondary" onClick={() => show_modal.value = false}>*/}
// {/*            Cancel*/}
// {/*          </button>*/}
// {/*          <div class="tooltip-container">*/}
// {/*            <button*/}
// {/*              class="btn btn-primary"*/}
// {/*              onClick={handleDelete}*/}
// {/*              disabled={instance_count.value > 0 && !cascade.value}*/}
// {/*            >*/}
// {/*              Delete*/}
// {/*            </button>*/}
// {/*          </div>*/}
// {/*        </div>*/}
// {/*      </div>*/}
// {/*    </div>*/}
// {/*  </div>*/}
// {/*)}*/}

export { DeploymentsPage }