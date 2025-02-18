import { useContext, useState } from 'preact/hooks'
import { AppState } from '../state.js'
import { useLocation, useRoute } from 'preact-iso'
import { useSignal } from '@preact/signals'
import {  } from '../api.jsx'


const DecisionsPage = () => {
  const state = useContext(AppState),
    { params } = useRoute(),
    {  route } = useLocation()


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
        {state.decisions.value?.map((decision) => (
          <li
            key={decision.id}
            class={params.deployment_id === decision.id ? 'selected' : null}
          >
            <a href={`/deployments/${decision.id}`}>
              <div class="title">
                {decision?.name || decision?.id}
              </div>
              <footer>
                <time datetime={decision.deploymentTime}>{new Date(decision.deploymentTime).toLocaleDateString()}</time>
              </footer>
            </a>
          </li>
        )) ?? 'Loading...'}
      </ul>
    </div>
  )
}

export { DecisionsPage }