import {effect, signal} from "@preact/signals";
import {createContext} from "preact";
import {useContext, useEffect, useRef} from "preact/hooks";
import {useLocation, useRoute} from "preact-iso";
import * as api from "../../api";
import * as Icons from "../../assets/icons.jsx"

const createProcessesState = () => {
    const process_definitions = signal(null);
    const process_definition = signal(null);
    const selected_process_definition_id = signal(null);
    const process_instances = signal(null);
    const process_instance = signal(null);

    return {
        process_definitions,
        process_definition,
        selected_process_definition_id,
        process_instances,
        process_instance
    };
};

const ProcessesState = createContext(undefined);


const ProcessesPage = () => (
    <ProcessesState.Provider value={createProcessesState()}>
        <Processes />
    </ProcessesState.Provider>
);

const Processes = () => {
    const state = useContext(ProcessesState);
    const {params} = useRoute();

    useEffect(() => {
        api
            .get_process_definitions()
            .then((r) => (state.process_definitions.value = r));
    }, [state.process_definitions]);

    return (
        <main class="split-layout">
            <div id="selection">
                {!params?.definition_id
                    ? <ProcessDefinitionSelection />
                    : <ProcessDefinitionDetails />}
            </div>
            <div id="preview">"a bpmn diagram"</div>
        </main>
    );
};

const ProcessDefinitionSelection = () => {
    const state = useContext(ProcessesState);

    return (
        <>
            <h1>
                Process Definitions
            </h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Key</th>
                    <th>Instances</th>
                    <th>Incidents</th>
                    <th>State</th>
                </tr>
                </thead>
                <tbody>
                {state.process_definitions.value?.map((process) => (
                    <ProcessDefinition
                        key={process.id} {...process} />
                ))}
                </tbody>
            </table>
        </>
    );
}

const ProcessDefinitionDetails = () => {
    const state = useContext(ProcessesState);
    const {params} = useRoute();

    console.log("Rerender 1: ", params.definition_id, state.process_definition.value)

    useEffect(() => {
        api
            .get_process_definition(params.definition_id)
            .then((res) => {
                state.process_definition.value = res
            })
    }, [state.process_definition, params.definition_id]);

    console.log("Rerender 2: ", params.definition_id, state.process_definition.value)

    return (
        <>
            <h1>
                Process Definition
                <span
                    class="selected">&nbsp;
                    {state.process_definition.value?.name}
                </span>
            </h1>


            <div class="row gap">
            <a className="tabs-back"
               href={`/processes`}
               title="Change Definition">
                <Icons.arrow_left />
                <Icons.list />
            </a>
            <dl>
                <dt>Definition ID</dt>
                <dd class="font-mono">{state.process_definition.value?.id ?? "-/-"}</dd>
                <dt>Tenant ID</dt>
                <dd>{state.process_definition.value?.tenantId ?? "-/-"}</dd>
            </dl>
            </div>

            <Tabs base_url={`/processes/${params.definition_id}`}
                  tabs={process_definition_tabs} />
        </>
    )
}

const Tabs = ({base_url, tabs, param_name = "tab"}) => {
    const {params} = useRoute();
    const {route, path} = useLocation();
    const tab = params[param_name]

    if (tab === null) {
        route(`${path}/$tabs[0].id}`)
    }

    console.log("Tab List: ", param_name, params[param_name])

    const change_tab = (event, current_tab) => {
        if (event.key === 'ArrowRight') {
            const new_tab = tabs[
                tabs.length !== current_tab.pos + 1
                    ? current_tab.pos + 1
                    : 0];
            document.getElementById(`${param_name}-${new_tab.id}`).focus()
            route(`${base_url}/${new_tab.id}`);
        } else if (event.key === 'ArrowLeft') {
            const new_tab = tabs[
                0 !== current_tab.pos
                    ? current_tab.pos - 1
                    : tabs.length - 1];
            document.getElementById(`${param_name}-${new_tab.id}`).focus()
            route(`${base_url}/${new_tab.id}`);

        }
    }

    return (
        <div class="tabs" id="process-details-tabs">
            <div class="tab-selection" role="tablist"
                 aria-labelledby="tablist-1">

                {tabs.map(tab_name => {
                        return (
                            <a key={`tablist-${tab_name.id}`}
                               id={`${param_name}-${tab_name.id}`}
                               role="tab"
                               aria-selected={tab === tab_name.id}
                               aria-controls={`tabpanel-${tab_name.id}}`}
                               href={`${base_url}/${tab_name.id}`}
                               tabIndex={tab !== tab_name.id ? '-1' : null}
                               onKeyDown={(event) => change_tab(event, tab_name)}
                            >
                                {tab_name.name}
                            </a>)
                    }
                )}
            </div>
            <div class="selected-tab"
                 id={`tabpanel-${tab}`}
                 role="tabpanel"
                 tabIndex="0"
                 aria-labelledby={`${param_name}-${tab}`}>
                {tabs.find(tab_ => tab === tab_.id)?.target || "Select a tab"}
            </div>
        </div>
    );
}

