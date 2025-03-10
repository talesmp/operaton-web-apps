import { GET } from '../helper.jsx'

const url_params = (definition_id) =>
  new URLSearchParams({
    unfinished: true,
    sortBy: 'startTime',
    sortOrder: 'asc',
    processDefinitionId: definition_id,
  }).toString()

const get_process_instances = (state, definition_id) =>
  GET(`/history/process-instance?${url_params(definition_id)}`, state, state.api.process.instance.list)

const get_process_incidents = (state, definition_id) =>
  GET(`/history/incident?processDefinitionId=${definition_id}`, state, state.api.history.incident.by_process_definition)

const get_process_instance_incidents = (state, instance_id) =>
  GET(`/history/incident?processInstanceId=${instance_id}`, state, state.api.history.incident.by_process_instance)

const history = {
  process_instances: get_process_instances,
  incident: {
    by_process_definition: get_process_instance_incidents,
    by_process_instance: get_process_incidents
  }
}

export default history