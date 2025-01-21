import * as Icons from '../../assets/icons.jsx'
import { useContext } from 'preact/hooks'
import { Form } from './Form.jsx'
import { AppState } from '../../state.js'
import * as api from '../../api'
import { Tabs } from '../../components/Tabs.jsx'
import { useSignalEffect, signal } from '@preact/signals'

const Task = () => {
  const state = useContext(AppState)
  let initial = true

  // when something has changed (e.g. assignee) in the task we have to update the task list
  useSignalEffect(() => {
    if (state.task.value && initial) {
      initial = false
    } else if (state.task.value && state.tasks.peek()) {
      update_task_list(state, state.task.value)
    }
  })

  return (
    <div id="task-details" className="fade-in">
      <menu class="action-bar">
        <li><ResetAssigneeBtn /></li>
        <li>
          <button class="secondary"><Icons.users /> Set Group</button>
        </li>
        <li>
          <button class="secondary"><Icons.calendar /> Set Follow Up Date</button>
        </li>
        <li>
          <button class="secondary"><Icons.bell /> Set Due Date</button>
        </li>
        <li>
          <button class="secondary"><Icons.chat_bubble_left /> Comment</button>
        </li>
        <li>
          <button class="secondary"><Icons.play /> Start Process</button>
        </li>
      </menu>

      <TaskDetails />
    </div>
  )
}

const TaskDetails = () => {
  const { task, task_claim_result, task_assign_result } = useContext(AppState)

  task_claim_result.value = null
  task_assign_result.value = null

  return <section className="task-container">
    {task.value?.def_name} [Process version: v{task.value?.def_version} | <a href="">Show process</a>]
    <h3>{task.value?.name}</h3>

    {task.value?.description ?? <p>{task.value?.description}</p>}

    <Tabs tabs={task_tabs}
          base_url={`/tasks/${task.value?.id}`}
          className="fade-in" />
  </section>
}

const ResetAssigneeBtn = () => {
  const
    state = useContext(AppState),
    { task, user_profile, task_claim_result, task_assign_result } = state,
    user_is_assignee = task.value?.assignee,
    assignee_is_different_user = task.value?.assignee && !(user_profile.value && user_profile.value.id === task.value?.assignee)

  return assignee_is_different_user && !(task_assign_result.value?.success ?? false)
    ? <button onClick={() => api.assign_task(state, null, task.value.id)} className="secondary">
        <Icons.user_minus /> Reset Assignee
      </button>
    : user_is_assignee || (task_claim_result.value?.success ?? false)
      ? <button onClick={() => api.unclaim_task(state, task.value.id)} className="secondary">
          <Icons.user_minus /> Unclaim
        </button>
      : <button onClick={() => api.claim_task(state, task.value.id)} className="secondary">
          <Icons.user_plus /> Claim
        </button>
}


// update the task list with a changed task, avoid reloading the task list
const update_task_list = (state, task) => {
  console.log('map')
  state.tasks.value = state.tasks.peek().map((item) => {
    if (item.id === task.id) {
      task.def_name = item.def_name
      task.def_version = item.def_version

      return task
    }

    return item
  })
}

const task_tabs = [
  {
    name: 'Form',
    id: 'form',
    pos: 0,
    target: <Form />
  },
  {
    name: 'History',
    id: 'history',
    pos: 1,
    target: <p>History</p>
  },
  {
    name: 'Diagram',
    id: 'diagram',
    pos: 2,
    target: <p>Diagram</p>
  }]

export { Task, task_tabs }