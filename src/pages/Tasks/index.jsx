import preactLogo from "../../assets/preact.svg";
import { useEffect, useState } from 'preact/hooks';
import * as api from "../../api";
import * as formatter from "../../helper/formatter";
import { Task } from "./Task.jsx";
import * as Icons from "../../assets/icons.jsx";

export function Tasks() {
    const [tasks, setTasks] = useState([]); // task list on left bar
    const [selected, setSelected] = useState({}); // the selected task

    // get task list when page is initially loaded
    useEffect(() => {
        api.get_task_list().then((list) => {
            // we need a second call for getting the process definition names
            const ids = list.map(task => task.processDefinitionId); // list of needed process definitions

            api.get_process_definition_list(ids)
                .then(
                    (defList) => {
                        const defMap = new Map(); // helper map, mapping ID to process name
                        defList.map(def => defMap.set(def.id, def));

                        // set process name to task list
                        list.forEach((task) => {
                            const def = defMap.get(task.processDefinitionId);
                            task.def_name = def ? def.name : "";
                            task.def_version = def ? def.version : "";
                        });
                        setTasks(list); // store task list

                        // select the first task in the list to show some data on the right side
                        if (list.length > 0) {
                            setSelected(list[0]);
                        }
                    }
                );
        });
    }, []);
    // TODO do we need the div here?
    return (
        <div style="display: flex">
            <aside aria-label="task list">
                <div class="tile-filter" id="task-filter">
                    <div class="filter-header" onClick={openFilter}>
                        <span className="label">Filter Tasks & Search</span>
                        <span className="icon down"><Icons.chevron_down /></span>
                        <span className="icon up"><Icons.chevron_up /></span>
                    </div>
                    <div class="filter-menu">
                    <menu>
                            <li>My Tasks</li>
                            <li>Claimed Tasks</li>
                        </menu>
                    </div>
                </div>

                <ul class="tile-list">
                    {tasks.map(task => (
                        <TaskTile task={task} selected={task.id === selected.id} setSelected={setSelected}/>))}
                </ul>
            </aside>
            <main>
                <Task selected={selected} />
            </main>
        </div>
    );
}

const TaskTile = ({task, selected, setSelected}) => (
    <li class={selected ? "tile selected" : "tile"}>
        <a href="" data-task-id={task.id} aria-labelledby={task.id} onClick={() => setSelected(task)}>
            <div className="tile-row">
                <div>{task.def_name}</div>
                <div className="tile-right">{formatter.formatRelativeDate(task.created)}</div>
            </div>
            <h4 id={task.id}>{task.name}</h4>
            <div className="tile-row">
                <div>Assigned to <b>{task.assignee ? task.assignee : "no one"}</b></div>
                <div className="tile-right">Priority {task.priority}</div>
            </div>
        </a>
    </li>
);

function openFilter() {
    const menu = document.getElementById("task-filter")
    menu.classList.toggle("open");
}




