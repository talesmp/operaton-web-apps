import { useSignalEffect } from '@preact/signals'
import { useContext } from 'preact/hooks'
import { useRoute } from 'preact-iso'
import * as api from '../../api'
import * as Icons from '../../assets/icons.jsx'
import ReactBpmn from 'react-bpmn'
import { AppState } from '../../state.js'
import { Accordion } from '../../components/Accordion.jsx'

const ProcessesPage = () => {
  const state = useContext(AppState)
  const { params } = useRoute()

  void api.get_process_definitions(state)

  if (params.definition_id) {
    void api.get_process_definition(state, params.definition_id)
    void api.get_diagram(state, params.definition_id)
  } else {
    // reset state
    state.process_definition.value = null
    state.process_instances.value = null
    state.process_instance.value = null
    state.process_definition_diagram.value = null
  }

  return (
    <main id="processes" class="split-layout">
      <div id="selection">
        {!params?.definition_id
          ? <ProcessDefinitionSelection />
          : <ProcessDefinitionDetails />}
      </div>
      <ProcessDiagram />
    </main>
  )
}

const ProcessDiagram = () => {
  const { process_definition_diagram } = useContext(AppState)
  const { params } = useRoute()

  const show_diagram =
    process_definition_diagram.value !== null &&
    params.definition_id !== undefined

  return (
    <div id="preview" class="fade-in">
      {show_diagram
        ? <ReactBpmn
          diagramXML={process_definition_diagram.value.bpmn20Xml}
          onLoading={null}
          onShown={null}
          onError={null} />
        : 'Select Process Definition'}
    </div>
  )
}

const ProcessDefinitionSelection = () =>
  <div class="fade-in">
    <h1>
      Process Definitions
    </h1>
    <table class="tile p-1">
      <thead>
      <tr>
        <th>Name</th>
        <th>Key</th>
        <th>Instances</th>
        <th>Incidents</th>
        <th>State</th>
      </tr>
      </thead>
      <tbody>
      {useContext(AppState).process_definitions.value?.map(process =>
        <ProcessDefinition key={process.id} {...process} />)}
      </tbody>
    </table>
  </div>

const ProcessDefinitionDetails = () => {
  const { process_definition } = useContext(AppState)
  const { params } = useRoute()

  return (
    <div class="fade-in">
      <div class="row gap-2">
        <a className="tabs-back"
           href={`/processes`}
           title="Change Definition">
          <Icons.arrow_left />
          <Icons.list />
        </a>
        <div>
          <h1>{process_definition.value?.name} &nbsp;</h1>
          <dl>
            <dt>Definition ID</dt>
            <dd className="font-mono copy-on-click" onClick={copyToClipboard}>
              {process_definition.value?.id ?? '-/-'}
            </dd>
            {process_definition.value?.tenantId ?
              <>
                <dt>Tenant ID</dt>
                <dd>{process_definition.value?.tenantId ?? '-/-'}</dd>
              </> : <></>
            }
          </dl>
        </div>
      </div>

      <Accordion
        accordion_name="process_definition_details"
        sections={process_definition_tabs}
        base_path={`/processes/${params.definition_id}`} />

      {/*<Tabs base_url={`/processes/${params.definition_id}`}*/}
      {/*      tabs={process_definition_tabs} />*/}
    </div>
  )
}

const ProcessDefinition =
  ({ definition: { id, name, key }, instances, incidents }) =>
    <tr>
      <td><a href={`/processes/${id}/instances`}>{name}</a></td>
      <td>{key}</td>
      <td>{instances}</td>
      <td>{incidents.length}</td>
      <td>?</td>
    </tr>

const Instances = () => {
  const state = useContext(AppState)
  const { params } = useRoute()

  void api.get_process_instances(state, params.definition_id)

  return !params?.selection_id
    ? (<table class="fade-in">
      <thead>
      <tr>
        <th>ID</th>
        <th>Start Time</th>
        <th>State</th>
        <th>Business Key</th>
      </tr>
      </thead>
      <tbody>
      <InstanceTableRows />
      </tbody>
    </table>)
    : (<InstanceDetails />)
}

const InstanceTableRows = () =>
  useContext(AppState).process_instances.value?.map((instance) => (
    <ProcessInstance key={instance.id} {...instance} />
  )) ?? <p>...</p>

const InstanceDetails = () => {
  const state = useContext(AppState)
  const { params: { selection_id, definition_id, panel } } = useRoute()

  void api.get_process_instance(state, selection_id)

  return (
    <div class="fade-in">
      <div class="row gap-2">
        <BackToListBtn
          url={`/processes/${definition_id}/instances`}
          title="Change Instance"
          className="bg-1" />
        <InstanceDetailsDescription />
      </div>

      <Accordion
        sections={process_instance_tabs}
        accordion_name="instance_details_accordion"
        param_name="sub_panel"
        base_path={`/processes/${definition_id}/${panel}/${selection_id}`} />
    </div>
  )
}

