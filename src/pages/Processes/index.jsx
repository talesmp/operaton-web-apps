import { signal, effect } from "@preact/signals";
import { useLocation, useRoute } from "preact-iso";
import * as api from "../../api";

// const { path, query, params } = useRoute();

const process_definitions = signal({ status: "uninitialized" });
const process_definition = signal(null);
const selected_process_definition = signal(null);
const process_instances = signal(null);

await api.fetch_to_signal(process_definitions, api.get_process_definitions);

export const Processes = () => (
  <>
    <aside>
      <ul class="tile-list">
        {process_definitions.value.data.map((process) => (
          <Process {...process} />
        ))}
      </ul>
    </aside>
    <main>
      <h1>Process Defintions</h1>
      <p>
        Name:
        {process_definition.value !== null
          ? process_definition.value.name
          : "Loading"}
      </p>
      <p>
        Instances:
        {process_instances.value !== null ? <Instances /> : "?"}
      </p>
    </main>
  </>
);

const update_selected_process_definition = (id) => {
  console.log("Process Defintion ID: ", id);

  selected_process_definition.value = id;

  // api.fetch_to_signal(process_instances, () =>
  //   api.get_process_instance_list(id),
  // );

  api
    .get_process_instance_list(id)
    .then((json) => (process_instances.value = json));
  // console.log(process_instances.value);
  effect(() => console.log("Process Instances: ", process_instances.value));

  // api.fetch_to_signal(process_definition, () => api.get_process_definition(id));

  api
    .get_process_definition(id)
    .then((json) => (process_definition.value = json));

  // effect(() => console.log(process_definition.value));
};

const Process = ({ definition: { id, name, version } }) => (
  <li>
    <a
      href={"/processes/" + id}
      class={
        id === selected_process_definition.value ? "tile selected" : "tile"
      }
      onClick={() => update_selected_process_definition(id)}
    >
      <h2>{name}</h2>
      <small>{version}</small>
    </a>
  </li>
);

const Instances = () => (
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
      {process_instances.value.map((instance) => (
        <ProcessInstance {...instance} />
      ))}
    </tbody>
  </table>
);

const ProcessInstance = ({ id, startTime, state, businessKey }) => (
  <tr>
    <td>{id}</td>
    <td>{startTime}</td>
    <td>{state}</td>
    <td>{businessKey}</td>
  </tr>
);
