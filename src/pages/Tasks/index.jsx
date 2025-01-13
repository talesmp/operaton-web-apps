import { useContext } from 'preact/hooks'
import * as api from '../../api'
import * as formatter from '../../helper/formatter'
import { Task } from './Task.jsx'
import * as Icons from '../../assets/icons.jsx'
import { AppState } from '../../state.js'
import { useSignalEffect } from '@preact/signals'
import { useRoute } from 'preact-iso'

const Tasks = () => {
  const state = useContext(AppState)
  const { params } = useRoute()

  // TODO remove it when we have a login
  if (!state.user_profile.value) {
    void api.get_user_profile(state, null)
  }
  void api.get_tasks(state)

  // if (params.task_id) {
  //   void api.get_task(state, params.task_id)
  // } else {
  //   state.task.value = null
  // }
  return (
    <main id="tasks" class="fade-in">
      <TaskList />
      { params?.task_id
        ? <Task />
        : <NoSelectedTasks /> }
    </main>
  )
}

const NoSelectedTasks = () => {
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

    <ul class="tile-list">
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
      <a href={`/tasks/${id}`} data-task-id={id} aria-labelledby={id}>
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

export { Tasks }



