import { useState, useContext } from 'preact/hooks';
import * as api from "../../api";
import DOMPurify from "dompurify";
import { AppState } from '../../state.js';
import { useSignalEffect } from '@preact/signals'
import * as Icons from '../../assets/icons.jsx'

const Form = () => {
    const [generated, setGenerated] = useState("")
    const [deployed, setDeployed] = useState([])
    const [error, setError] = useState(null)
    const state = useContext(AppState)
    const refName = get_form_ref(state)

    // no embedded form and no Camunda form, we have to look for generated form
    useSignalEffect(() => {
        if (state.task.value && !state.task.value?.formKey
          && !state.task.value?[refName] && state.task.value?.id) {
            api.get_task_rendered_form(state, state.task.value?.id)
        }

        if (state.task.value && !state.task.value?.formKey && state.task.value?[refName]
          && state.task.value?.id) {
            api.get_task_deployed_form(state, state.task.value?.id)
        }
    })

    // generated form was loaded, so do something
    useSignalEffect(() => {
        if (state.task_generated_form.value) {
            setGenerated(parse_html(state, state.task_generated_form.value))
        }
    })

    // deployed form was loaded, so do something
    useSignalEffect(() => {
        console.log("deployed form has changed")
        if (state.task_deployed_form.value) {
            console.log("set deployed")
            setDeployed(prepare_form_data(state.task_deployed_form.value))
        }
    })

    return (
        <>
            {(() => {
                if (state.task.value?.formKey) {
                    const formLink = state.task.value?.formKey.substring(13);

                    return ( // TODO needs to be clarified what to do here
                        <a href={`http://localhost:8888/${formLink}`} target="_blank" rel="noreferrer">Embedded Form</a>
                    );
                } else if (state.task.value?[refName]) {
                    return (
                      <div id="deployed-form" class="deployed-form">
                          <form>
                              {deployed?.map(({ key, value }) =>
                                <DeployedFormRow key={key} components={value} />)}
                          </form>
                      </div>
                )
                }
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
            })()}
        </>
    );
}

/* remove unnecessary JS code, set date type for date inputs and add form buttons */
const parse_html = (state, html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const form = doc.getElementsByTagName("form")[0];

    const disable = state.user_profile.value.id !== state.task.value?.assignee
    const inputs = form.getElementsByTagName("input");
    const selects = form.getElementsByTagName("select");
    let storedData = localStorage.getItem(`task_form_${  state.task.value?.id}`)

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
    const task_id = state.task.value?.id
    const data = build_form_data()

    const message = api.post_task_form(state, state.task.value?.id, data)

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
    localStorage.setItem(`task_form_${  state.task.value?.id}`, JSON.stringify(build_form_data(true)))
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

const prepare_form_data = (form) => {
    const components = []
    let rowName = ""
    let row = []

    form.components.forEach((component, index) => {
        if (rowName !== component.layout.row) {
            if (rowName !== "") {
                components.push({ key: rowName, value: row })
                row = []
            }

            rowName = component.layout.row
        }

        row.push(component)

        if (index === form.components.length - 1) {
            components.push({ key: rowName, value: row })
        }
    })

    return components
}

const DeployedFormRow = (props) =>
    <div class="form-fields">
        {props.components?.map(component =>
          <DeployedFormComponent key={component.id} component={component} />)}
    </div>

const DeployedFormComponent = (props) =>
    <div class={`col col-${props.component.layout.columns ? props.component.layout.columns : '16'}`}>

        {(() => {
            switch(props.component.type) {
                case "spacer":
                    return <span>&nbsp;</span>
                case "separator":
                    return <hr />
                case "text":
                    return <span>{props.component.text}</span>
                case "checklist":
                    return <MultiInput component={props.component} />
                case "radio":
                    return <MultiInput component={props.component} />
                case "select":
                    return <Select component={props.component} />
                default:
                    return <Input type={props.component.type} component={props.component} />
            }
        })()}
    </div>

const Input = (props) => {
    let type = props.type
    const label = props.component.dateLabel ? props.component.dateLabel : props.component.label

    if (type === "textfield") {
        type = "text"
    }

    if (type === "datetime") {
        type = "datetime-local"
    }

    return (
    <>
        <label>{label}</label>
        <input type={type} name={props.component.key}
               required={props.component.validate && props.component.validate.required}
               min={props.component.validate ? props.component.validate.min : ""}
               max={props.component.validate ? props.component.validate.max : ""}
               maxlength={props.component.validate ? props.component.validate.maxlength : ""}
               pattern={props.component.validate ? props.component.validate.pattern : ""}
               step={props.component.validate ? props.component.validate.step : ""}
        />
    </>)
}

const Select = (props) => {
    const options = props.component.values.map((data) => <option key={data.value} value={data.value}>{data.label}</option>);

    return (
      <>
          <label>{props.component.label}</label>
          <select name={props.component.key}>
              {options}
          </select>
      </>
    )
}

const MultiInput = (props) => {
    let type = props.component.type

    if (type === "checklist") {
        type = "checkbox"
    }

    const options = props.component.values.map((data) => {
        return (
          <div class="input-list" key={`list_${data.value}`}>
            <input type={type} name={data.value} value={data.value} key={`field_${data.value}`} />
            <label key={data.value}>{data.label}</label>
          </div>
        )
    });

    return (
      <>
          <label>{props.component.label}</label>
          {options}
      </>)
}

// Camunda 7 can be used too, so there can be an operatonFormRef or a camundaFormRef
const get_form_ref = (state) => {
    let refName = "operatonFormRef"

    const servers = JSON.parse(import.meta.env.VITE_BACKEND)
    const obj = servers.find(s => s.url === state.server.value);

    if (obj && obj.name.toLowerCase().includes('cam')) {
        refName = 'camundaFormRef'
    }

    return refName
}

export { Form }