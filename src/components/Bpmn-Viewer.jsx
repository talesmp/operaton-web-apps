import ReactBpmn from 'react-bpmn'
import engine_rest, { RequestState } from '../api/engine_rest.jsx'
import { useContext } from 'preact/hooks'
import { AppState } from '../state.js'

export const BpmnViewer = ({ process_definition_id }) => {
  const
    state = useContext(AppState)

  void engine_rest.process_definition.diagram(state, process_definition_id)

  return <BpmnDetails />
}

const BpmnDetails = () => {
  const
    state = useContext(AppState)

  return (<div class="bpmn-viewer">
    <RequestState
      signl={state.api.process.definition.diagram}
      on_success={() =>
        <ReactBpmn
          diagramXML={state.api.process.definition.diagram.value.data.bpmn20Xml}
          onLoading={null}
          onShown={null}
          onError={null} />} />
  </div>)
}