const InstanceDetailsDescription = () =>
  <dl>
    <dt>Instance ID</dt>
    <dd>{useContext(AppState).process_instance.value?.id ?? '-/-'}</dd>
    <dt>Business Key</dt>
    <dd>{useContext(AppState).process_instance.value?.businessKey ?? '-/-'}</dd>
  </dl>

const ProcessInstance = ({ id, startTime, state, businessKey }) => (
  <tr>
    <td class="font-mono"><a
      href={`./instances/${id}/vars`}> {id.substring(0, 8)}</a></td>
    <td>{new Date(Date.parse(startTime)).toLocaleString()}</td>
    <td>{state}</td>
    <td>{businessKey}</td>
  </tr>
)

const InstanceVariables = () => {
  const state = useContext(AppState)
  const { params } = useRoute()

  const selection_exists = state.selection_values.value !== null

  useSignalEffect(() => {
    void api.get_process_instance_variables(state, params.selection_id)
  })

  return (
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Type</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      {selection_exists
        ? Object.entries(state.selection_values.value).map(
          // eslint-disable-next-line react/jsx-key
          ([name, { type, value }]) => (<tr>
            <td>{name}</td>
            <td>{type}</td>
            <td>{value}</td>
          </tr>))
        : 'Loading ...'}
      </tbody>
    </table>
  )
}

const InstanceIncidents = () => {
  const state = useContext(AppState)
  const { params } = useRoute()

  useSignalEffect(() => {
    void api.get_process_instance_incidents(state, params.selection_id)
  })

  return (
    <table>
      <thead>
      <tr>
        <th>Message</th>
        <th>Process Instance</th>
        <th>Timestamp</th>
        <th>Activity</th>
        <th>Failing Activity</th>
        <th>Cause Process Instance ID</th>
        <th>Root Cause Process Instance ID</th>
        <th>Type</th>
        <th>Annotation</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {state.process_instance_incidents.value?.map(
        // eslint-disable-next-line react/jsx-key
        ({
          id,
          incidentMessage,
          processInstanceId,
          createTime,
          activityId,
          failedActivityId,
          causeIncidentId,
          rootCauseIncidentId,
          incidentType,
          annotation,
        }) => (
          <tr key={id}>
            <td>{incidentMessage}</td>
            <td><UUIDLink path={'/procceses'} uuid={processInstanceId} /></td>
            <td>
              <time
                datetime={createTime}>{createTime ? createTime.substring(0, 19) : '-/-'}</time>
            </td>
            <td>{activityId}</td>
            <td>{failedActivityId}</td>
            <td><UUIDLink path={''} uuid={causeIncidentId} /></td>
            <td><UUIDLink path={''} uuid={rootCauseIncidentId} /></td>
            <td>{incidentType}</td>
            <td>{annotation}</td>
          </tr>))}
      </tbody>
    </table>
  )
}

const InstanceUserTasks = () => {
  const state = useContext(AppState)
  const { params } = useRoute()

  useSignalEffect(() => {
    void api.get_process_instance_tasks(state, params.selection_id)
  })

  return (
    <table>
      <thead>
      <tr>
        <th>Activity</th>
        <th>Assignee</th>
        <th>Owner</th>
        <th>Created</th>
        <th>Due</th>
        <th>Follow Up</th>
        <th>Priority</th>
        <th>Delegation State</th>
        <th>Task ID</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {state.process_instance_tasks.value?.map(
        // eslint-disable-next-line react/jsx-key
        ({
          id,
          assignee,
          name,
          owner,
          created,
          due,
          followUp,
          priority,
          delegationState,
        }) => (
          <tr key={id}>
            <td>{name}</td>
            <td>{assignee}</td>
            <td>{owner}</td>
            <td>{created}</td>
            <td>{due}</td>
            <td>{followUp}</td>
            <td>{priority}</td>
            <td>{priority}</td>
            <td>{delegationState}</td>
            <td><UUIDLink path="/" uuid={id} /></td>
            <td>
              <button>Groups</button>
              <button>Users</button>
            </td>
          </tr>))}
      </tbody>
    </table>
  )
}