const clear_selected_definition = (state) => {
    console.log("Back/Clear")
    effect(() => {
        state.process_definition.value = null;
        state.selected_process_definition_id.value = null;
        state.process_instances.value = null;
    });
};

const ProcessDefinition = ({
                               definition: {id, name, key},
                               instances,
                               incidents
                           }) => {
    // const state = useContext(ProcessesState);
    return (
        <tr>
            <td>
                <a href={`/processes/${id}/instances`}>
                    {name}
                </a>
            </td>
            <td>
                {key}
            </td>
            <td>
                {instances}
            </td>
            <td>
                {incidents.length}
            </td>
            <td>
                ?
            </td>
        </tr>
    );
};

const Instances = () => {
    const state = useContext(ProcessesState);

    const {params} = useRoute();

    useEffect(() => {
        api
            .get_process_instance_list(params.definition_id)
            .then((json) => (state.process_instances.value = json));
    }, [params.definition_id, state.process_instances]);

    effect(() =>
        console.log("Selected Instance: ", params));

    return !params?.selection_id
        ? (<table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Start Time</th>
                <th>State</th>
                <th>Business Key</th>
            </tr>
            </thead>
            <tbody>
            {state.process_instances.value?.map((instance) => (
                <ProcessInstance key={instance.id} {...instance} />
            )) ?? <p>"Loading..."</p>}
            </tbody>
        </table>)
        : (<InstanceDetails />);
};

const InstanceDetails = () => {
    console.log("Hello There Details")

    const state = useContext(ProcessesState);
    const {params, path} = useRoute();
    const path_ = useRef(path)


    useEffect(() => {
        api
            .get_process_instance(params.selection_id)
            .then((res) => {
                state.process_instance.value = res
            })
    }, [state.process_instance, params.selection_id]);

    return (
        <div>

            <div class="row gap">
            <a className="tabs-back"
               href={`/processes/${params.definition_id}/instances`}
               title="Change Instance">
                <Icons.arrow_left />
                <Icons.list />
            </a>
            <dl>
                <dt>Instance ID</dt>
                <dd>{state.process_instance.value?.id ?? "-/-"}</dd>
                <dt>Business Key</dt>
                <dd>{state.process_instance.value?.businessKey ?? "-/-"}</dd>
            </dl>
            </div>

            <Tabs
                base_url={`/processes/${params.definition_id}/instances/${params.selection_id}`}
                tabs={process_instance_tabs}
                param_name={"tab2"} />

        </div>
    )
}


const ProcessInstance = ({id, startTime, state, businessKey}) => (
    <tr>
        <td class="font-mono"><a
            href={`./instances/${id}/vars`}> {id.substring(0, 8)}</a></td>
        <td>{new Date(Date.parse(startTime)).toLocaleString()}</td>
        <td>{state}</td>
        <td>{businessKey}</td>
    </tr>
);


const process_definition_tabs = [
    {
        name: "Instances",
        id: "instances",
        pos: 0,
        target: <Instances />
    },
    {
        name: "Incidents",
        id: "incidents",
        pos: 1,
        target: <p>Incidents</p>
    },
    {
        name: "Called Definitions",
        id: "called_definitions",
        pos: 2,
        target: <p>Called Definitions</p>
    },
    {
        name: "Jobs",
        id: "jobs",
        pos: 3,
        target: <p>Jobs</p>
    }]


const process_instance_tabs = [
    {
        name: "Variables",
        id: "vars",
        pos: 0,
        target: <p>Variables</p>
    },
    {
        name: "Instance Incidents",
        id: "instance_incidents",
        pos: 1,
        target: <p>Incidents</p>
    },
    {
        name: "Called Instances",
        id: "called_instances",
        pos: 2,
        target: <p>Called Instances</p>
    },
    {
        name: "User Tasks",
        id: "user_tasks",
        pos: 3,
        target: <p>User Tasks</p>
    },
    {
        name: "Jobs",
        id: "jobs",
        pos: 4,
        target: <p>Jobs</p>
    },
    {
        name: "External Tasks",
        id: "external_tasks",
        pos: 5,
        target: <p>External Tasks</p>
    }]

export {ProcessesPage}