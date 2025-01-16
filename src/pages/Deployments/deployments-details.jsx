import * as Icons from '../../assets/icons.jsx'
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { delete_deployment } from "../../api";
import { AppState } from "../../state";
import ReactBpmn from 'react-bpmn';
import * as api from '../../api'

const DeploymentDetails = ({ selectedDeployment }) => {
    const state = useContext(AppState);
    const [diagramXml, setDiagramXml] = useState(null);
    const diagramContainerRef = useRef(null);

    const [showModal, setShowModal] = useState(false);
    const [cascade, setCascade] = useState(false);
    const [skipCustomListeners, setSkipCustomListeners] = useState(true);
    const [skipIoMappings, setSkipIoMappings] = useState(true);

    useEffect(() => {
        if (selectedDeployment?.definition?.id) {
            api.get_diagram(state, selectedDeployment.definition.id)
                .then((response) => {
                    setDiagramXml(response.bpmn20Xml);
                })
                .catch((error) => {
                    console.error("Error loading process diagram:", error);
                });
        }
    }, [selectedDeployment]);

    useEffect(() => {
        if (diagramContainerRef.current) {
            const breadcrumbs = diagramContainerRef.current.querySelector(".bjs-powered-by, .bjs-breadcrumbs");
            if (breadcrumbs) {
                breadcrumbs.remove();
            }
        }
    }, [diagramXml]);

    const handleDelete = () => {
        delete_deployment(state, selectedDeployment.definition.deploymentId, {
            cascade,
            skipCustomListeners,
            skipIoMappings,
        });
        setShowModal(false);
    };

    if (!selectedDeployment) {
        return (
            <div class="deployments-details-panel deployments-details">
                <p class="deployments-details-empty">
                    Select a deployment to view details.
                </p>
            </div>
        );
    }

    return (
        <div class="deployments-details-panel">
            <div class="details-content">
                <h1 class="title">{selectedDeployment.definition.name}</h1>
                {selectedDeployment.definition.suspended ? (
                    <p>
                        <strong>Status: </strong>
                        <span class="status-suspended">Suspended</span>
                    </p>
                ) : (
                    <p>
                        <strong>Status: </strong>
                        <span class="status-active">Active</span>
                    </p>
                )}
                <p><strong>Version: </strong>{selectedDeployment.definition.version}</p>
                <p> <strong>Process Definition Key: </strong>{selectedDeployment.definition.key}</p>
                <p><strong>Deployment ID: </strong>{selectedDeployment.definition.deploymentId}</p>
                {selectedDeployment.definition.startableInTasklist ? (
                    <p><strong>Startable in Tasklist: </strong>True</p>
                ) : (
                    <p><strong>Startable in Tasklist: </strong>False</p>
                )}

                <button onClick={() => setShowModal(true)} class="delete-button">
                    <Icons.trash /> Delete Deployment
                </button>
            </div>
            {showModal && (
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="title">
                            <h3>Delete Deployment: {selectedDeployment.definition.name}</h3>
                        </div>
                        <div class="modal-body">
                            <hr />
                            <form style="display: flex; flex-direction: column; gap: var(--spacing-2);">
                                <div className="form-group">
                                    <input
                                        type="checkbox"
                                        checked={cascade}
                                        onChange={(e) => setCascade(e.target.checked)}
                                    />
                                    <label>
                                        Cascade
                                        <span>If the value is enabled, all instances, including historic Instances, related to this deployment will also be deleted.</span>
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
                                        <span>If the value is enabled, only built-in listeners will be notified with the end event.</span>
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
                                        <span>If the value is enabled IO
                                            mappings will be skipped during deployment removal.</span>
                                    </label>
                                </div>
                            </form>
                            <hr />
                        </div>
                        <div class="modal-footer">
                            <p class="modal-footer-hint">Are you sure you want to permanently delete the given deployment?</p>

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
                                        disabled={(selectedDeployment.instances > 0 && !cascade)}
                                    >
                                        Delete
                                    </button>
                                    {(selectedDeployment.instances > 0 && !cascade) && (
                                        <span class="tooltip">
                                            There are running process instances which belong to this deployment. In order to delete this deployment it is necessary to enable the option Cascade flag.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div class="diagram-content" ref={diagramContainerRef}>
                {diagramXml ? (
                    <ReactBpmn
                        diagramXML={diagramXml}
                        onLoading={null}
                        onShown={null}
                        onError={null}
                    />
                ) : (
                    <p>Loading process diagram...</p>
                )}
            </div>
        </div>
    );
};

export default DeploymentDetails;