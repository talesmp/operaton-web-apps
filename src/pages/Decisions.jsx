import { useContext, useState } from 'preact/hooks'
import { AppState } from '../state.js'
import { useLocation, useRoute } from 'preact-iso'
import { useSignal } from '@preact/signals'
import { get_decision_definitions } from '../api.jsx'


const DecisionsPage = () => {
  const state = useContext(AppState),
    { params } = useRoute(),
    {  route } = useLocation()

    if (state.api.decision.definition.list.value === null) {
        void get_decision_definitions(state)
          .then(() => console.log(state))
      }

  return (
    <main class="fade-in list-container">
      <h2 class="screen-hidden">Decisions</h2>
      <DecisionsList/>
    </main>
  )
}


const DecisionsList = () => {
  const
    state = useContext(AppState),
    { params } = useRoute()

  return (
    <div class="list-wrapper">
      <h3 class="screen-hidden">Queried decisions</h3>
      <ul class="list">
        {state.api.decision.definition.list.value.data?.map((decision) => (
          <li
            key={decision.id}
            class={params.decision_id === decision.id ? 'selected' : null}
          >
            <a href={`/decisions/${decision.id}`}>
              <div class="title">
                {decision?.name || decision?.id}
              </div>
              <footer>
                 <h5>footer machen</h5>
              </footer>
            </a>
          </li>
        )) ?? 'Loading...'}
      </ul>
    </div>
  )
}

export { DecisionsPage }