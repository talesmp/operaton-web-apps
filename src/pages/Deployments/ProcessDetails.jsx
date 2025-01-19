import ReactBpmn from "react-bpmn";
import { globalState } from "./globalState";
import { delete_deployment } from "./api/api";
import { useState } from "preact/hooks";

const ProcessDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [cascade, setCascade] = useState(false);
  const [skipCustomListeners, setSkipCustomListeners] = useState(true);
  const [skipIoMappings, setSkipIoMappings] = useState(true);

  const handleDelete = () => {
    console.table(globalState)
    delete_deployment(
      globalState.selectedDeployment.value.id,
      {
        cascade,
        skipCustomListeners,
        skipIoMappings,
      }
    );
    setShowModal(false);
  };

  return (
    <div class="process-details">
      {globalState.selectedProcessStatistics.value ? (
        <>
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
            </tbody>
          </table>

          <div class="bpmn-viewer">
            {globalState.bpmnXml.value ? (
              <ReactBpmn
                diagramXML={globalState.bpmnXml.value}
                onLoading={() => console.log("Loading BPMN...")}
                onShown={() => {
                  // Entferne Breadcrumbs nach dem Rendern
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
          <button onClick={() => setShowModal(true)} class="delete-button">
            Delete Deployment
          </button>

          {/* Modal */}
          {showModal && (
            <div class="modal-overlay">
              <div class="modal-content">
                <div class="title">
                  <h3>
                    Delete Deployment:{" "}
                    {globalState.selectedDeployment.value?.name}
                  </h3>
                </div>
                <div class="modal-body">
                  <hr />
                  <form
                    style="display: flex; flex-direction: column; gap: var(--spacing-2);"
                  >
                    <div className="form-group">
                      <input
                        type="checkbox"
                        checked={cascade}
                        onChange={(e) => setCascade(e.target.checked)}
                      />
                      <label>
                        Cascade
                        <span>
                          If enabled, all instances and historic instances
                          related to this deployment will be deleted.
                        </span>
                      </label>
                    </div>
                    <div className="form-group">
                      <input
                        type="checkbox"
                        checked={skipCustomListeners}
                        onChange={(e) => setSkipCustomListeners(e.target.checked)}
                      />
                      <label>
                        Skip Custom Listeners
                        <span>
                          If enabled, only built-in listeners will be notified
                          of the end event.
                        </span>
                      </label>
                    </div>
                    <div className="form-group">
                      <input
                        type="checkbox"
                        checked={skipIoMappings}
                        onChange={(e) => setSkipIoMappings(e.target.checked)}
                      />
                      <label>
                        Skip IO Mappings
                        <span>
                          If enabled, IO mappings will be skipped during
                          deployment removal.
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
                    <button
                      class="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>

                    <div class="tooltip-container">
                      <button
                        class="btn btn-primary"
                        onClick={handleDelete}
                        disabled={
                          globalState.selectedProcessStatistics.value?.instances > 0 &&
                          !cascade
                        }
                      >
                        Delete
                      </button>
                      {globalState.selectedProcessStatistics.value?.instances > 0 &&
                        !cascade && (
                          <span class="tooltip">
                            There are running process instances. Enable the
                            Cascade option to delete this deployment.
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