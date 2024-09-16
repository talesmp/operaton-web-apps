import {useSignalEffect} from "@preact/signals";
import {useContext} from "preact/hooks";
import {useRoute} from "preact-iso";
import * as api from "../../api";
import * as Icons from "../../assets/icons.jsx";
import ReactBpmn from "react-bpmn";
import {AppState} from "../../state.js";
import {Tabs} from "../../components/Tabs.jsx";

const ProcessesPage = () => {
  const state = useContext(AppState);
  const {params} = useRoute();

  void api.get_process_definitions(state)

  if (params.definition_id) {
    void api.get_process_definition(state, params.definition_id)
    void api.get_diagram(state, params.definition_id)
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
  const {process_definition_diagram} = useContext(AppState);
  const {params} = useRoute();

  const show_diagram =
    process_definition_diagram.value !== null &&
    params.definition_id !== undefined

  return (
    <div id="preview">
      {show_diagram
        ? <ReactBpmn
          diagramXML={process_definition_diagram.value.bpmn20Xml}
          onLoading={null}
          onShown={null}
          onError={null} />
        : "Select Process Definition"}
    </div>
  )
}

const ProcessDefinitionSelection = () =>
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
      {useContext(AppState).process_definitions.value?.map(process =>
        <ProcessDefinition key={process.id} {...process} />)}
      </tbody>
    </table>
  </>

const ProcessDefinitionDetails = () => {
  const {process_definition} = useContext(AppState);
  const {params} = useRoute();

  return (
    <>
      <h1>
        Process Definition
        <span class="selected">&nbsp;{process_definition.value?.name}</span>
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
          <dd class="font-mono copy-on-click" onClick={copyToClipboard}>
            {process_definition.value?.id ?? "-/-"}
          </dd>
          <dt>Tenant ID</dt>
          <dd>{process_definition.value?.tenantId ?? "-/-"}</dd>
        </dl>
      </div>

      <Tabs base_url={`/processes/${params.definition_id}`}
            tabs={process_definition_tabs} />
    </>
  )
}


const ProcessDefinition =
  ({definition: {id, name, key}, instances, incidents}) =>
    <tr>
      <td><a href={`/processes/${id}/instances`}>{name}</a></td>
      <td>{key}</td>
      <td>{instances}</td>
      <td>{incidents.length}</td>
      <td>?</td>
    </tr>


const Instances = () => {
  const state = useContext(AppState);
  const {params} = useRoute();

  void api.get_process_instances(state, params.definition_id)

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
      <InstanceTableRows />
      </tbody>
    </table>)
    : (<InstanceDetails />);
};

const InstanceTableRows = () =>
  useContext(AppState).process_instances.value?.map((instance) => (
    <ProcessInstance key={instance.id} {...instance} />
  )) ?? <p>...</p>

const InstanceDetails = () => {
  const state = useContext(AppState);
  const {params: {selection_id, definition_id}} = useRoute();

  void api.get_process_instance(state, selection_id)

  return (
    <div>
      <div class="row gap">
        <a className="tabs-back"
           href={`/processes/${definition_id}/instances`}
           title="Change Instance">
          <Icons.arrow_left />
          <Icons.list />
        </a>
        <InstanceDetailsDescription />
      </div>

      <Tabs
        base_url={`/processes/${definition_id}/instances/${selection_id}`}
        tabs={process_instance_tabs}
        param_name={"tab2"} />
    </div>
  )
}

const InstanceDetailsDescription = () =>
  <dl>
    <dt>Instance ID</dt>
    <dd>{useContext(AppState).process_instance.value?.id ?? "-/-"}</dd>
    <dt>Business Key</dt>
    <dd>{useContext(AppState).process_instance.value?.businessKey ?? "-/-"}</dd>
  </dl>


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

  const selection_exists = state.selection_values.value !== null

  useSignalEffect(() => {
    void api.get_process_instance_variables(state, params.selection_id)
  });

  return (
    <dl>
      {selection_exists
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

const Incidents = () => {
  const state = useContext(AppState)
  const {definition_id} = useRoute()

  useSignalEffect(() =>
    void api.get_process_incidents(state, definition_id)
  )

  return (
    <table>
      <thead>
      <tr>
        <th>Message</th>
        <th>Type</th>
        <th>Configuration</th>
      </tr>
      </thead>
      <tbody>
      {state.process_incidents.value?.map(incident =>
        <tr key={incident.id}>
          <td>{incident.incidentMessage}</td>
          <td>{incident.incidentType}</td>
          <td>{incident.configuration}</td>
        </tr>
      )}
      </tbody>
    </table>
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
    target: <Incidents />
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

// fixme : extract to util file
const copyToClipboard = (event) =>
  navigator.clipboard.writeText(event.target.innerText);

export {ProcessesPage}