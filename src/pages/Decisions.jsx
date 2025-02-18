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
      <p>huhu</p>
    </main>
  )
}


export { DecisionsPage }