import * as Icons from '../../assets/icons.jsx'
import { useContext } from 'preact/hooks'
import { Form } from './Form.jsx'
import { AppState } from '../../state.js'
import * as api from '../../api'
import { useSignalEffect } from '@preact/signals'
import { Tabs } from '../../components/Tabs.jsx'

const Task = () => {
  const state = useContext(AppState)
  const task = state.selected_task.value
  const user = state.user_profile.value

  useSignalEffect(() => {
    if (state.task_change_result.value) {
      state.task_change_result.value = null // we have to reset the value here to be aware for the next task changes
      api.get_task(state, state.selected_task.peek().id)
    }
  })

  useSignalEffect(() => {
    const changedTask = state.task.value

    if (changedTask) {
      changedTask.def_name = state.selected_task.peek().def_name
      changedTask.def_version = state.selected_task.peek().def_version

      state.selected_task.value = changedTask
      state.task.value = null // reset the value because with setting the selected task the effect is triggered again
      update_task_list(state, changedTask)
    }
  })

  return (
    <div id="task-details" className="fade-in">
      <menu class="action-bar">
        <li>
          {(!task.assignee && user && user.id !== task.assignee)
            ?
            <button onClick={() => claim_task(state, true, task)}>
              <Icons.user_plus /> Claim
            </button>
            : (user && user.id === task.assignee)
              ? <button onClick={() => claim_task(state, false, task)}>
                <Icons.user_minus /> Unclaim
              </button>
              : <button onClick={() => assign_task(state, null, task)}>
                <Icons.user_minus /> Reset Assignee
              </button>
          }
        </li>
        <li>
          <button><Icons.users /> Set Group</button>
        </li>
        <li>
          <button><Icons.calendar /> Set Follow Up Date</button>
        </li>
        <li>
          <button><Icons.bell /> Set Due Date</button>
        </li>
        <li>
          <button><Icons.chat_bubble_left /> Comment</button>
        </li>
        <li>
          <button><Icons.play /> Start Process</button>
        </li>
      </menu>

      <section class="task-container">
        {task.def_name} [Process version: v{task.def_version} | <a href="">Show
        process</a>]
        <h2>{task.name}</h2>

        {(task.description) ??
          <>
            <h3>Description</h3>
            <p>{task.description}</p>
          </>}

        <Tabs tabs={task_tabs}
              base_url={`/tasks/${state.selected_task.value.id}`} />
      </section>
    </div>
  )
}

const claim_task = (state, claim, selectedTask) => {
  api.post_task_claim(state, claim, selectedTask.id)
}

const assign_task = (state, assignee, selectedTask) => {
  api.post_task_assign(state, assignee, selectedTask.id)
}

// update the task list with a changed task
const update_task_list = (state, task) => {
  state.tasks.value = state.tasks.value.map((item) => {
    if (item.id === task.id) {
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

export { Task }