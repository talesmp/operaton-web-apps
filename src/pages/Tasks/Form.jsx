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
                            <div id="generated-form" class="generated-form" dangerouslySetInnerHTML={{ __html: generated }} />
                            <div class="form-buttons">
                                <button onClick={() => post_form()}>Complete Task</button>
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

    // if we have a date, we change the input type to date, so the standard datepicker can be used
    for (const field of inputs) {
        if (field.hasAttribute("uib-datepicker-popup")) {
            field.type = "date";
        }

        if (disable) {
            field.setAttribute("disabled", "disabled");
        }
    }

    for (const field of selects) {
        console.log("select: " + field.name);
        if (disable) {
            field.setAttribute("disabled", "disabled");
        }
    }

    // we clean up the HTML, will remove unnecessary JS and attributes
    return DOMPurify.sanitize(doc.documentElement.outerHTML, {ADD_ATTR: ['cam-variable-type']});
}

const post_form = () => {
    const form = document.getElementById("generated-form");

    const inputs = form.getElementsByTagName("input");
    const selects = form.getElementsByTagName("select");

    for (let input of inputs) {
        console.log("name: " + input.getAttribute("name") + " value: " + input.value)

        if (input.getAttribute("type") === "checkbox") {
            console.log("check value: " + input.checked);
        }
    }

    for (let select of selects) {
        console.log("name: " + select.getAttribute("name") + " value: " + select.value)
    }
}

export { Form }