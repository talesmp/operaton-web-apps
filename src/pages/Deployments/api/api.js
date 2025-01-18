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

export const delete_deployment = (deployment_id, params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  
  fetch(`${BASE_URL}/deployment/${deployment_id}?${queryParams}`, {
    //headers: headers_json,
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Deployment ${deployment_id} deleted successfully.`);
      } else {
        return response.json().then((json) => {
          console.error(`Failed to delete deployment ${deployment_id}:`, json.message);
          return json.message;
        });
      }
    })
    .catch((error) => {
      console.error(`Error deleting deployment ${deployment_id}:`, error);
    });

  return null;
};

export const fetchResources = (deploymentId) => {
  fetch(`${BASE_URL}/deployment/${deploymentId}/resources`)
    .then((res) => res.json())
    .then((data) => {
      globalState.resources.value = data;
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