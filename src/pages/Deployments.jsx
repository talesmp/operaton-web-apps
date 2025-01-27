import * as api from '../api.js'
import { useContext, useState } from 'preact/hooks'
import { AppState } from '../state.js'
import { useRoute } from 'preact-iso'
import { useSignal } from '@preact/signals'
import { delete_deployment, get_deployment, get_deployment_instance_count } from '../api.js'
import { BpmnViewer } from '../components/Bpmn-Viewer.jsx'

const DeploymentsPage = () => {
  const state = useContext(AppState),
    { params } = useRoute()

  if (params.deployment_id === undefined || state.deployments.value === undefined) {
    void api.get_deployment(state)
  }
  if (params.deployment_id) {
    void api.get_deployment_resources(state, params.deployment_id)
      .then(() => {
        if (params.resource_name) {
          state.selected_resource.value = state.deployment_resources.value.find((res) => res.id === params.resource_name)
        }
      })
  } else {
    // reset state
    state.selected_process_statistics.value = null
    state.selected_deployment.value = null
  }
  if (params.resource_name && state.selected_resource.value !== null) {
    void api.get_process_definition_by_deployment_id(state, params.deployment_id, params.resource_name)
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
        {state.deployments.value?.map((deployment) => (
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
        )) ?? 'Loading...'}
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
      ?
      <ul class="list">
        {state.deployment_resources.value?.map((resource) => (
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
      : <p class="info-box">Select a deployment to show its resources</p>
    }
  </div>
}

const ProcessDetails = () => {
  const
    state = useContext(AppState),
    show_modal = useSignal(false),
    cascade = useState(false),
    skip_custom_listeners = useState(true),
    skip_io_mappings = useState(true),
    instance_count = useState(0),
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
    },
    openModal = () => {
      if (state.selected_deployment.value) {
        get_deployment_instance_count(state, state.selected_deployment.value.id)
          .then((data) => {
            instance_count.value = data.count || 0
          })
          .catch((error) => {
            console.error('Error fetching instance count:', error)
            instance_count.value = 0
          })
      }
      show_modal.value = true
    }

  return (
    <div class="process-details">
      {(state.selected_process_statistics.value && params.resource_name) ? (
        <>
          {/* Process Details */}
          <h3>{state.selected_process_statistics.value?.definition.name || 'N/A - Process name is not defined'}</h3>
          <p class={state.selected_process_statistics.value?.definition.suspended ? 'status-suspended' : 'status-active'}>
            {state.selected_process_statistics.value?.definition.suspended ? 'Suspended' : 'Active'}
          </p>
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
              <td>{state.selected_process_statistics.value?.instances || 0}</td>
            </tr>
            <tr>
              <th scope="row">Open Incidents</th>
              <td>{state.selected_process_statistics.value?.incidents.length || 0}</td>
            </tr>
            <tr>
              <th scope="row">Failed Jobs</th>
              <td>{state.selected_process_statistics.value?.failedJobs || 0}</td>
            </tr>
            <tr>
              <th scope="row">Tenant</th>
              <td>{state.selected_process_statistics.value?.definition.tenant || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row">Version</th>
              <td>{state.selected_process_statistics.value?.definition.version || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row">Version Tag</th>
              <td>{state.selected_process_statistics.value?.definition.versionTag || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row">Startable in Tasklist</th>
              <td>{state.selected_process_statistics.value?.definition.startableInTasklist ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <th scope="row">History Time to Live</th>
              <td>{state.selected_process_statistics.value?.definition.historyTimeToLive || 'N/A'}</td>
            </tr>
            <tr>
              <th scope="row">Process Definition ID</th>
              <td>
                <a href={`/processes/${state.selected_process_statistics.value?.definition.id}/instances`}>
                  {state.selected_process_statistics.value?.definition.id || 'N/A'}
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">Process Definition Key</th>
              <td>{state.selected_process_statistics.value?.definition.key || 'N/A'}</td>
            </tr>
            </tbody>
          </table>

          <BpmnViewer process_definition_id={state.selected_process_statistics.peek().definition.id} />

          {/* Delete Button */}
          <button onClick={openModal} class="delete-button">
            Delete Deployment
          </button>

          {/* Modal */}
          {/* todo check code/refactor */}
          {show_modal.value && (
            <div class="modal-overlay">
              <div class="modal-content">
                <div class="title">
                  <h3>Delete Deployment: {state.selected_deployment.value?.name}</h3>
                </div>
                <div class="modal-body">
                  <hr />
                  {instance_count.value > 0 && (
                    <p class="info-box warning">
                      There are {instance_count.value} running process instances which belong to this deployment. <br />In order to delete this deployment, it is necessary to enable the Cascade flag.
                    </p>
                  )}
                  <form>
                    <div class="form-group">
                      <label class="checkbox-hover">
                        <input
                          type="checkbox"
                          checked={cascade.value}
                          onChange={(e) => cascade.value = e.target.checked}
                        />
                        Cascade
                        <span>
                          If enabled, all instances and historic instances related to this deployment will be deleted.
                        </span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label class="checkbox-hover">
                        <input
                          type="checkbox"
                          checked={skip_custom_listeners.value}
                          onChange={(e) => skip_custom_listeners.value = e.target.checked}
                        />
                        Skip Custom Listeners
                        <span>
                          If enabled, only built-in listeners will be notified of the end event.
                        </span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label class="checkbox-hover">
                        <input
                          type="checkbox"
                          checked={skip_io_mappings.value}
                          onChange={(e) => skip_io_mappings.value = e.target.checked}
                        />
                        Skip IO Mappings
                        <span>
                          If enabled, IO mappings will be skipped during deployment removal.
                        </span>
                      </label>
                    </div>
                  </form>
                  <hr />
                </div>
                <div class="modal-footer">
                  <p class="modal-footer-hint">
                    Are you sure you want to permanently delete this deployment?
                  </p>
                  <div class="modal-footer-buttons">
                    <button class="btn btn-secondary" onClick={() => show_modal.value = false}>
                      Cancel
                    </button>
                    <div class="tooltip-container">
                      <button
                        class="btn btn-primary"
                        onClick={handleDelete}
                        disabled={instance_count.value > 0 && !cascade.value}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p class="info-box">No resource selected</p>
      )}
    </div>
  )
}

export { DeploymentsPage }