import { globalState } from "./globalState";
import { fetchProcessDefinition, fetchBpmnXml } from "./api/api";

const ResourcesList = () => {
  return (
    <div class="resources-list">
      <h1>Resources</h1>
      <ul class="tile-list">
        {globalState.resources.value.map((resource) => (
          <li
            key={resource.id}
            class={globalState.selectedResource.value?.id === resource.id ? "selected" : ""}
            onClick={() => {
              globalState.selectedResource.value = resource;
              fetchProcessDefinition(globalState.selectedDeployment.value.id, resource.name);
              fetchBpmnXml(globalState.selectedDeployment.value.id, resource.id);
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