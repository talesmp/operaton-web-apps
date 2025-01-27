import ReactBpmn from 'react-bpmn'
import * as api from '../../api'
import { useContext } from 'preact/hooks'
import { AppState } from '../../state.js'

export const BpmnViewer = ({ process_definition_id }) => {
  const
    state = useContext(AppState)

  void api.get_process_definition_xml(state, process_definition_id)

  return <BpmnDetails />
}

const BpmnDetails = () => {
  const
    state = useContext(AppState)

  return (<div class="bpmn-viewer">

    {(state.bpmn_xml.value !== null)
      ? <ReactBpmn
        diagramXML={state.bpmn_xml.value.bpmn20Xml}
        onLoading={null}
        onShown={null}
        onError={null} />
      : <p role="status" aria-live="polite">Loading process diagram...</p>}
  </div>)
}