import ReactBpmn from "react-bpmn";
import { globalState } from "./globalState";
import { delete_deployment, fetchDeploymentInstancesCountById } from "./api/api";
import { useState } from "preact/hooks";
import * as Icons from '../../assets/icons'

const ProcessDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [skipCustomListeners, setSkipCustomListeners] = useState(true);
  const [skipIoMappings, setSkipIoMappings] = useState(true);
  const [instanceCount, setInstanceCount] = useState(0);

  const handleDelete = () => {
    console.table(globalState);
    delete_deployment(globalState.selectedDeployment.value.id, {
      cascade,
      skipCustomListeners,
      skipIoMappings,
    });
    setShowModal(false);
  };

  const openModal = () => {
    if (globalState.selectedDeployment.value) {
      fetchDeploymentInstancesCountById(globalState.selectedDeployment.value.id)
        .then((data) => {
          setInstanceCount(data.count || 0);
        })
        .catch((error) => {
          console.error("Error fetching instance count:", error);
          setInstanceCount(0);
        });
    }
    setShowModal(true);
  };

  return (
    <div class="process-details">
      {globalState.selectedProcessStatistics.value ? (
        <>
          {/* Process Details */}
          <h1>{globalState.selectedProcessStatistics.value?.definition.name || "N/A - Process name is not defined"}</h1>
          <p class={globalState.selectedProcessStatistics.value?.definition.suspended ? "status-suspended" : "status-active"}>
            {globalState.selectedProcessStatistics.value?.definition.suspended ? "Suspended" : "Active"}
          </p>
          <table class="process-details-table">
            <tbody>
              <tr>
                <td class="strong">Running Instances:</td>
                <td>{globalState.selectedProcessStatistics.value?.instances || 0}</td>
              </tr>
              <tr>
                <td class="strong">Open Incidents:</td>
                <td>{globalState.selectedProcessStatistics.value?.incidents.length || 0}</td>
              </tr>
              <tr>
                <td class="strong">Failed Jobs:</td>
                <td>{globalState.selectedProcessStatistics.value?.failedJobs || 0}</td>
              </tr>
              <tr>
                <td class="strong">Tenant:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.tenant || "N/A"}</td>
              </tr>
              <tr>
                <td class="strong">Version:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.version || "N/A"}</td>
              </tr>
              <tr>
                <td class="strong">Version Tag:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.versionTag || "N/A"}</td>
              </tr>
              <tr>
                <td class="strong">Startable in Tasklist:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.startableInTasklist ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td class="strong">History Time to Live:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.historyTimeToLive || "N/A"}</td>
              </tr>
              <tr>
                <td class="strong">Process Definition ID:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.id || "N/A"}</td>
              </tr>
              <tr>
                <td class="strong">Process Definition Key:</td>
                <td>{globalState.selectedProcessStatistics.value?.definition.key || "N/A"}</td>
              </tr>
              <tr>
                <td>
                  <a href={`/processes/${globalState.selectedProcessStatistics.value?.definition.id}/instances`}>
                  <Icons.link_out /> {globalState.selectedProcessStatistics.value?.definition.name || globalState.selectedProcessStatistics.value?.definition.key}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          {/* BPMN Viewer */}
          <div class="bpmn-viewer">
            {globalState.bpmnXml.value ? (
              <ReactBpmn
                diagramXML={globalState.bpmnXml.value}
                onLoading={() => console.log("Loading BPMN...")}
                onShown={() => {
                  const diagramContainer = document.querySelector(".bpmn-viewer");
                  if (diagramContainer) {
                    const breadcrumbs = diagramContainer.querySelector(".bjs-breadcrumbs");
                    const poweredBy = diagramContainer.querySelector(".bjs-powered-by");
                    if (breadcrumbs) {
                      breadcrumbs.remove();
                    }
                    if (poweredBy) {
                      poweredBy.remove();
                    }
                  }
                }}
                onError={(error) => console.error("Error loading BPMN diagram:", error)}
              />
            ) : (
              <p>Loading process diagram...</p>
            )}
          </div>

          {/* Delete Button */}
          <button onClick={openModal} class="delete-button">
            Delete Deployment
          </button>

          {/* Modal */}
          {showModal && (
            <div class="modal-overlay">
              <div class="modal-content">
                <div class="title">
                  <h3>Delete Deployment: {globalState.selectedDeployment.value?.name}</h3>
                </div>
                <div class="modal-body">
                  <hr />
                  {instanceCount > 0 && (
                    <p class="info-box">
                      There are {instanceCount} running process instances which belong to this deployment. <br />In order to delete this deployment, it is necessary to enable the Cascade flag.
                    </p>
                  )}
                  <form>
                    <div class="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={cascade}
                          onChange={(e) => setCascade(e.target.checked)}
                        />
                        Cascade
                        <span>
                          If enabled, all instances and historic instances related to this deployment will be deleted.
                        </span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={skipCustomListeners}
                          onChange={(e) => setSkipCustomListeners(e.target.checked)}
                        />
                        Skip Custom Listeners
                        <span>
                          If enabled, only built-in listeners will be notified of the end event.
                        </span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={skipIoMappings}
                          onChange={(e) => setSkipIoMappings(e.target.checked)}
                        />
                        Skip IO Mappings
                        <span>
                          If enabled, IO mappings will be skipped during deployment removal.
                        </span>
                      </label>
                    </div>
                  </form>
                  <hr />
                </div>
                <div class="modal-footer">
                  <p class="modal-footer-hint">
                    Are you sure you want to permanently delete this deployment?
                  </p>
                  <div class="modal-footer-buttons">
                    <button class="btn btn-secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <div class="tooltip-container">
                      <button
                        class="btn btn-primary"
                        onClick={handleDelete}
                        disabled={instanceCount > 0 && !cascade}
                      >
                        Delete
                      </button>
                      {instanceCount > 0 && !cascade && (
                        <span class="tooltip">
                          There are {instanceCount} running process instances. Enable the Cascade option to delete this deployment.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <h1 class="info-box">Select a resource to view details.</h1>
      )}
    </div>
  );
};

export { ProcessDetails };