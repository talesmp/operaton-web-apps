import { useContext } from 'preact/hooks'
import { AppState } from '../state.js'
import * as Icons from '../assets/icons.jsx'
import { signal } from '@preact/signals'
import engine_rest from '../api/engine_rest.jsx'

const StartProcessList = () => {
  const
    state = useContext(AppState),
    show_processes = signal(false),
    process_list = signal([]),
    search_term = signal(''),
    formFields = [],
    start_processID = signal(null),
    display_start_formular = signal(false)

  let filtered_processes = []
  let rendered_form = ''
  let request_body_submit_form
  request_body_submit_form = {
    variables: {},
    business_key: 'myBusinessKey'
  }

  /**
   * display_processes()
   * -------------------
   * Toggles visibility of the process list.
   * When becoming visible, it fetches the available processes via the API.
   *
   * Affects:
   * - show_processes: toggled to show/hide process list
   * - process_list: populated with fetched data
   */
  const display_processes = async () => {
    show_processes.value = !show_processes.value
    if (show_processes.value) {
      try {
        process_list.value = await engine_rest.process_definition.list_startable(state)
      } catch (error) {
        console.error('Error fetching processes:', error)
      }
    }
  }
  // Filters the process list using the current search term
  if (process_list.value) {
    if (Array.isArray(process_list.value.data)) {
      filtered_processes = process_list.value.data.filter((process) => {
        const process_name = process?.name || ''
        return process_name
          .toLowerCase()
          .includes(search_term.value.toLowerCase())
      })
    }
  }

  /**
   * display_process_form(state, process_id)
   * ---------------------------------------
   * Fetches and renders the start form for a selected process.
   * Parses the returned HTML form string, extracts input/select fields,
   * and stores them as objects in the formFields state.
   *
   * Affects:
   * - start_processID: set to selected process
   * - formFields: updated with extracted form data
   * - display_start_formular: toggled to show the form
   */
  const display_process_form = async (state, process_id) => {
    start_processID.value = process_id
    formFields.value = []

    //---------currently unnecessary, because FormKey finds no use---------//
    //--------------------------------------------------------------------//
    // try {
    //   const startForm = await api.get_startForm(state, process_id);
    //   console.log("Form Key:", startForm);
    // } catch (error) {
    //   console.error(error);
    // }
    //-------------------------------------------------------//
    //------------------------------------------------------//

    try {
      const response = await engine_rest.process_definition.rendered_start_form(state, process_id)
      rendered_form = response.data

      // Parse the HTML string so querySelectors work
      const parser = new DOMParser()
      const htmlDoc = parser.parseFromString(rendered_form, 'text/html')

      const group = htmlDoc.querySelector('.form-group')

      const label = group.querySelector('label')?.textContent?.trim()
      const select = group.querySelector('select')
      const input = group.querySelector('input')

      let select_name = ''
      let cam_variable_name_ = ''
      let cam_variable_type_ = ''
      let value = ''
      let select_options = []
      let input_type = ''

      if (select) {
        cam_variable_type_ = 'Select'
        select_name = select.getAttribute('name')
        cam_variable_name_ = select.getAttribute('cam-variable-name')
        const options = select.querySelectorAll('option')
        select_options = Array.from(options).map(option => option.getAttribute('value'))
      } else if (input) {
        cam_variable_type_ = input.getAttribute('cam-variable-type')
        cam_variable_name_ = input.getAttribute('cam-variable-name')
        value = input.getAttribute('value')
        input_type = input.getAttribute('type')
        //type = input.getAttribute('type');
      } else {
        console.error('Unknown form field type in rendered form!')
        return
      }

      formFields.value.push({
        name: select_name,
        cam_variable_name: cam_variable_name_,
        cam_variable_type: cam_variable_type_,
        label,
        value,
        select_options,
        type: input_type
      })
      console.log('Debugging', formFields)

    } catch (error) {
      console.error('Fehler beim Abrufen der rendered_form,', error)
    }

    display_start_formular.value = !display_start_formular.value
  }

  /**
   * handleSubmit(event)
   * -------------------
   * Handles the form submission event to start a new process instance.
   * Collects form input values and builds a request body with process variables.
   * Also retrieves the business key from the form and includes it.
   *
   * Affects:
   * - request_body_submit_form: built from form field values
   * - display_start_formular: set to false after submission
   */
  const handleSubmit = async (event) => {
    const confirmStart = window.confirm(`Are you sure you want to start the process?`)
    if (!confirmStart) return
    event.preventDefault()

    const form = event.target
    const form_data = new FormData(form)

    formFields.value.forEach(field => {

      let variable_type
      let variable_value
      let variable_name = field.name

      if (field.cam_variable_type == 'Select') {
        const selectedOption = form_data.get(variable_name)
        variable_value = selectedOption
        variable_type = 'String'
      } else if (field.type === 'checkbox') {
        console.log('balablablablabalbal')
        variable_type = 'Boolean'
        const input = form.querySelector(`[name="${variable_name}"]`)
        variable_value = input.checked
      } else {
        variable_type = 'String'
        variable_value = field.value
      }

      request_body_submit_form.variables[variable_name] = {
        value: variable_value,
        type: variable_type
      }
    })

    request_body_submit_form.business_key = form_data.get('business_key')?.toString()

    engine_rest.process_definition.submit_form(state, start_processID.value, request_body_submit_form)
      .then((result) => console.log(result))
      .catch((error) => console.error('Error:', error))
    display_start_formular.value = false
  }

  return (
    <div>
      <button id="startButton" onClick={display_processes}>
        <Icons.play />
        {show_processes.value ? 'Hide processes' : 'Start process'}
      </button>

      {show_processes.value && (
        <>
          <div class="popup-overlay" id="process-popup-overlay">
            <div class="popup" id="process-popup">
              <div class="popup-header" id="process-popup-header">
                <h2 class="popup-title" id="process-popup-title">
                  Start process
                </h2>
                <button class="close-btn" id="process-popup-close-btn" onClick={() => (show_processes.value = false)}>
                  Close
                </button>
                <input
                  type="text"
                  class="search-input"
                  id="process-popup-search-input"
                  placeholder="Search by process name."
                  value={search_term.value}
                  onInput={(e) => (search_term.value = e.target.value)}
                />
              </div>

              <div class="popup-info" id="process-popup-info">
                Click on the process to start.
              </div>

              <ul class="process-list" id="process-popup-list">
                {filtered_processes.length > 0 ? (
                  filtered_processes.map((process, index) => (
                    <li key={index} class="process-item">
                      <button
                        class="process-button"
                        onClick={() => display_process_form(state, process.id)}
                      >
                        {process.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li class="process-item">No processes found</li>
                )}
              </ul>

              {display_start_formular.value && (
                <div class="popup-overlay" id="form-popup-overlay">
                  <div class="popup" id="form-popup">
                    <div class="popup-header" id="form-popup-header">
                      <h2>Startformular</h2>
                      <button class="close-btn" id="form-process-popup-close-btn" onClick={() => (display_start_formular.value = false)}>
                        Close
                      </button>
                    </div>
                    <div class="popup-body" id="form-popup-body">
                      <form onSubmit={handleSubmit}>
                        {/* Form fields section */}
                        {formFields.value.length > 0 && (
                          <div>
                            {formFields.value.map(field => (
                              <div class="form-group" key={field.name}>
                                <label for={field.name}>{field.label}</label>

                                {field.cam_variable_type === 'Select' ? (
                                  <select
                                    class="form-control"
                                    name={field.name}
                                    cam-variable-type={field.cam_variable_type}
                                    cam-variable-name={field.cam_variable_name}
                                  >
                                    {field.select_options.map(option => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    class="form-control"
                                    name={field.name}
                                    cam-variable-type={field.cam_variable_type_}
                                    cam-variable-name={field.cam_variable_name_}
                                    type={field.type}
                                    {...(field.type === 'checkbox'
                                        ? {
                                          checked: field.value === 'true',
                                          onInput: (e) => field.value = e.target.checked.toString()
                                        }
                                        : {
                                          value: field.value ?? '',
                                          onInput: (e) => field.value = e.target.value
                                        }
                                    )}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <div class="form-group">
                          <label for="business_key">Business Key:</label>
                          <input class="form-control" id="business_key" name="business_key" />
                        </div>

                        <button type="submit" class="btn btn-primary">Start Process</button>
                      </form>
                    </div>
                    <div class="form-popup-footer" id="process-popup-footer" />
                  </div>
                </div>
              )}

              <div class="popup-footer" id="process-popup-footer" />
            </div>
          </div>
        </>
      )
      }
    </div>
  )
}

export { StartProcessList }
