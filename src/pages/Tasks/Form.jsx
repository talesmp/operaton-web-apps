import { useState, useContext } from 'preact/hooks';
import * as api from "../../api";
import DOMPurify from "dompurify";
import { AppState } from '../../state.js';
import { useSignalEffect } from '@preact/signals'
import * as Icons from '../../assets/icons.jsx'

const Form = () => {
    const [generated, setGenerated] = useState("")
    const [error, setError] = useState(null)
    const state = useContext(AppState);

    // no embedded form and no Camunda form, we have to look for generated form
    useSignalEffect(() => {
        if (state.selected_task.value && !state.selected_task.value.formKey
          && !state.selected_task.value.camundaFormRef && state.selected_task.value.id) {
            api.get_task_rendered_form(state, state.selected_task.value.id)
        }
    })

    useSignalEffect(() => {
        if (state.task_generated_form.value) {
            setGenerated(parse_html(state, state.task_generated_form.value))
        }
    })

    return (
        <>
            {(() => {
                if (state.selected_task.value.formKey) {
                    const formLink = state.selected_task.value.formKey.substring(13);

                    return ( // TODO needs to be clarified what to do here
                        <>
                            <a href={`http://localhost:8888/${formLink}`} target="_blank" rel="noreferrer">Embedded Form</a>
                        </>
                    );
                } else if (state.selected_task.value.camundaFormRef) {

                } else {
                    return (
                        <>
                            <div>(*) required field</div>
                            <div id="generated-form" class="generated-form">
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
            })()}
        </>
    );
}

/* remove unnecessary JS code, set date type for date inputs and add form buttons */
const parse_html = (state, html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const form = doc.getElementsByTagName("form")[0];

    const disable = state.user_profile.value.id !== state.selected_task.value.assignee
    const inputs = form.getElementsByTagName("input");
    const selects = form.getElementsByTagName("select");
    let storedData = localStorage.getItem(`task_form_${  state.selected_task.value.id}`)

    if (storedData) {
        storedData = JSON.parse(storedData);
    }

    for (const field of inputs) {
        // sanitize will remove the attribute name when its value is also "name"
        if (!field.getAttribute("name")) {
            field.name = "name"
        }

        // if we have a date, we change the input type to date, so the standard datepicker can be used
        if (field.hasAttribute("uib-datepicker-popup")) {
            field.type = "date";
        }

        // for the Long type we set the proper input type, so we can use the browser validation
        if (field.getAttribute("cam-variable-type") === "Long") {
            field.type = "number";
        }

        if (disable) {
            field.setAttribute("disabled", "disabled");
        }

        if (field.hasAttribute("required")) {
            field.previousElementSibling.textContent += "*"
        }

        // set previously stored data
        if (storedData) {
            if (field.getAttribute("type") === "checkbox") {
                if (storedData[field.name] && storedData[field.name]["value"]) {
                    field.setAttribute("checked", "checked");
                }
            } else if (storedData[field.name]) {
                field.setAttribute("value", storedData[field.name]["value"])
            }
        }
    }

    for (const field of selects) {
        if (disable) {
            field.setAttribute("disabled", "disabled");
        }

        if (storedData && storedData[field.name]) {
            for (const option of field.children) {
                if (option.getAttribute("value") === storedData[field.name]["value"]) {
                    option.setAttribute("selected", "selected");
                }
            }
        }
    }

    // we clean up the HTML, will remove unnecessary JS and attributes
    return DOMPurify.sanitize(form.innerHTML, {ADD_ATTR: ['cam-variable-type']});
}

const post_form = (e, state, setError) => {
    setError(null) // reset former error message from server
    const task_id = state.selected_task.value.id
    const data = build_form_data()

    const message = api.post_task_form(state, state.selected_task.value.id, data)

    // error message from server
    if (message) {
        setError(message)
    } else {
        // we don't care if it exists, we remove it as a precaution
        localStorage.removeItem(`task_form_${task_id}`)
    }

    e.preventDefault()
}

/* with "Save Form" we store the form data in the local storage, so the task can be completed in the future,
   no matter when, we reuse the JSON structure from the REST API POST call */
const store_data = (state) => {
    localStorage.setItem(`task_form_${  state.selected_task.value.id}`, JSON.stringify(build_form_data(true)))
}

// building Json format for posting the data, if we store it temporarily we don't change the format
const build_form_data = (temporary) => {
    const inputs = document.getElementById("generated-form")
      .getElementsByClassName("form-control");
    const data = {}

    // building Json format for posting the data
    for (let input of inputs) {
        // sanitize will remove the attribute name when its value is also "name"
        let variable = input.getAttribute("name")

        switch (input.getAttribute("type")) {
            case "checkbox":
                data[variable] = { value: input.checked }
                break
            case "date": {
                if (input.value) {
                    if (temporary) {
                        data[variable] = { value: input.value }
                    } else {
                        const date = input.value.split("-")
                        data[variable] = { value: `${ date[2] }/${ date[1] }/${ date[0] }`}
                    }
                }
                break
            }
            case "number":
                if (input.value) {
                    data[variable] = { value: parseInt(input.value, 10) }
                }
                break
            default:
                if (input.value) {
                    data[variable] = { value: input.value }
                }
        }
    }

    return data
}

export { Form }