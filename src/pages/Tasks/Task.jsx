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
      <div className="task-menu">
        <menu>
          {(() => {
            // show claim only, if this task has no assignee
            if (!task.assignee && user && user.id !== task.assignee) {
              return (
                <li aria-label="Claim Task"
                  onClick={() => claim_task(state, true, task)}>
                  <div className="border">
                    <span class="icon"><Icons.user_plus /></span>
                    <span class="label">Claim</span>
                  </div>
                </li>
              )
              // show unclaim, when the current user is the assignee
            } else if (user && user.id === task.assignee) {
              return (
                <li aria-label="Unclaim Task"
                  onClick={() => claim_task(state, false, task)}>
                  <div class="border">
                    <span class="icon"><Icons.user_minus /></span>
                    <span class="label">Unclaim</span>
                  </div>
                </li>
              )
            } // show reset
            return (
              <li aria-label="Reset"
                onClick={() => assign_task(state, null, task)}>
                <div class="border">
                  <span class="icon"><Icons.user_minus /></span>
                  <span class="label">Reset Assignee</span>
                </div>
              </li>
            )
          })()}
          <li>
            <div class="border">
              <span class="icon"><Icons.users /></span>
              <span class="label">Set Group</span>
            </div>
          </li>
          <li>
            <div class="border">
              <span class="icon"><Icons.calendar /></span>
              <span class="label">Set Follow Up Date</span>
            </div>
          </li>
          <li>
            <div class="border">
              <span class="icon"><Icons.bell /></span>
              <span class="label">Set Due Date</span>
            </div>
          </li>
          <li>
            <span class="icon"><Icons.chat_bubble_left /></span>
            <span class="label">Comment</span>
          </li>
        </menu>
        <menu>
          <li>
            <span class="icon"><Icons.play /></span>
            <span class="label">Start Process</span>
          </li>
        </menu>
      </div>

      <div class="task-container">
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
              <p class="title">Description</p>
              {task.description}
            </div>)
          }

        })()}

        <div class="task-tabs">
          {(() => {  // instead of duplicate code we have more code here, yeah (but you can add easily a tab)
            const helper = []
            tabs.forEach((value, key) => {
              helper.push(<a class={tab === key ? 'selected' : ''}
                             id={key}
                             href={`/tasks/${state.selected_task.value.id}/${key.substring(key.lastIndexOf('-') + 1)}`}>{value}</a>)
            })
            return helper
          })()}
        </div>

        <div
          class={tab !== 'task-tab-form' ? 'tab-content hide' : 'tab-content'}>
          <Form />
        </div>

        <div
          class={tab !== 'task-tab-history' ? 'tab-content hide' : 'tab-content'}>
          HISTORY
        </div>

        <div
          class={tab !== 'task-tab-diagram' ? 'tab-content hide' : 'tab-content'}>
          DIAGRAM
        </div>
      </div>
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
  });
}

export { Task }