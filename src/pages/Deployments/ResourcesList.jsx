import { AppState } from "../../state";
import { get_process_definition_by_deployment_id } from "../../api";
import { useContext } from "preact/hooks";

export const ResourcesList = () => {
  const state = useContext(AppState)
  return (
    <div class="resources-list">
      <h3 class="screen-hidden">Resources</h3>
      <ul class="tile-list">
        {state.deployment_resources.value.map((resource) => (
          <li
            key={resource.id}
            class={state.selected_resource.value?.id === resource.id ? "selected" : ""}
            onClick={() => {
              state.selected_resource.value = resource;
              get_process_definition_by_deployment_id(state, state.selected_deployment.value.id, resource.name);       }}
          >
            <div class="padding-1">
              <span class="title">
                {resource.name.includes("/")
                  ? resource.name.split("/").pop().trim()
                  : resource.name || "N/A"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};