const CalledProcessInstances = () => {
  const state = useContext(AppState)
  const { selection_id } = useRoute()

  useSignalEffect(() =>
    void api.get_called_process_instances(state, selection_id)
  )

  return (
    <table>
      <thead>
      <tr>
        <th>State</th>
        <th>Called Process Instance</th>
        <th>Process Definition</th>
        <th>Activity</th>
      </tr>
      </thead>
      <tbody>
      {state.called_process_instances.value?.map(instance =>
        <tr key={instance.id}>
          <td>{instance.suspended ? 'Suspended' : 'Running'}</td>
          <td><a href={`/processes/${instance.id}`}>{instance.id}</a></td>
          <td>{instance.definitionId}</td>
          <td>{instance.definitionId}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

const Incidents = () => {
  const state = useContext(AppState)
  const { definition_id } = useRoute()

  useSignalEffect(() =>
    void api.get_process_incidents(state, definition_id)
  )

  return (
    <table>
      <thead>
      <tr>
        <th>Message</th>
        <th>Type</th>
        <th>Configuration</th>
      </tr>
      </thead>
      <tbody>
      {state.process_incidents.value?.map(incident =>
        <tr key={incident.id}>
          <td>{incident.incidentMessage}</td>
          <td>{incident.incidentType}</td>
          <td>{incident.configuration}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

const CalledProcessDefinitions = () => {
  const state = useContext(AppState)
  const { definition_id } = useRoute()

  useSignalEffect(() =>
    void api.get_called_process_definitions(state, definition_id)
  )

  return (
    <table>
      <thead>
      <tr>
        <th>Called Process Definition</th>
        <th>State</th>
        <th>Activity</th>
      </tr>
      </thead>
      <tbody>
      {state.called_definitions.value?.map(definition =>
        <tr key={definition.id}>
          <td><a href={`/processes/${definition.id}`}>{definition.name}</a></td>
          <td>{definition.suspended ? 'Suspended' : 'Running'}</td>
          <td>{definition.calledFromActivityIds.map(a => `${a}, `)}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

const JobDefinitions = () => {
  const state = useContext(AppState)
  const { definition_id } = useRoute()

  useSignalEffect(() =>
    void api.get_job_definitions(state, definition_id)
  )

  return (
    <div class="relative">
      <table>
        <thead>
        <tr>
          <th>State</th>
          <th>Activity</th>
          <th>Type</th>
          <th>Configuration</th>
          <th>Overriding Job Priority</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {state.job_definitions.value?.map(definition =>
          <tr key={definition.id}>
            <td>{definition.suspended ? 'Suspended' : 'Active'}</td>
            <td>?</td>
            {/*<td>{definition.calledFromActivityIds.map(a => `${a}, `)}</td>*/}
            <td>{definition.jobType}</td>
            <td>{definition.jobConfiguration}</td>
            <td>{definition.overridingJobPriority ?? '-'}</td>
            <td>
              <button>Suspend</button>
              <button>Change Overriding Job Priority</button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}

const BackToListBtn = ({ url, title, className }) =>
  <a className={`tabs-back ${className || ''}`}
     href={url}
     title={title}>
    <Icons.arrow_left />
    <Icons.list />
  </a>

const process_definition_tabs = [
  {
    name: 'Instances',
    id: 'instances',
    pos: 0,
    target: <Instances />
  },
  {
    name: 'Incidents',
    id: 'incidents',
    pos: 1,
    target: <Incidents />
  },
  {
    name: 'Called Definitions',
    id: 'called_definitions',
    pos: 2,
    target: <CalledProcessDefinitions />
  },
  {
    name: 'Jobs',
    id: 'jobs',
    pos: 3,
    target: <JobDefinitions />
  }]

const UUIDLink = ({ uuid = '?', path }) =>
  <a href={path}>{uuid.substring(0, 8)}</a>

const process_instance_tabs = [
  {
    name: 'Variables',
    id: 'vars',
    pos: 0,
    target: <InstanceVariables />
  },
  {
    name: 'Instance Incidents',
    id: 'instance_incidents',
    pos: 1,
    target: <InstanceIncidents />
  },
  {
    name: 'Called Instances',
    id: 'called_instances',
    pos: 2,
    target: <CalledProcessInstances />
  },
  {
    name: 'User Tasks',
    id: 'user_tasks',
    pos: 3,
    target: <InstanceUserTasks />
  },
  {
    name: 'Jobs',
    id: 'jobs',
    pos: 4,
    // TODO: create Jobs example for old Camunda apps
    target: <p>Jobs</p>
  },
  {
    name: 'External Tasks',
    id: 'external_tasks',
    pos: 5,
    // TODO: create External Apps example for old Camunda apps
    target: <p>External Tasks</p>
  }]

// fixme : extract to util file
const copyToClipboard = (event) =>
  navigator.clipboard.writeText(event.target.innerText)

export { ProcessesPage }