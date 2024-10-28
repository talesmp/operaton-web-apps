import { useEffect, useState, useContext } from 'preact/hooks'
import * as api from '../../api'
import * as formatter from '../../helper/formatter'
import { Task } from './Task.jsx'
import * as Icons from '../../assets/icons.jsx'
import { AppState } from '../../state.js'

export function Tasks () {
  const [tasks, setTasks] = useState([]) // task list on left bar
  const [selected, setSelected] = useState({}) // the selected task
  const state = useContext(AppState)

  // TODO remove it when we have a login
  if (!state.user_profile.value) {
    console.log('setting profile')
    api.get_user_profile(state, null)
  }

  if (state.user_profile.value) {
    console.log('user ID: ' + state.user_profile.value.id)
  }

  // get task list when page is initially loaded
  useEffect(() => {
    api.get_task_list().then((list) => {
      // we need a second call for getting the process definition names
      const ids = list.map(task => task.processDefinitionId) // list of needed process definitions

      api.get_process_definition_list(ids)
        .then(
          (defList) => {
            const defMap = new Map() // helper map, mapping ID to process name
            defList.map(def => defMap.set(def.id, def))

            // set process name to task list
            list.forEach((task) => {
              const def = defMap.get(task.processDefinitionId)
              task.def_name = def ? def.name : ''
              task.def_version = def ? def.version : ''
            })
            setTasks(list) // store task list

            // select the first task in the list to show some data on the right side
            if (list.length > 0) {
              setSelected(list[0])
            }
          }
        )
    })
  }, [])
  // TODO do we need the div here?
  return (
    <main id="tasks" class="fade-in">
      <aside aria-label="task list">
        <div className="tile-filter" id="task-filter">
          <div className="filter-header" onClick={openFilter}>
            <span className="label">Filter Tasks & Search</span>
            <span className="icon down"><Icons.chevron_down /></span>
            <span className="icon up"><Icons.chevron_up /></span>
          </div>
          <div className="filter-menu">
            <menu>
              <li>My Tasks</li>
              <li>Claimed Tasks</li>
            </menu>
          </div>
        </div>

        <ul className="tile-list">
          {tasks.map(task => (
            <TaskTile
              key={task.id}
              task={task} selected={task.id === selected.id}
              setSelected={setSelected} state={state} />))}
        </ul>
      </aside>
      <Task selected={selected} setSelected={setSelected} />
    </main>
  )
}

const TaskTile = ({ task, selected, setSelected, state }) => (
  <li class={selected ? 'tile selected' : 'tile'}>
    <a href="" data-task-id={task.id} aria-labelledby={task.id}
       onClick={() => setSelected(task)}>
      <div className="tile-row">
        <div>{task.def_name}</div>
        <div
          className="tile-right">{formatter.formatRelativeDate(task.created)}</div>
      </div>
      <h4 id={task.id}>{task.name}</h4>
      <div className="tile-row">
        <div>Assigned to <b>{task.assignee ? // we compare the assignee with the current user ID, if it's equal show "me"
          (state.user_profile.value && state.user_profile.value.id === task.assignee ? 'me' : task.assignee)
          : 'no one'}</b></div>
        <div className="tile-right">Priority {task.priority}</div>
      </div>
    </a>
  </li>
)

function openFilter () {
  const menu = document.getElementById('task-filter')
  menu.classList.toggle('open')
}




