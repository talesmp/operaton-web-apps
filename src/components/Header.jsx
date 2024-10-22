import { useLocation } from 'preact-iso'

export function Header () {
  const { url } = useLocation()

  return (
    <header>
      <nav id="secondary-navigation">
        <span id="logo">Operaton BPM</span>
        <menu>
          <menu>
            <li><a href="#content">Skip to content</a></li>
            <li><a href="#primary-navigation">Skip to Primary Navigation</a>
            </li>
          </menu>
          <menu>
            <li><a href="/accessibilty">Accessibility</a></li>
            <li><a href="/Help">Help</a></li>
            <li>Shortcuts</li>
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
            <li>Decisions</li>
          </menu>
          <menu>
            <li>Deployments</li>
            <li>Batches</li>
            <li>Migrations</li>
          </menu>
          <menu>
            <li>Admin</li>
          </menu>
        </menu>

        {/*
          <a href="/404" class={url == "/404" && "active"}>
            404
          </a>
          */}
      </nav>
    </header>
  )
}
