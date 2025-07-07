import DmnJS from 'dmn-js'

export const DmnViewer = ({ xml, container }) => {
  const
    viewer = new DmnJS({
      container,
      height: 500,
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