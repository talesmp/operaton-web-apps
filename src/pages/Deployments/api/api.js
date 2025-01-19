import { globalState } from "../globalState";

const BASE_URL = "http://localhost:8080/engine-rest";

export const fetchDeployments = () => {
  fetch(`${BASE_URL}/deployment?sortBy=deploymentTime&sortOrder=desc`)
    .then((res) => res.json())
    .then((data) => {
      globalState.deployments.value = data;
      
      // Automatisch das erste Deployment auswählen
      if (data.length > 0) {
        globalState.selectedDeployment.value = data[0];
        fetchResources(data[0].id); // Ressourcen für das erste Deployment laden
      }
    });
};

export const fetchDeploymentInstancesCountById = (deployment_id) => {
  return fetch(`${BASE_URL}/process-instance/count`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deploymentId: deployment_id,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch instance count for deployment ${deployment_id}`);
      }
      return res.json();
    })
    .then((json) => {
      console.log(`Instance count for deployment ${deployment_id}:`, json);
      return json; // Rückgabe des JSON-Ergebnisses
    })
    .catch((error) => {
      console.error("Error fetching deployment instance count:", error);
      return null; // Rückgabe von null im Fehlerfall
    });
};

export const delete_deployment = (deployment_id, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();

  fetch(`${BASE_URL}/deployment/${deployment_id}?${queryParams}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Deployment ${deployment_id} deleted successfully.`);
        
        // Aktualisiere die Deployment-Liste nach dem Löschen
        fetchDeployments();

        // Setze globale View zurück
        globalState.selectedDeployment.value = null;
        globalState.resources.value = [];
        globalState.selectedResource.value = null;
        globalState.selectedProcessStatistics.value = null;
        globalState.selectedProcessDetails.value = null;
        globalState.bpmnXml.value = null;
      } else {
        response.json().then((json) => {
          console.error(`Failed to delete deployment ${deployment_id}:`, json.message);
        });
      }
    })
    .catch((error) => {
      console.error(`Error deleting deployment ${deployment_id}:`, error);
    });
};

export const fetchResources = (deploymentId) => {
  fetch(`${BASE_URL}/deployment/${deploymentId}/resources`)
    .then((res) => res.json())
    .then((data) => {
      globalState.resources.value = data;

      // Automatisch das erste Resource-Element auswählen
      if (data.length > 0) {
        const firstResource = data[0];
        globalState.selectedResource.value = firstResource;

        // Lade die zugehörigen Details
        fetchProcessDefinition(deploymentId, firstResource.name);
        fetchBpmnXml(deploymentId, firstResource.id);
      }
    })
    .catch((error) => {
      console.error("Error fetching resources:", error);
    });
};

export const fetchProcessDefinitionStatisticsById = (processDefinitionId) => {
  fetch(`${BASE_URL}/process-definition/statistics`)
    .then((res) => res.json())
    .then((data) => {
      const filteredData = data.filter(
        (item) => item.definition.id === processDefinitionId
      );

      globalState.selectedProcessStatistics.value =
        filteredData.length > 0 ? filteredData[0] : null;
    })
    .catch((error) => {
      console.error("Error fetching process definition statistics:", error);
      globalState.selectedProcessStatistics.value = null; 
    });
};

export const fetchProcessDefinition = (deploymentId, resourceName) => {
  fetch(
    `${BASE_URL}/process-definition?deploymentId=${deploymentId}&resourceName=${encodeURIComponent(
      resourceName
    )}&maxResults=50&firstResult=0`
  )
    .then((res) => res.json())
    .then((data) => {
      const processDefinitionId = data[0].id
      fetchProcessDefinitionStatisticsById(processDefinitionId)

      globalState.selectedProcessDetails.value = data[0];
    });
};

export const fetchBpmnXml = (deploymentId, resourceId) => {
  fetch(`${BASE_URL}/deployment/${deploymentId}/resources/${resourceId}/data`)
    .then((res) => res.text())
    .then((xml) => {
      globalState.bpmnXml.value = xml;
    });
};