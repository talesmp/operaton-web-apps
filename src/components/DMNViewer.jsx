import engine_rest from '../api/engine_rest.jsx'
import { useContext } from 'preact/hooks'
import { AppState } from '../state.js'
import { useRoute } from 'preact-iso'
import { DmnJS } from 'dmn-js'

export const BpmnViewer = ({ xml, container, tokens }) => {
  const
    // state = useContext(AppState),
    // { params: { definition_id } } = useRoute(),
    viewer = new DmnJS({
      container
    })

  viewer.importXML(xml, (err) => {
    if (err) {
      console.log('error rendering', err)
    } else {
      console.log('rendered')
    }
  })

  return <></>
}