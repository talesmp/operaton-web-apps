import { useState, useContext } from 'preact/hooks';
import * as api from "../../api";
import DOMPurify from "dompurify";
import { AppState } from '../../state.js';
import { useSignalEffect } from '@preact/signals'

const Form = () => {
    const [generated, setGenerated] = useState("")
    const state = useContext(AppState);
    const task = state.selected_task.value

    // no embedded form and no Camunda form, we have to look for generated form
    useSignalEffect(() => {
        if (!task.formKey && !task.camundaFormRef && task.id) {
            api.get_task_rendered_form(state, task.id)
        }
    })

    useSignalEffect(() => {
        setGenerated(parse_html(state, state.task_generated_form.value))
    })

    return (
        <>
            {(() => {
                if (task.formKey) {
                    const formLink = task.formKey.substring(13);

                    return ( // TODO needs to be clarified what to do here
                        <>
                            <a href={`http://localhost:8888/${formLink}`} target="_blank" rel="noreferrer">Embedded Form</a>
                        </>
                    );
                } else if (task.camundaFormRef) {

                } else {
                    return (
                        <>
                            <div>(*) required field</div>
                            <div id="generated-form" class="generated-form" dangerouslySetInnerHTML={{ __html: generated }} />
                            <div class="form-buttons">
                                <button onSubmit={() => post_form(state)}>Complete Task</button>
                                <button class="secondary">Save Form</button>
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

    const disable = state.user_profile.value.id !== state.selected_task.value.assignee
    const inputs = doc.getElementsByTagName("input");
    const selects = doc.getElementsByTagName("select");

    for (const field of inputs) {
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
    }

    for (const field of selects) {
        if (disable) {
            field.setAttribute("disabled", "disabled");
        }
    }

    const errors = doc.querySelectorAll(".has-error");
    // change the class name of the error display and remove all stuff in it
    for (const error of errors) {
        error.className = 'error'
        //error.replaceChildren()
    }

    // we clean up the HTML, will remove unnecessary JS and attributes
    return DOMPurify.sanitize(doc.documentElement.outerHTML, {ADD_ATTR: ['cam-variable-type']});
}

const post_form = (state) => {
    const form = document.getElementById("generated-form");

    const inputs = form.getElementsByClassName("form-control");
    const data = {}

    // building Json format for posting the data
    for (let input of inputs) {
        if (!validateInput(input)) {

        }

        // sanitize will remove the attribute name when its value is also "name"
        let variable = input.getAttribute("name")
        if (!variable) {
           variable = "name"
        }

        if (input.getAttribute("type") === "checkbox") {
            data[variable] = { value: input.checked }
        } else {
            data[variable] = { value: input.value }
        }
    }

    //api.post_task_form(state, state.selected_task.value.id, data)
}

const validateInput = (input) => {
    let error = false

    if (input.hasAttribute("required") && (!input.value || /^\s*$/.test(input.value))) {
        input.nextSibling.textContent = "This field is required"
        error = true
    }

    return error
}

export { Form }