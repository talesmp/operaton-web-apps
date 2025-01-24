// noinspection HtmlUnknownAnchorTarget,JSValidateTypes

import { useLocation } from 'preact-iso'
import * as Icons from '../assets/icons.jsx'
import { useHotkeys } from 'react-hotkeys-hook'
import { useContext } from 'preact/hooks'
import { AppState } from '../state.js'

const servers = JSON.parse(import.meta.env.VITE_BACKEND)

const swap_server = (e, state) => {
  const server = servers.find(s => s.url === e.target.value)
  state.server.value = server
  localStorage.setItem('server', JSON.stringify(server))
}

export function Header () {
  const { url, route } = useLocation()
  const state = useContext(AppState)

  const showSearch = () => document.getElementById('global-search').showModal()

  useHotkeys('alt+0', () => route('/'))
  useHotkeys('alt+1', () => route('/tasks'))
  useHotkeys('alt+2', () => route('/processes'))
  useHotkeys('alt+4', () => route('/deployments'))
  useHotkeys('alt+7', () => route('/admin'))

  return <header>
    <nav id="secondary-navigation">
      <span id="logo">
        <a href="/">Operaton&nbsp;BPM</a>
      </span>
      <menu>
        <menu id="skip-links">
          <li><a href="#content">Skip to content</a></li>
          <li><a href="#primary-navigation">Skip to Primary Navigation</a>
          </li>
        </menu>
        <menu>
          <li><a href="/accessibilty">Accessibility</a></li>
          <li><a href="/help">Help</a></li>
          <li><a href="/">Shortcuts</a></li>
        </menu>
        <menu>
          <li><a href="/about">About</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><a href="/account">Account</a></li>

        </menu>
        <menu id="server_selector">
          <li>
            <label className="row center gap-1 p-1" title="Server selection">
              <Icons.server title="Server selection" />
              <select
                onChange={(e) => swap_server(e, state)}>
                <option disabled>ℹ️ Choose a server to retrieve your processes
                </option>
                {servers.map(server =>
                  <option key={server.url} value={server.url}
                          selected={localStorage.getItem('server')?.url === server.url}>
                    {server.name} {server.c7_mode ? '(C7)' : ''}
                  </option>)}
              </select>
            </label>
          </li>
        </menu>
      </menu>
    </nav>
    <nav id="primary-navigation" aria-label="Main">
      <menu>
        <menu>
          <li>
            <a href="/tasks"
               class={url.startsWith('/tasks') && 'active'}>Tasks</a>
          </li>
        </menu>
        <menu>
          <li>
            <a href="/processes"
               class={url.startsWith('/processes') && 'active'}>
              Processes
            </a>
          </li>
          <li><a href="/">Decisions</a></li>
        </menu>
        <menu>
          <li><a href="/">Deployments</a></li>
          <li><a href="/">Batches</a></li>
          <li><a href="/">Migrations</a></li>
        </menu>
        <menu>
          <li><a href="/admin"
                 class={url.startsWith('/admin') && 'active'}>Admin</a></li>
        </menu>
      </menu>

      <menu>
        <li>
          <button class="neutral" onClick={showSearch}>
            <Icons.search /> Search
            {/*<small class="font-mono">[&nbsp;ALT&nbsp;+&nbsp;S&nbsp;]</small>*/}
          </button>
        </li>
      </menu>
    </nav>
  </header>
}
