import { signal, effect } from "@preact/signals";
import { useLocation, useRoute } from "preact-iso";
import * as api from "../../api";

// const { path, query, params } = useRoute();

const process_definitions = signal({ status: "uninitialized" });
const process_definition = signal(null);
const selected_process_definition = signal(null);

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
    </main>
  </>
);

const update_selected_process_definition = (id) => {
  selected_process_definition.value = id;

  // api.fetch_to_signal(process_definition, () => api.get_process_definition(id));

  api
    .get_process_definition(id)
    .then((json) => (process_definition.value = json));

  effect(() => console.log(process_definition.value));
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
