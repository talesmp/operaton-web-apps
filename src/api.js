const base_url = 'http://localhost:8888/engine-rest'

let headers = new Headers();
headers.set('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent("demo:demo")))); //TODO authentication

const get_user_profile = (state, user_name) => {
    // TODO remove it when we have a login!
    if (!user_name) {
        user_name = "demo";
    }

    fetch( `${base_url}/user/${user_name}/profile`, {headers: headers})
        .then(response => response.json())
        .then(json => state.user_profile.value = json);
}

const get_process_definitions = (state) =>
  fetch(`${base_url}/process-definition/statistics`)
    .then(response => response.json())
    .then(json => state.process_definitions.value = json)

const get_process_definition = (state, id) =>
  fetch(`${base_url}/process-definition/${id}`)
    .then(response => response.json())
    .then(json => state.process_definition.value = json)

const url_params = (definition_id) =>
  new URLSearchParams({
    unfinished: true,
    sortBy: 'startTime',
    sortOrder: 'asc',
    processDefinitionId: definition_id,
  }).toString()

const get_process_instances = (state, definition_id) =>
  fetch(`${base_url}/history/process-instance?${url_params(definition_id)}`)
    .then(response => response.json())
    .then(json => (state.process_instances.value = json))

const get_process_incidents = (state, definition_id) =>
  fetch(`${base_url}/history/incident?processDefinitionId=${definition_id}`)
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

const get_process_instance_incidents = (state, instance_id) =>
  fetch(`${base_url}/history/incident?processInstanceId=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.process_instance_incidents.value = json))

const get_process_instance_tasks = (state, instance_id) =>
  fetch(`${base_url}/task?processInstanceId=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.process_instance_tasks.value = json))

const get_called_process_instances = (state, instance_id) =>
  fetch(`${base_url}/process-instance?superProcessInstance=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.called_process_instances.value = json))

const get_called_process_definitions = (state, definition_id) =>
  fetch(`${base_url}/process-definition/${definition_id}/static-called-process-definitions`)
    .then(response => response.json())
    .then(json => state.called_definitions.value = json)

const get_job_definitions = (state, definition_id) =>
  fetch(`${base_url}/job-definition?processDefinitionId=${definition_id}`)
    .then(response => response.json())
    .then(json => state.job_definitions.value = json)

const get_diagram = (state, definition_id) =>
  fetch(`${base_url}/process-definition/${definition_id}/xml`)
    .then(response => response.json())
    .then(json => state.process_definition_diagram.value = json)

// getting all tasks, when no sorting is provided it will use "name" and ascending
const get_task_list = (sort_key, sort_order) => {
    const sort = sort_key ? sort_key : "name";
    const order = sort_order ? sort_order : "asc";

    return fetch(base_url + "/task?sortBy=" + sort + "&sortOrder=" + order, {headers: headers})
        .then((response) => response.json());
}

const get_task = (task_id) => {
    return fetch( `${base_url}/task/${task_id}`, {headers: headers})
        .then((response) => response.json());
}

const get_process_definition_list = (ids) => {
    return fetch(base_url + "/process-definition?processDefinitionIdIn=" + ids, {headers: headers})
        .then((response) => response.json());
}

const get_generated_form = (task_id) => {
    return fetch( `${base_url}/task/${task_id}/rendered-form`, {headers: headers})
        .then((response) => response.text());
}

const claim_task = (task_id, state) => assign_task(true, task_id, state)

const unclaim_task = (task_id, state) => assign_task(false, task_id, state)

// claim and unclaim tasks
const assign_task = (claim, task_id, state) => {
    const custom_header = headers;
    custom_header.set("Content-Type", "application/json");

    return fetch(`${base_url}/task/${task_id}/${ claim ? "claim" : "unclaim" }`,
        { headers: headers, method: "POST", body: JSON.stringify({ userId: state.user_profile.value.id }) })
        .then((response) => {
            if (!response.ok) {
                console.log(`status: ${response.status}`);
                return false;
            }
            return true;
        });
}

export {
    get_process_definitions,
    get_process_definition,
    get_diagram,
    get_process_instance_list,
    get_process_instance,
    get_process_instance_variables,
    get_task_list,
    get_process_definition_list,
    get_generated_form,
    get_user_profile,
  claim_task,
  get_task,
  unclaim_task
};
