import { signal } from "@preact/signals";
import ReactBpmn from 'react-bpmn'
import { get_bpmn20xml } from "../../api";

const bpmn20Xml = signal(null)

const BpmnViewer = ({ state, process_definition_id }) => {
      get_bpmn20xml(state, process_definition_id).then((xml) => {
        bpmn20Xml.value = xml;
      })

return (
    <div class="bpmn-viewer">
        {bpmn20Xml.value ? (
          <ReactBpmn
            diagramXML={bpmn20Xml.value}
            onLoading={() => console.log('Loading BPMN...')}
            onShown={() => {
              // remove bpmn.io logo and list elements
              const diagramContainer = document.querySelector('.bpmn-viewer')
              if (diagramContainer) {
                const breadcrumbs = diagramContainer.querySelector('.bjs-breadcrumbs')
                const poweredBy = diagramContainer.querySelector('.bjs-powered-by')
                if (breadcrumbs) {
                  breadcrumbs.remove()
                }
                if (poweredBy) {
                  poweredBy.remove()
                }
              }
            }}
            onError={(error) => console.error('Error loading BPMN diagram:', error)}
          />
        ) : (
          <p>Loading process diagram...</p>
        )}
    </div>
)
}


export {BpmnViewer}