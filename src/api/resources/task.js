import { GET, GET_TEXT, POST } from '../helper.jsx'

// Tasks nach Process Instance
const get_process_instance_tasks = (state, instance_id) =>
  GET(`/task?processInstanceId=${instance_id}`, state, state.api.task.by_process_instance)

// Einzelnen Task laden
const get_task = (state, task_id) =>
  GET(`/task/${task_id}`, state, state.api.task.one)

// Gerenderte Form holen (Response ist kein json sondern das html)
const get_task_rendered_form = (state, task_id) =>
  GET_TEXT(`/task/${task_id}/rendered-form`, state, state.api.task.rendered_form)

// Deployment-Form holen
const get_task_deployed_form = (state, task_id) =>
  GET(`/task/${task_id}/deployed-form`, state, state.api.task.deployed_form)

// Claim / Unclaim / Assign
const claim_task = (state, task_id) =>
  POST(`/task/${task_id}/claim`, { userId: state.user_profile.value.id }, state, state.api.task.claim_result)

const unclaim_task = (state, task_id) =>
  POST(`/task/${task_id}/unclaim`, { userId: state.user_profile.value.id }, state, state.api.task.claim_result)

const assign_task = (state, assignee, task_id) =>
  POST(`/task/${task_id}/assignee`, { userId: assignee }, state, state.api.task.assign_result)

// Task-Liste laden + mit Definitionen anreichern
const get_tasks = (state, sort_key = 'name', sort_order = 'asc') =>
  GET(`/task?sortBy=${sort_key}&sortOrder=${sort_order}`, state, state.api.task.list)
    .then(() => {
      const tasks = state.api.task.list.value?.data ?? []
      const definition_ids = [...new Set(tasks.map(task => task.processDefinitionId))]

      return get_task_process_definitions(state, definition_ids)
        .then(defList => {
          const defMap = new Map(defList.map(def => [def.id, def]))

          tasks.forEach(task => {
            const def = defMap.get(task.processDefinitionId)
            task.def_name = def?.name ?? ''
            task.def_version = def?.version ?? ''
          })


        })
    })

// Hilfsmethode – kein Signal
const get_task_process_definitions = (state, ids) =>
  fetch(`${state.server.value.url}/engine-rest/process-definition?processDefinitionIdIn=${ids}`, {
    headers: new Headers({ Authorization: `Basic ${window.btoa('demo:demo')}` }) // fallback, wenn global fehlt
  }).then(r => r.json())

// Task-Formular absenden (kein Signal nötig, da redirect)
const post_task_form = (state, task_id, data) => 
  POST(`/task/${task_id}/submit-form`, {
    variables: data,
    withVariablesInReturn: true
  }, state, state.api.task.submit_form)



// Export als Aufgaben-Modul
const task = {
  get_tasks,
  get_task,
  get_process_instance_tasks,
  get_task_rendered_form,
  get_task_deployed_form,
  claim_task,
  unclaim_task,
  assign_task,
  post_task_form
}

export default task
