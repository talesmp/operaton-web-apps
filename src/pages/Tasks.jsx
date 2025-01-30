import { useContext } from 'preact/hooks'
import * as api from '../api.js'
import * as formatter from '../helper/date_formatter.js'
import * as Icons from '../assets/icons.jsx'
import { AppState } from '../state.js'
import { useRoute, useLocation } from 'preact-iso'
import { useSignalEffect } from '@preact/signals'
import { Tabs } from '../components/Tabs.jsx'
import { TaskForm } from './TaskForm.jsx'

const TasksPage = () => {
  const state = useContext(AppState)
  const { params } = useRoute()
  const location = useLocation();
  const server = state.server.value.url

  // when the server is changed and a task is selected, we return to /tasks
  useSignalEffect(() => {
    if (state.server.value.url !== server && location.path !== '/tasks') {
      location.route('/tasks', true)
    }
  })

  // TODO remove it when we have a login
  if (!state.user_profile.value) {
    void api.get_user_profile(state, null)
  }

  void api.get_tasks(state)

  if (params.task_id) {
    void api.get_task(state, params.task_id)
  } else {
    state.task.value = null
  }

  return (
    <main id="tasks" class="fade-in">
      <TaskList />
      { params?.task_id
        ? <Task />
        : <NoSelectedTask /> }
    </main>
  )
}

const NoSelectedTask = () => {
  return (
    <div id="task-details" className="fade-in">
      <div class="task-empty">
        <div class="info-box">
          Please select a task from the task list on the left side.
        </div>
      </div>
    </div>
  )
}

const TaskList = () => {
  const { tasks } = useContext(AppState)

  return <nav id="task-list" aria-label="tasks">
    <div class="tile-filter" id="task-filter">
      <div class="filter-header" onClick={open_filter}>
        <span class="label">Filter Tasks & Search</span>
        <span class="icon down"><Icons.chevron_down /></span>
        <span class="icon up"><Icons.chevron_up /></span>
      </div>
      <div class="filter-menu">
        <menu>
          <li>My Tasks</li>
          <li>Claimed Tasks</li>
        </menu>
      </div>
    </div>

    <ul class="list">
      {tasks.value?.map(task =>
        <TaskTile key={task.id} {...task} />)}
    </ul>
  </nav>
}

const open_filter = () => {
  const menu = document.getElementById('task-filter')
  menu.classList.toggle('open')
}

const TaskTile = ({ id, name, created, assignee, priority, def_name }) => {
  const state = useContext(AppState);
  const selected = state.task.value?.id === id

  return (
    <li key={id} class={ selected ? 'selected' : ''}>
      <a href={`/tasks/${id}/${task_tabs[0].id}`} data-task-id={id} aria-labelledby={id}>
        <header>
          <span>{def_name}</span>
          <span>{formatter.formatRelativeDate(created)}</span>
        </header>
        <div id={id} class="title">{name}</div>
        <footer>
          <span>Assigned to <em>{assignee ? (state.user_profile.value && state.user_profile.value.id === assignee ? 'me' :assignee) : 'no one'}</em></span>
          <span class="tile-right">Priority {priority}</span>
        </footer>
      </a>
    </li>
  )}

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
    target: <TaskForm />
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

export { TasksPage }



