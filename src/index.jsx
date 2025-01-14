import {render} from "preact";
import {LocationProvider, Router, Route} from "preact-iso";
import {AppState, createAppState} from "./state.js";

import { Header } from './components/Header.jsx'

import { Home } from "./pages/Home/index.jsx";
import { Tasks } from "./pages/Tasks/index.jsx";
import { ProcessesPage } from "./pages/Processes/index.jsx";
import { NotFound } from "./pages/_404.jsx";

import './css/fonts.css'
import './css/form.css'
import './css/variables.css'
import './css/layout.css'
import './css/components.css'
import './css/normalize.css'
import './css/animation.css'
import { Search } from './components/Search.jsx'

'use strict'

export function App () {
  return (
    <AppState.Provider value={createAppState()}>
      <LocationProvider>
        <Header />
        <Router>
          <Route path="/" component={Home} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/tasks/:task_id" component={Tasks} />
          <Route path="/tasks/:task_id/:tab" component={Tasks} />
          <Route path="/processes" component={ProcessesPage} />
          <Route path="/processes/:definition_id" component={ProcessesPage} />
          <Route path="/processes/:definition_id/:panel" component={ProcessesPage} />
          <Route path="/processes/:definition_id/:panel/:selection_id" component={ProcessesPage} />
          <Route path="/processes/:definition_id/:panel/:selection_id/:sub_panel" component={ProcessesPage} />
          <Route path="/admin" component={AdminPage} />
          <Route path="/admin/:page_id" component={AdminPage} />
          <Route path="/admin/:page_id/:selection_id" component={AdminPage} />
          <Route default component={NotFound} />
        </Router>
        <Search />
      </LocationProvider>
    </AppState.Provider>
  )
}

render(<App />, document.getElementById('app'))
