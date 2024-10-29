/**
 * api.js
 *
 * Provides endpoints to the default Operaton REST API.
 *
 *
 */

const _url = (state) => `${state.server.value}/engine-rest`

let headers = new Headers()
headers.set('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent('demo:demo')))) //TODO authentication

export const get_user_profile = (state, user_name) => {
  // TODO remove it when we have a login!
  if (!user_name) {
    user_name = 'demo'
  }

  fetch(`${_url(state)}/user/${user_name}/profile`, { headers: headers })
    .then(response => response.json())
    .then(json => state.user_profile.value = json)
}

export const get_process_definitions = (state) =>
  fetch(`${_url(state)}/process-definition/statistics`)
    .then(response => response.json())
    .then(json => state.process_definitions.value = json)

export const get_process_definition = (state, id) =>
  fetch(`${_url(state)}/process-definition/${id}`)
    .then(response => response.json())
    .then(json => state.process_definition.value = json)

const url_params = (definition_id) =>
  new URLSearchParams({
    unfinished: true,
    sortBy: 'startTime',
    sortOrder: 'asc',
    processDefinitionId: definition_id,
  }).toString()

export const get_process_instances = (state, definition_id) =>
  fetch(`${_url(state)}/history/process-instance?${url_params(definition_id)}`)
    .then(response => response.json())
    .then(json => (state.process_instances.value = json))

export const get_process_incidents = (state, definition_id) =>
  fetch(`${_url(state)}/history/incident?processDefinitionId=${definition_id}`)
    .then(response => response.json())
    .then(json => (state.process_incidents.value = json))

export const get_process_instance = (state, instance_id) =>
  fetch(`${_url(state)}/process-instance/${instance_id}`)
    .then(response => response.json())
    .then(json => state.process_instance.value = json)

export const get_process_instance_variables = (state, instance_id) =>
  fetch(`${_url(state)}/process-instance/${instance_id}/variables`)
    .then(response => response.json())
    .then(json => state.selection_values.value = json)

export const get_process_instance_incidents = (state, instance_id) =>
  fetch(`${_url(state)}/history/incident?processInstanceId=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.process_instance_incidents.value = json))

export const get_process_instance_tasks = (state, instance_id) =>
  fetch(`${_url(state)}/task?processInstanceId=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.process_instance_tasks.value = json))

export const get_called_process_instances = (state, instance_id) =>
  fetch(`${_url(state)}/process-instance?superProcessInstance=${instance_id}`)
    .then(response => response.json())
    .then(json => (state.called_process_instances.value = json))

export const get_called_process_definitions = (state, definition_id) =>
  fetch(`${_url(state)}/process-definition/${definition_id}/static-called-process-definitions`)
    .then(response => response.json())
    .then(json => state.called_definitions.value = json)

export const get_job_definitions = (state, definition_id) =>
  fetch(`${_url(state)}/job-definition?processDefinitionId=${definition_id}`)
    .then(response => response.json())
    .then(json => state.job_definitions.value = json)

export const get_diagram = (state, definition_id) =>
  fetch(`${_url(state)}/process-definition/${definition_id}/xml`)
    .then(response => response.json())
    .then(json => state.process_definition_diagram.value = json)

// getting all tasks, when no sorting is provided it will use "name" and ascending
export const get_task_list = (state, sort_key, sort_order) => {
  const sort = sort_key ? sort_key : 'name'
  const order = sort_order ? sort_order : 'asc'

  return fetch(`${_url(state)}/task?sortBy=${sort}&sortOrder=${order}`, { headers })
    .then((response) => response.json())
}

export const get_task = (state, task_id) =>
   fetch(`${_url(state)}/task/${task_id}`, { headers })
    .then((response) => response.json())


export const get_process_definition_list = (state, ids) =>
   fetch(`${_url(state)}/process-definition?processDefinitionIdIn=${ids}`, { headers })
    .then((response) => response.json())


export const get_generated_form = (state, task_id) =>
   fetch(`${_url(state)}/task/${task_id}/rendered-form`, { headers })
    .then((response) => response.text())


export const claim_task = (task_id, state) =>
  assign_task(true, task_id, state)

export const unclaim_task = (task_id, state) =>
  assign_task(false, task_id, state)

// claim and unclaim tasks
export const assign_task = (claim, task_id, state) => {
  headers.set('Content-Type', 'application/json')

  return fetch(`${_url(state)}/task/${task_id}/${claim ? 'claim' : 'unclaim'}`,
    {
      headers,
      method: 'POST',
      body: JSON.stringify({ userId: state.user_profile.value.id })
    })
    .then((response) => {
      if (!response.ok) {
        console.log(`status: ${response.status}`)
        return false
      }
      return true
    })
}