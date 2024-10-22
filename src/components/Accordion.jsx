import { useRoute } from 'preact-iso'

const Accordion = ({ className, sections, accordion_name, param_name = 'panel' }) => {
  const { params } = useRoute()
  const tab = params[param_name]

  return (
    <div class={`accordion ${className || " "}`}>
      {sections.map(section => {
          return (
            <details key={section.id}
                     id={section.id}
                     name={accordion_name}
                     open={section.id === tab}>
              <summary>{section.name}</summary>
              <div class="panel">
                {section.target}
              </div>
            </details>)
        }
      )}
    </div>
  )
}

export { Accordion }