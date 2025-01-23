import * as Icons from '../../assets/icons.jsx'
import { useContext } from 'preact/hooks'
import { Form } from './Form.jsx'
import { AppState } from '../../state.js'
import * as api from '../../api'
import { Tabs } from '../../components/Tabs.jsx'
import { useSignalEffect } from '@preact/signals'

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
  const { task } = useContext(AppState)

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
    { task, user_profile } = state

  return (!task.value?.assignee)
    ?
    <button onClick={() => claim_task(state, true, task)} class="secondary">
      <Icons.user_plus /> Claim
    </button>
    : (user_profile.value && user_profile.value.id === task.value?.assignee)
      ? <button onClick={() => claim_task(state, false, task)} class="secondary">
        <Icons.user_minus /> Unclaim
      </button>
      : <button onClick={() => assign_task(state, null, task)} class="secondary">
        <Icons.user_minus /> Reset Assignee
      </button>

}

const claim_task = (state, claim, selectedTask) => {
  api.post_task_claim(state, claim, selectedTask.value.id)
}

const assign_task = (state, assignee, selectedTask) => {
  api.post_task_assign(state, assignee, selectedTask.value.id)
}

// update the task list with a changed task, avoid reloading the task list
const update_task_list = (state, task) => {
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