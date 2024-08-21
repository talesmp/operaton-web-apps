import {effect, signal} from "@preact/signals";
import {createContext} from "preact";
import {useContext, useEffect} from "preact/hooks";
import {useLocation, useRoute} from "preact-iso";
import * as api from "../../api";

const createProcessesState = () => {
    const process_definitions = signal(null);
    const process_definition = signal(null);
    const selected_process_definition_id = signal(null);
    const process_instances = signal(null);

    return {
        process_definitions,
        process_definition,
        selected_process_definition_id,
        process_instances,
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
                {!params?.id
                    ? <ProcessDefinitionSelection />
                    : <ProcessDefinitionDetails />
                }
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
    )
        ;
}

const ProcessDefinitionDetails = () => {
    const state = useContext(ProcessesState);
    const {params} = useRoute();


    useEffect(() => {
        api
            .get_process_definition(params.id)
            .then((res) => (state.process_definition.value = res));

        api
            .get_process_instance_list(params.id)
            .then((json) => (state.process_instances.value = json));
    }, [params.id, state.process_definition, state.process_instances]);

    return (
        <>
            <h1>
                Process Definition
                <span
                    class="selected">&nbsp;
                    {state.process_definition?.value?.name ?? "Loading..."}
                </span>
            </h1>

            <a href="/processes"
               onClick={() => clear_selected_definition(state)}>Back</a>
            <dl>
                <dt>Definition ID</dt>
                <dd class="font-mono">{state.process_definition.value?.id}</dd>
                {/*<dt>Deployment ID</dt>*/}
                {/*<dd>{state.process_definition.value?.deploymentId}</dd>*/}
                <dt>Tenant ID</dt>
                <dd>{state.process_definition.value?.tenantId ?? "-/-"}</dd>
                {/*<dt>Definition Version</dt>*/}
                {/*<dd>{state.process_definition.value?.version ?? "-/-"}</dd>*/}
                {/*<dt>Definition Key</dt>*/}
                {/*<dd>{state.process_definition.value?.key ?? "-/-"}</dd>*/}
            </dl>

            <Tabs />
        </>
    )
}

const Tabs = () => {
    const {params: {id, tab}} = useRoute();
    const {route} = useLocation();

    const base_url = `/processes/${id}`;
    const tab_list = [
        {
            name: "Instances",
            id: "instances",
            pos: 0
        },
        {
            name: "Incidents",
            id: "incidents",
            pos: 1
        },
        {
            name: "Called Definitions",
            id: "called_definitions",
            pos: 2
        },
        {
            name: "Jobs",
            id: "jobs",
            pos: 3
        }]

    const change_tab = (event, current_tab) => {
        if (event.key === 'ArrowRight') {
            const new_tab = tab_list[
                tab_list.length !== current_tab.pos + 1
                    ? current_tab.pos + 1
                    : 0];
            document.getElementById(`tab-${new_tab.id}`).focus()
            route(`${base_url}/${new_tab.id}`);
        } else if (event.key === 'ArrowLeft') {
            const new_tab = tab_list[
                0 !== current_tab.pos
                    ? current_tab.pos - 1
                    : tab_list.length - 1];
            document.getElementById(`tab-${new_tab.id}`).focus()
            route(`${base_url}/${new_tab.id}`);

        }
    }

    return (
        <div class="tabs" id="process-details-tabs">
            <div class="tab-selection" role="tablist"
                 aria-labelledby="tablist-1">

                {tab_list.map(tab_name => {
                        return (
                            <a key={`tablist-${tab_name.id}`}
                               id={`tab-${tab_name.id}`}
                               role="tab"
                               aria-selected="true"
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
                 aria-labelledby={`tab-${tab}`}>
                {{
                    instances: <Instances />,
                    incidents: <p>Incidents</p>,
                    called_definitions: <p>Called Definitions</p>,
                    jobs: <p>Jobs</p>
                }[tab]}
            </div>
        </div>
    );
}

const clear_selected_definition = (state) => {
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
                <a href={`/processes/${id}`}>
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

    return (
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Start Time</th>
                <th>State</th>
                <th>Business Key</th>
            </tr>
            </thead>
            <tbody>
            {state.process_instances?.value?.map((instance) => (
                <ProcessInstance key={instance.id} {...instance} />
            )) ?? "Loading..."}
            </tbody>
        </table>);
};

const ProcessInstance = ({id, startTime, state, businessKey}) => (
    <tr>
        <td class="font-mono">{id.substring(0, 8)}</td>
        <td>{new Date(Date.parse(startTime)).toLocaleString()}</td>
        <td>{state}</td>
        <td>{businessKey}</td>
    </tr>
);

export {ProcessesPage}