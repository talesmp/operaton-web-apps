import * as Icons from "../../assets/icons.jsx";

export function Task(props) {
    return (
        <>
            <div class="task-menu">
                <menu>
                    <li>
                        <div class="border">
                            <span class="icon"><Icons.user_plus /></span>
                            <span class="label">Claim</span>
                        </div>
                    </li>
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
                        <div className="border">
                            <span class="icon"><Icons.plus_circle /></span>
                            <span class="label">Create Task</span>
                        </div>
                    </li>
                    <li>
                        <span class="icon"><Icons.play /></span>
                        <span class="label">Start Process</span>
                    </li>
                </menu>
            </div>

            <div class="task-container">
                <div style="display: flex;">
                    <div>{props.selected.def_name}</div>
                    <div>[Process version: v{props.selected.def_version} | <a href="">Show process</a>]</div>
                </div>

                <h1>{props.selected.name}</h1>

                {(() => {
                    if (props.selected.description) {
                        return (<p>
                            <h5>Description</h5>
                            {props.selected.description}
                        </p>);
                    }

                })()}
            </div>
        </>
    );
}