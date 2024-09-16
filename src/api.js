const base_url = "http://localhost:8888/engine-rest";

const get_process_definitions = (state) =>
  fetch(`${base_url}/process-definition/statistics`)
    .then(response => response.json())
    .then(json => state.process_definitions.value = json);

const get_process_definition = (state, id) =>
  fetch(`${base_url}/process-definition/${id}`)
    .then(response => response.json())
    .then(json => state.process_definition.value = json)

const url_params = (definition_id) =>
  new URLSearchParams({
    unfinished: true,
    sortBy: "startTime",
    sortOrder: "asc",
    processDefinitionId: definition_id,
  }).toString()

const get_process_instances = (state, definition_id) =>
  fetch(`${base_url}/history/process-instance?${url_params(definition_id)}`)
    .then(response => response.json())
    .then(json => (state.process_instances.value = json))

const get_process_incidents = (state, definition_id) =>
  fetch(`${base_url}/history/incident?processDefinitionId${definition_id}`)
    .then(response => response.json())
    .then(json => (state.process_incidents.value = json))

const get_process_instance = (state, instance_id) =>
  fetch(`${base_url}/process-instance/${instance_id}`)
    .then(response => response.json())
    .then(json => state.process_instance.value = json)


const get_process_instance_variables = (state, instance_id) =>
  fetch(`${base_url}/process-instance/${instance_id}/variables`)
    .then(response => response.json())
    .then(json => state.selection_values.value = json)


const get_diagram = (state, definition_id) =>
  fetch(`${base_url}/process-definition/${definition_id}/xml`)
    .then(response => response.json())
    .then(json => state.process_definition_diagram.value = json)

export {
  get_process_definitions,
  get_process_definition,
  get_diagram,
  get_process_instance,
  get_process_instances,
  get_process_instance_variables,
  get_process_incidents
};
