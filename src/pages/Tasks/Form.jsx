import { useEffect, useState } from 'preact/hooks';
import * as api from "../../api";
import DOMPurify from "dompurify";

export function Form(props) {
    const [generated, setGenerated] = useState("");

    // no embedded form and no Camunda form, we have to look for generated form
    useEffect(() => {
        if (!props.selected.formKey && !props.selected.camundaFormRef && props.selected.id) {
            api.get_generated_form(props.selected.id)
                .then((html) => {
                    setGenerated( parseHtml(html));
                    //console.log("html: " + html)
                    //const doc = parseHtml(html);
                    //console.log("parsed html: " + doc.documentElement.outerHTML);
                });
        }
    }, [props.selected]);

    return (
        <>
            {(() => {
                if (props.selected.formKey) {
                    const formLink = props.selected.formKey.substring(13);

                    return (
                        <>
                        <button onClick={() => window.open(`http://localhost:8080/${formLink}`, '_blank')}>
                            Embedded Form
                        </button>

                        <p>May be we should explain this button here</p></>
                    );
                } else if (props.selected.camundaFormRef) {

                } else {
                    //return <div class="generated-form" dangerouslySetInnerHTML={{ __html: generated }} />;
                    return <div class="generated-form" dangerouslySetInnerHTML={{ __html: generated }} />;
                }

            })()}
        </>
    );
}

function parseHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const fields = doc.getElementsByTagName("input");

    // if we have a date, we change the input type to date, so the standard datepicker can be used
    for (const field of fields) {
        if (field.hasAttribute("uib-datepicker-popup")) {
            field.type = "date";
        }
    }

    return DOMPurify.sanitize(doc.documentElement.outerHTML);
}