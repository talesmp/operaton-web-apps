import ReactBpmn from 'react-bpmn';
import { get_process_definition_xml } from "../../api";
import { useEffect, useRef } from "preact/hooks";

export const BpmnViewer = ({ state, process_definition_id }) => {
  const diagramRef = useRef(null);

  useEffect(() => {
    get_process_definition_xml(state, process_definition_id)
      .catch((error) => console.error("Error fetching XML:", error))
  }, [process_definition_id])

  return (
    <div class="bpmn-viewer" ref={diagramRef}>
      {state.bpmn_xml.value ? (
        <ReactBpmn
          diagramXML={state.bpmn_xml.value}
          onShown={() => {
            if (diagramRef.current) {
              const breadcrumbs = diagramRef.current.querySelector('.bjs-breadcrumbs');
              const poweredBy = diagramRef.current.querySelector('.bjs-powered-by');
              breadcrumbs?.remove();
              poweredBy?.remove();
            }
          }}
          onError={(error) => console.error('BPMN rendering error:', error)}
        />
      ) : (
        <p role="status" aria-live="polite">Loading process diagram...</p>
      )}
    </div>
  )
}