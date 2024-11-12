import * as Icons from '../../assets/icons.jsx'
import { useState, useContext } from 'preact/hooks'
import { Form } from './Form.jsx'
import { AppState } from '../../state.js'
import * as api from '../../api'
import { useRoute } from 'preact-iso'
import { useSignalEffect } from '@preact/signals'

const Task = () => {
  const state = useContext(AppState)
  const task = state.selected_task.value
  const user = state.user_profile.value

  const [tab, setTab] = useState('task-tab-form')
  const { params } = useRoute()

  // tabs on the task main page
  const tabs = new Map([
    ['task-tab-form', 'Form'],
    ['task-tab-history', 'History'],
    ['task-tab-diagram', 'Diagram']
  ])

  // tab can be called directly
  if (params.tab) {
    setTab(`task-tab-${params.tab}`)
  }

  useSignalEffect(() => {
    if (state.task_claim_result.value) {
      api.get_task(state, state.selected_task.peek().id)
    }
  })

  useSignalEffect(() => {
    const task = state.task.value

    if (task) {
      task.def_name = state.selected_task.peek().def_name
      task.def_version = state.selected_task.peek().def_version

      state.selected_task.value = task
      update_task_list(state, task)
    }
  })

  return (
    <div id="task-details" className="fade-in">
      <div className="task-menu">
        <menu>
          {(() => {
            // show claim only, if this task has another assignee
            if (user && user.id !== task.assignee) {
              return (
                <li
                  onClick={() => assign_task(state, true, task)}>
                  <div className="border">
                    <span className="icon"><Icons.user_plus /></span>
                    <span className="label">Claim</span>
                  </div>
                </li>
              )
            } else if (user && user.id === task.assignee) {
              return (
                <li
                  onClick={() => assign_task(state, false, task)}>
                  <div className="border">
                    <span className="icon"><Icons.user_minus /></span>
                    <span className="label">Unclaim</span>
                  </div>
                </li>
              )
            }
          })()}
          <li>
            <div className="border">
              <span className="icon"><Icons.users /></span>
              <span className="label">Set Group</span>
            </div>
          </li>
          <li>
            <div className="border">
              <span className="icon"><Icons.calendar /></span>
              <span className="label">Set Follow Up Date</span>
            </div>
          </li>
          <li>
            <div className="border">
              <span className="icon"><Icons.bell /></span>
              <span className="label">Set Due Date</span>
            </div>
          </li>
          <li>
            <span className="icon"><Icons.chat_bubble_left /></span>
            <span className="label">Comment</span>
          </li>
        </menu>
        <menu>
          <li>
            <span className="icon"><Icons.play /></span>
            <span className="label">Start Process</span>
          </li>
        </menu>
      </div>

      <div className="task-container">
        <div style="display: flex;">
          <div>{task.def_name}</div>
          <div>[Process version: v{task.def_version} | <a href="">Show
            process</a>]
          </div>
        </div>

        <h1>{task.name}</h1>

        {(() => {
          if (task.description) {
            return (<div>
              <p className="title">Description</p>
              {task.description}
            </div>)
          }

        })()}

        <div className="task-tabs">
          {(() => {  // instead of duplicate code we have more code here, yeah (but you can add easily a tab)
            const helper = []
            tabs.forEach((value, key) => {
              helper.push(<a className={tab === key ? 'selected' : ''}
                             id={key}
                             href={`/tasks/${state.selected_task.value.id}/${key.substring(key.lastIndexOf('-') + 1)}`}>{value}</a>)
            })
            return helper
          })()}
        </div>

        <div
          className={tab !== 'task-tab-form' ? 'tab-content hide' : 'tab-content'}>
          <Form />
        </div>

        <div
          className={tab !== 'task-tab-history' ? 'tab-content hide' : 'tab-content'}>
          HISTORY
        </div>

        <div
          className={tab !== 'task-tab-diagram' ? 'tab-content hide' : 'tab-content'}>
          DIAGRAM
        </div>
      </div>
    </div>
  )
}

const assign_task = (state, claim, selectedTask) => {
  api.post_task_claim(state, claim, selectedTask.id)
}

// update the task list with a changed task
const update_task_list = (state, task) => {
  state.tasks.value = state.tasks.value.map((item) => {
    if (item.id === task.id) {
        return task
    }

    return item
  });
}

export { Task }