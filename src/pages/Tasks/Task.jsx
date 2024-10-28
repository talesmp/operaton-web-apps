import * as Icons from "../../assets/icons.jsx";
import { useState, useContext } from 'preact/hooks';
import { Form } from "./Form.jsx";
import { AppState } from "../../state.js";
import * as api from "../../api";

export function Task(props) {
    const [tab, setTab] = useState("task-tab-form");
    const state = useContext(AppState);

    // tabs on the task main page
    const tabs = new Map([
        ["task-tab-form", "Form"],
        ["task-tab-history", "History"],
        ["task-tab-diagram", "Diagram"],
    ]);

    return (
        <>
            <div class="task-menu">
                <menu>
                    {(() => {
                        // show claim only, if this task has another assignee
                        if (state.user_profile.value && state.user_profile.value.id !== props.selected.assignee) {
                            return (
                            <li onClick={() => assignTask(true, state, props.selected.id, props.setSelected)}>
                                <div class="border">
                                    <span class="icon"><Icons.user_plus /></span>
                                    <span class="label">Claim</span>
                                </div>
                            </li>
                            )
                        } else if (state.user_profile.value && state.user_profile.value.id === props.selected.assignee) {
                            return (
                                <li onClick={() => assignTask(false, state, props.selected.id, props.setSelected)}>
                                    <div class="border">
                                        <span class="icon"><Icons.user_minus /></span>
                                        <span class="label">Unclaim</span>
                                    </div>
                                </li>
                            )
                        }
                    })()}
                    <li>
                        <div className="border">
                            <span class="icon"><Icons.users /></span>
                            <span class="label">Set Group</span>
                        </div>
                    </li>
                    <li>
                        <div className="border">
                            <span class="icon"><Icons.calendar /></span>
                            <span class="label">Set Follow Up Date</span>
                        </div>
                    </li>
                    <li>
                        <div className="border">
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

            <div className="task-container">
                <div style="display: flex;">
                    <div>{props.selected.def_name}</div>
                    <div>[Process version: v{props.selected.def_version} | <a href="">Show process</a>]</div>
                </div>

                <h1>{props.selected.name}</h1>

                {(() => {
                    if (props.selected.description) {
                        return (<div>
                            <h5>Description</h5>
                            {props.selected.description}
                        </div>);
                    }

                })()}

                <div className="task-tabs">
                    {(() => {  // instead of duplicate code we have more code here, yeah (but you can add easily a tab)
                        const helper = [];
                        tabs.forEach((value, key) => {
                            helper.push(<div className={tab === key ? "selected" : ""} id={key}
                                             onClick={() => setTab(key)}>{value}</div>);
                        });
                        return helper;
                    })()}
                </div>

                <div className={tab !== "task-tab-form" ? "tab-content hide" : "tab-content"}>
                    <Form selected={props.selected} />
                </div>

                <div className={tab !== "task-tab-history" ? "tab-content hide" : "tab-content"}>
                    HISTORY
                </div>

                <div className={tab !== "task-tab-diagram" ? "tab-content hide" : "tab-content"}>
                    DIAGRAM
                </div>
            </div>
        </>
    );
}

function assignTask(claim, state, taskId, setSelected) {
    const result = claim ? api.claim_task(taskId, state) : api.unclaim_task(taskId, state);

    result.then(worked => {
        console.log("result: " + worked);
        if (worked) {
           api.get_task(taskId).then((task) => {setSelected(task); console.log("set selected: " + task.id)});
        }
    });
}