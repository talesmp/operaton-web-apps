import { useState, useContext } from 'preact/hooks'
import DOMPurify from 'dompurify'
import { AppState } from '../state.js'
import engine_rest from '../api/engine_rest.jsx'
import * as Icons from '../assets/icons.jsx'
import { useRoute } from 'preact-iso/router'

const TaskForm = () => {
  const [generated, setGenerated] = useState('')
  const [deployed, setDeployed] = useState([])
  const [error, setError] = useState(null)
  const state = useContext(AppState)

  const task = state.api.task.one.value.data
  const refName = state.server.value.c7_mode ? 'camundaFormRef' : 'operatonFormRef'

  if (!task) return <p class="info-box">No task selected.</p>
  console.log(state)

  const rendered_form = state.api.task.rendered_form.value
  const deployed_form = state.api.task.deployed_form.value

  // === Form abrufen, falls noch nicht geladen ===
  if (!task.data?.formKey && !task[refName] && !rendered_form) {
    void engine_rest.task.get_task_rendered_form(state, task.id)
    console.log(rendered_form)
  }

  if (!task.formKey && task[refName] && !deployed_form) {
    void engine_rest.task.get_task_deployed_form(state, task.id)
  }

  // === Formdaten parsen ===
  if (rendered_form.data && generated === '') {
    setGenerated(parse_html(state, rendered_form.data))
  }

  if (deployed_form && deployed.length === 0) {
    setDeployed(prepare_form_data(deployed_form))
  }

  // === Rendering ===
  if (task.formKey) {
    const formLink = task.formKey.substring(13)
    return (
      <a href={`http://localhost:8888/${formLink}`} target="_blank" rel="noreferrer">Embedded Form</a>
    )
  }

  if (task[refName]) {
    return (
      <div id="deployed-form" class="task-form">
        <form>
          {deployed.map(({ key, value }) =>
            <DeployedFormRow key={key} components={value} />)}
        </form>
      </div>
    )
  }

  return (
    <>
      <div>(*) required field</div>
      <div id="generated-form" class="task-form">
        <form onSubmit={(e) => post_form(e, state, setError)}>
          <div class="form-fields" dangerouslySetInnerHTML={{ __html: generated }} />

          <div class={`error ${error ? 'show' : 'hidden'}`}>
            <span class="icon"><Icons.exclamation_triangle /></span>
            <span class="error-text">{error}</span>
          </div>
          <div class="form-buttons">
            <button type="submit">Complete Task</button>
            <button type="button" class="secondary" onClick={() => store_data(state)}>Save Form</button>
          </div>
        </form>
      </div>
    </>
  )
}

const parse_html = (state, html) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const form = doc.getElementsByTagName('form')[0]
if (!form) {
  console.warn('No <form> element found in rendered form HTML')
  return '<p class="info-box">No form available for this task.</p>'
}
  const disable = state.api.user?.profile?.value?.id !== state.api.task.value?.data.assignee

  let storedData = localStorage.getItem(`task_form_${state.api.task?.value?.data?.id}`)
  if (storedData) storedData = JSON.parse(storedData)

  const inputs = form.getElementsByTagName('input')
  const selects = form.getElementsByTagName('select')

  for (const field of inputs) {
    if (!field.getAttribute('name')) field.name = 'name'
    if (field.hasAttribute('uib-datepicker-popup')) field.type = 'date'
    if (field.getAttribute('cam-variable-type') === 'Long') field.type = 'number'
    if (disable) field.setAttribute('disabled', 'disabled')
    if (field.hasAttribute('required')) field.previousElementSibling.textContent += '*'

    if (storedData) {
      if (field.type === 'checkbox' && storedData[field.name]?.value) {
        field.checked = true
      } else if (storedData[field.name]) {
        field.value = storedData[field.name].value
      }
    }
  }

  for (const field of selects) {
    if (disable) field.setAttribute('disabled', 'disabled')
    if (storedData?.[field.name]) {
      for (const option of field.children) {
        if (option.value === storedData[field.name].value) {
          option.selected = true
        }
      }
    }
  }

  return DOMPurify.sanitize(form.innerHTML, { ADD_ATTR: ['cam-variable-type'] })
}

