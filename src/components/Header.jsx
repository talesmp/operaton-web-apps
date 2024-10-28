// noinspection HtmlUnknownAnchorTarget,JSValidateTypes

import { useLocation } from 'preact-iso'

export function Header () {
  const { url } = useLocation()

  return <header>
    <nav id="secondary-navigation">
      <span id="logo">
        <a href="/">Operaton BPM</a>
      </span>
      <menu>
        <menu>
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
      </menu>
    </nav>
    <nav id="primary-navigation" aria-label="Main">

      <menu>
        <menu>
          <li>
            <a href="/tasks" class={url.startsWith('/tasks') && 'active'}>
              Tasks
            </a>
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
          <li><a href="/">Admin</a></li>
        </menu>
      </menu>
    </nav>
  </header>
}
