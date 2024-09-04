import preactLogo from "../../assets/preact.svg";
import { useEffect, useState } from 'preact/hooks';
import * as api from "../../api";

export function Tasks() {
    const [tasks, setTasks] = useState([]); // task list
    const [selected, setSelected] = useState({}); // the selected task

    useEffect(() => {
        api.get_task_list().then((list) => {
            // we need a second call for getting the process definition names
            const ids = list.map(task => task.processDefinitionId); // list of needed process definitions

            api.get_process_definition_list(ids)
                .then(
                    (defList) => {
                        const defMap = new Map(); // helper map
                        defList.map(def => defMap.set(def.id, def.name));

                        list.forEach((task) => task.def_name = defMap.get(task.processDefinitionId));
                        setTasks(list); // store task list
                    }
                );
        });
    }, []);

    return (
        <div style="display: flex">
            <aside>
                <div class="tile-filter">
                    <div class="filter-header">Filter Tasks & Search</div>
                </div>

                <ul class="tile-list">
                    {tasks.map( task => (<TaskTile task={task} selected={task.id === selected.id} setSelected={setSelected} />))}
                </ul>
            </aside>
            <main>
                <a href="https://preactjs.com" target="_blank">
                    <img src={preactLogo} alt="Preact logo" height="160" width="160" />
                </a>
                <h1>Operaton</h1>
            </main>
        </div>
    );
}

const TaskTile = ({task, selected, setSelected}) => (
    <li class={selected ? "tile selected" : "tile"}>
        <a href="" data-task-id={task.id} onClick={() => setSelected(task)}>
            <div className="tile-row">
                <div>{task.def_name}</div>
                <div className="tile-right">Date</div>
            </div>
            <h4>{task.name}</h4>
            <div className="tile-row">
                <div>Assigned to <b>{task.assignee ? task.assignee : "no one"}</b></div>
                <div className="tile-right">Priority {task.priority}</div>
            </div>
        </a>
    </li>
);