const post_form = (e, state, setError) => {
  const { params } = useRoute()
  e.preventDefault()
  setError(null)

  const task_id = params.task_id
  const data = build_form_data()

  const message = engine_rest.task.post_task_form(state, task_id, data)

  if (message) {
    setError(message)
  } else {
    localStorage.removeItem(`task_form_${task_id}`)
  }
}

const store_data = (state) => {
  const data = build_form_data(true)
  localStorage.setItem(`task_form_${state.task.value?.id}`, JSON.stringify(data))
}

const build_form_data = (temporary = false) => {
  const inputs = document.getElementById('generated-form').getElementsByClassName('form-control')
  const data = {}

  for (let input of inputs) {
    const name = input.name
    if (!name) continue

    switch (input.type) {
      case 'checkbox':
        data[name] = { value: input.checked }
        break
      case 'date': {
        if (input.value) {
          const val = temporary ? input.value : input.value.split('-').reverse().join('/')
          data[name] = { value: val }
        }
        break
      }
      case 'number':
        if (input.value) data[name] = { value: parseInt(input.value, 10) }
        break
      default:
        if (input.value) data[name] = { value: input.value }
    }
  }

  return data
}

const prepare_form_data = (form) => {
  const components = []
  let rowName = ''
  let row = []

  form.components.forEach((component, index) => {
    if (rowName !== component.layout.row) {
      if (rowName !== '') components.push({ key: rowName, value: row })
      row = []
      rowName = component.layout.row
    }

    row.push(component)

    if (index === form.components.length - 1) {
      components.push({ key: rowName, value: row })
    }
  })

  return components
}

const DeployedFormRow = ({ components }) => (
  <div class="form-fields">
    {components?.map(component =>
      <DeployedFormComponent key={component.id} component={component} />)}
  </div>
)

const DeployedFormComponent = ({ component }) => {
  const colSize = component.layout.columns || 16

  const content = (() => {
    switch (component.type) {
      case 'spacer': return <span>&nbsp;</span>
      case 'separator': return <hr />
      case 'text': return <div class="task-text">{component.text}</div>
      case 'checklist':
      case 'radio': return <MultiInput component={component} />
      case 'select': return <Select component={component} />
      default: return <Input type={component.type} component={component} />
    }
  })()

  return <div class={`col col-${colSize}`}>{content}</div>
}

const Input = ({ type, component }) => {
  let inputType = type === 'textfield' ? 'text' : type
  if (inputType === 'datetime') {
    inputType = component.subtype === 'datetime' ? 'datetime-local' : component.subtype
  }

  const label = component.dateLabel || component.timeLabel || component.label

  return (
    <>
      <label>{label}<br />
        <input
          class="form-control"
          type={inputType}
          name={component.key}
          required={component.validate?.required}
          min={component.validate?.min}
          max={component.validate?.max}
          maxLength={component.validate?.maxlength}
          pattern={component.validate?.pattern}
          step={component.validate?.step}
        />
      </label>
    </>
  )
}

const Select = ({ component }) => (
  <>
    <label>{component.label}</label>
    <select class="form-control" name={component.key}>
      {component.values.map(opt =>
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      )}
    </select>
  </>
)

const MultiInput = ({ component }) => {
  const type = component.type === 'checklist' ? 'checkbox' : component.type

  return (
    <>
      <label>{component.label}</label>
      {component.values.map(opt => (
        <div class="input-list" key={`list_${opt.value}`}>
          <input type={type} name={opt.value} value={opt.value} class="form-control" />
          <label>{opt.label}</label>
        </div>
      ))}
    </>
  )
}

export { TaskForm }
