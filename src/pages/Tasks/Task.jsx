import * as Icons from '../../assets/icons.jsx'
import { useContext } from 'preact/hooks'
import { Form } from './Form.jsx'
import { AppState } from '../../state.js'
import * as api from '../../api'
import { Tabs } from '../../components/Tabs.jsx'
import { useRoute } from 'preact-iso'

const Task = () => {
  const
    state = useContext(AppState),
    { params } = useRoute()

  void api.get_task(state, params.task_id)

  return (
    <div id="task-details" className="fade-in">
      <menu class="action-bar">
        <li><TaskActionBar /></li>
        <li><button><Icons.users /> Set Group</button></li>
        <li><button><Icons.calendar /> Set Follow Up Date</button></li>
        <li><button><Icons.bell /> Set Due Date</button></li>
        <li><button><Icons.chat_bubble_left /> Comment</button></li>
        <li><button><Icons.play /> Start Process</button></li>
      </menu>

      <TaskDetails />
    </div>
  )
}

const TaskDetails = () => {
  const { task } = useContext(AppState)

  return <section className="task-container">
    {task.value?.def_name} [Process version: v{task.value?.def_version} | <a
    href="">Show
    process</a>]
    <h2>{task.value?.name}</h2>

    {(task.value?.description) ??
      <>
        <h3>Description</h3>
        <p>{task.value?.description}</p>
      </>}

    <Tabs tabs={task_tabs}
          base_url={`/tasks/${task.value?.id}`} />
  </section>
}

const TaskActionBar = () => {
  const
    state = useContext(AppState),
    { task, user } = state

  return (!task.value?.assignee && user && user.id !== task.value?.assignee)
    ?
    <button onClick={() => claim_task(state, true, task)}>
      <Icons.user_plus /> Claim
    </button>
    : (user && user.id === task.value?.assignee)
      ? <button onClick={() => claim_task(state, false, task)}>
        <Icons.user_minus /> Unclaim
      </button>
      : <button onClick={() => assign_task(state, null, task)}>
        <Icons.user_minus /> Reset Assignee
      </button>

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
    if (item.id === task.value?.id) {
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