import preactLogo from "../../assets/preact.svg";
import { useEffect, useState } from 'preact/hooks';
import * as api from "../../api";

export const Tasks = () => (
    <>
        <div style="display: flex">
            <aside>
                <ul class="tile-list">
                    <TaskList />
                </ul>
            </aside>
            <main>
                <a href="https://preactjs.com" target="_blank">
                    <img src={preactLogo} alt="Preact logo" height="160" width="160" />
                </a>
                <h1>Operaton</h1>
            </main>
        </div>
    </>
);

// using function component here because of hooks and state handling
function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        api.get_task_list().then((list) => setTasks(list));
    }, [])

    return (
        tasks.map( task => (<Task task={task} selected={task.id === selected} setSelected={setSelected} />))
    );
}

const Task = ({task, selected, setSelected}) => (
    <li class={selected ? "tile selected" : "tile"}>
        <a href="" data-task-id={task.id} onClick={() => setSelected(task.id)} >
            <h2>{task.name}</h2>
        </a>
    </li>
);
