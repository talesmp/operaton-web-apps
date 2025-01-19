import { AppState } from "../../state";
import { get_process_definition_2 } from "../../api";
import { get_bpmn20xml } from "../../api";
import { useContext } from "preact/hooks";

const ResourcesList = () => {
  const state = useContext(AppState)
  return (
    <div class="resources-list">
      <h1>Resources</h1>
      <ul class="tile-list">
        {state.deployment_resources.value.map((resource) => (
          <li
            key={resource.id}
            class={state.selected_resource.value?.id === resource.id ? "selected" : ""}
            onClick={() => {
              state.selected_resource.value = resource;
              get_process_definition_2(state, state.selected_deployment.value.id, resource.name);
              get_bpmn20xml(state, state.selected_deployment.value.id, resource.id);
            }}
          >
            <div class="padding-1">
              <header>
                <span class="title">
                  {resource.name.includes("/")
                    ? resource.name.split("/").pop().trim()
                    : resource.name || "N/A"}
                </span>
              </header>
              <div>
              </div>
              <footer>

              </footer>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { ResourcesList };