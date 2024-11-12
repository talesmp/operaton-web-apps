import { useContext } from 'preact/hooks'
import * as api from '../../api'
import * as formatter from '../../helper/formatter'
import { Task } from './Task.jsx'
import * as Icons from '../../assets/icons.jsx'
import { AppState } from '../../state.js'
import { useComputed, useSignalEffect } from '@preact/signals'
import { useRoute } from 'preact-iso'

const Tasks = () => {
  const state = useContext(AppState)
  const { params } = useRoute()


  // TODO remove it when we have a login
  if (!state.user_profile.value) {
    api.get_user_profile(state, null)
  }

  void api.get_tasks(state)

  // set the selected task here
  useSignalEffect(() => {
    // have a look for a given task ID and set the selected task
    if (params.task_id && state.tasks.value) {
      // prevent infinite loop
      if (!state.selected_task.value || params.task_id !== state.selected_task.value.id) {
        const task = state.tasks.value.find(elem => elem.id === params.task_id)

        if (task) {
          state.selected_task.value = task;
        }
      }
    }

    // no selected task? use the first one of the list
    if (!state.selected_task.value && state.tasks.value) {
      state.selected_task.value = state.tasks.value[0]
      //location.route(`/tasks/${state.selected_task.value.id}`, true)
    }
  })



  return (
    <main id="tasks" class="fade-in">
      <TaskList />
      { state.selected_task.value ? <Task key={state.selected_task.value.id} /> : '' }
    </main>
  )
}

const TaskList = () =>
  <aside aria-label="task list">
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
      {useContext(AppState).tasks.value?.map(task =>
        <TaskTile key={task.id} {...task} />)}
    </ul>
  </aside>

const open_filter = () => {
  const menu = document.getElementById('task-filter')
  menu.classList.toggle('open')
}

const TaskTile = ({ id, name, created, assignee, priority, def_name }) => {
  const state = useContext(AppState);
  const selected = useComputed(() => state.selected_task.value && state.selected_task.value.id === id)

  return (
    <li key={id} class={ selected.value ? 'tile selected' : 'tile'}>
      <a href={`/tasks/${id}`} data-task-id={id} aria-labelledby={id}>
        <div class="tile-row">
          <div>{def_name}</div>
          <div
            class="tile-right">{formatter.formatRelativeDate(created)}</div>
        </div>
        <div id={id} class="tile-title">{name}</div>
        <div class="tile-row">
          <div>Assigned to <b>{assignee ? (state.user_profile.value && state.user_profile.value.id === assignee ? 'me' :assignee) : 'no one'}</b>
          </div>
          <div class="tile-right">Priority {priority}</div>
        </div>
      </a>
    </li>
  )}

export { Tasks }



