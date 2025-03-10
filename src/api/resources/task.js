import { GET, POST } from '../helper.jsx'

const get_process_instance_tasks = (state, instance_id) =>
  GET(`/task?processInstanceId=${instance_id}`, state, state.api.task.by_process_instance)

const get_task = (state, task_id) =>
  GET(`/task/${task_id}`, state, state.task)

const get_task_rendered_form = (state, task_id) =>
  GET(`/task/${task_id}/rendered-form`, state, state.task_generated_form)

const get_task_deployed_form = (state, task_id) =>
  GET(`/task/${task_id}/deployed-form`, state, state.task_deployed_form)

const claim_task = (state, task_id) =>
  POST(`/task/${task_id}/claim`, { userId: state.user_profile.value.id }, state, state.task_claim_result)

const unclaim_task = (state, task_id) =>
  POST(`/task/${task_id}/unclaim`, { userId: state.user_profile.value.id }, state, state.task_claim_result)

const assign_task = (state, assignee, task_id) =>
  POST(`/task/${task_id}/assignee`, { userId: assignee }, state, state.task_assign_result)

/* return null or error message from server, in fact all validation should be done by HTML5 validation, but who knows ... */
const post_task_form = (state, task_id, data) => {
  fetch(`${_url(state)}/task/${task_id}/submit-form`,
    {
      headers: headers_json,
      method: 'POST',
      body: JSON.stringify({ variables: data, withVariablesInReturn: true })
    })
    .then((response) => response.json())
    .then(json => {
      // if there is a json type, we get an error message back
      if (!json.type) {
        state.tasks.value = null
        // it's important that the form data is cleared before the task data, because the signal effect will be called immediately
        state.task_generated_form.value = null
        state.selected_task.value = null // the task is completed, so let it go
      } else {
        return json.message
      }
    })

  return null
}

const get_tasks = (state, sort_key = 'name', sort_order = 'asc') =>
  fetch(`${_url(state)}/task?sortBy=${sort_key}&sortOrder=${sort_order}`, { headers })
    .then((response) => response.json())
    .then(json => {
      const definition_ids = [...new Set((json.map(task => task.processDefinitionId)))]

      // we need the process definition name for each task
      get_task_process_definitions(state, definition_ids)
        .then(defList => {
          const defMap = new Map() // helper map, mapping ID to process name
          defList.map(def => defMap.set(def.id, def))

          // set process name to task list
          json.forEach((task) => {
            const def = defMap.get(task.processDefinitionId)
            task.def_name = def ? def.name : ''
            task.def_version = def ? def.version : ''
          })

          state.tasks.value = json
        })
    })

// API call to enhance the data of the task list, no need for signal here
const get_task_process_definitions = (state, ids) =>
  fetch(`${_url(state)}/process-definition?processDefinitionIdIn=${ids}`, { headers })
    .then((response) => response.json())

const task = {
  by_process_instance: get_process_instance_tasks,
}

export default task