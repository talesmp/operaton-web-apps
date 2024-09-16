import {useSignalEffect} from "@preact/signals";
import {useContext} from "preact/hooks";
import {useRoute} from "preact-iso";
import * as api from "../../api";
import * as Icons from "../../assets/icons.jsx";
import ReactBpmn from "react-bpmn";
import {AppState} from "../../state.js";
import {Suspense} from "react";
import {Tabs} from "../../components/Tabs.jsx";

const ProcessesPage = () => {
    const state = useContext(AppState);
    const {params} = useRoute();

    api.get_process_definitions(state)

    if (params.definition_id) {
        api.get_process_definition(state, params.definition_id)
        api.get_diagram(state, params.definition_id)
    }

    return (
        <main id="processes" class="split-layout">
            <div id="selection">
                {!params?.definition_id
                    ? <ProcessDefinitionSelection />
                    : <ProcessDefinitionDetails />}
            </div>
            <ProcessDiagram />
        </main>
    );
};

const ProcessDiagram = () => {
    const state = useContext(AppState);
    const {params} = useRoute();

    return (
        <div id="preview">
            {state.process_definition_diagram.value !== null && params.definition_id !== undefined
                ? <ReactBpmn
                    diagramXML={state.process_definition_diagram.value.bpmn20Xml}
                    onLoading={console.log("Loading BPMN...") || null}
                    onShown={console.log("Hello BPMN...") || null}
                    onError={console.log("Error BPMN...") || null}
                />
                : "Select Process Definition"}

            <div id="canvas" />
        </div>)
}

const ProcessDefinitionSelection = () => {
    const state = useContext(AppState);

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
    const state = useContext(AppState);
    const {params} = useRoute();

    return (
        <>
            <h1>
                Process Definition
                <Suspense fallback={<span>...</span>}>
                    <span
                        class="selected">&nbsp;
                        {state.process_definition.value?.name}
                    </span>
                </Suspense>
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
                    <Suspense fallback={<dd>...</dd>}>
                        <dd class="font-mono copy-on-click"
                            onClick={copyToClipboard}>{state.process_definition.value?.id ?? "-/-"}</dd>
                    </Suspense>
                    <dt>Tenant ID</dt>
                    <Suspense fallback={<dd>...</dd>}>
                        <dd>{state.process_definition.value?.tenantId ?? "-/-"}</dd>
                    </Suspense>
                </dl>
            </div>

            <Tabs base_url={`/processes/${params.definition_id}`}
                  tabs={process_definition_tabs} />
        </>
    )
}


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
    const state = useContext(AppState);

    const {params} = useRoute();

    useSignalEffect(() => {
        api
            .get_process_instance_list(params.definition_id)
            .then((json) => (state.process_instances.value = json));
    });

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

    const state = useContext(AppState);
    const {params} = useRoute();

    useSignalEffect(() => {
        api
            .get_process_instance(params.selection_id)
            .then((res) => {
                state.process_instance.value = res
            })
    });

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

const InstanceVariables = () => {
    const state = useContext(AppState);
    const {params} = useRoute();

    useSignalEffect(() => {
        api.get_process_instance_variables(params.selection_id).then(res => state.selection_values.value = res)
    });

    return (
        <dl>
            {state.selection_values.value !== null
                ? Object.entries(state.selection_values.value).map(
                    // eslint-disable-next-line react/jsx-key
                    (kv) => (<>
                        <dt>{kv[0]}</dt>
                        <dd>{kv[1].value} ({kv[1].type})</dd>
                    </>))
                : "Loading ..."}
        </dl>
    )
}


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
        target: <InstanceVariables />
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

const copyToClipboard = (event) =>
    navigator.clipboard.writeText(event.target.innerText);

export {ProcessesPage}