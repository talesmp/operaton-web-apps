import * as Icons from '../assets/icons.jsx'
import * as api from '../api.js'

import { createContext } from 'preact'
import { useContext } from 'preact/hooks'
import { signal } from '@preact/signals'
import { useHotkeys } from 'react-hotkeys-hook'

const createSearchState = () => {
  const server = signal(localStorage.getItem("server") || JSON.parse(import.meta.env.VITE_BACKEND)[0].url)
  const process_definition = signal(null)
  const process_instance = signal(null)

  return {
    server,
    process_definition,
    process_instance,
  }
}

const SearchState = createContext(undefined)

const Search = () =>
  <dialog id="global-search" class="fade-in">
    <SearchState.Provider value={createSearchState()}>
      <SearchComponent />
    </SearchState.Provider>
  </dialog>

const close = () => document.getElementById('global-search').close()
const show = () => document.getElementById('global-search').showModal()

const SearchComponent = () => {
  const state = useContext(SearchState)

  const search = ({ target: { value } }) => {
    console.log(value)
    void api.get_process_definition(state, value)
    void api.get_process_instance(state, value)
  }

  useHotkeys('alt+s', () => setTimeout(show, 100))


  return <search class="col gap-2">
    <div className="row space-between">
      <h2>Search</h2>
      <button
        className="neutral"
        onClick={close}>
        <Icons.close />
      </button>
    </div>

    <label className="col gap-1">
      <small>Find everything globally</small>
      <input
        autofocus
        type="search"
        placeholder="Search Operaton..."
        className="font-size-1"
        onKeyUp={search} />
    </label>

    <section>
      <h3>Results</h3>
      {(state.process_definition.value?.id) ?
        <div>
          <h4>Process Definition</h4>
          <a href={`/processes/${state.process_definition.value.id}`}
             onClick={close}>
            {state.process_definition.value.key}
          </a>
        </div>
        :
        <></>
      }
      {(state.process_instance.value?.id) ?
        <div>
          <h4>Process Instance</h4>
          <a href={`/processes/${state.process_instance.value.id}`}
             onClick={close}>
            {state.process_instance.value.key}
          </a>
        </div>
        :
        <></>
      }
      {(state.process_definition.value !== null && state.process_instance.value !== null) ??
        <output id="no-search-results">
          Nothing to show
        </output>
      }
    </section>
  </search>
}

export { Search }