import { signal } from "@preact/signals";
import { get_process_defintions, login } from "../../api";

const fetched = signal({ status: "uninitialized" });

{
  try {
    const result = await get_process_defintions();
    fetched.value = { status: "success", data: result };
  } catch (error) {
    fetched.value = { status: "error", message: error };
  }
}

export const Processes = () => (
  <>
    <aside>
      <ul class="tile-list">
        {fetched.value.data.map((process) => (
          <Process {...process} />
        ))}
      </ul>
    </aside>
    <main>
      <h1>Process Defintions</h1>
      {fetched.value.status}
    </main>
  </>
);

const Process = ({ definition, selected }) => (
  <li>
    <a href="" target="_blank" class={selected ? "tile selected" : "tile"}>
      <h2>{definition.name}</h2>
    </a>
  </li>
);
