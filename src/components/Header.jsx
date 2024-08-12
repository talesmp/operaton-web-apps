import { useLocation } from "preact-iso";

export function Header() {
  const { url } = useLocation();

  return (
    <header>
      <p id="logo">Operaton</p>
      <nav>
        <menu>
          <menu>
            <li>
              <a href="/tasks" class={url == "/tasks" && "active"}>
                Tasks
              </a>
            </li>
          </menu>
          <menu>
            <li>
              <a href="/processes" class={url == "/processes" && "active"}>
                Processes
              </a>
            </li>
            <li>Decisions</li>
            <li>Human Tasks</li>
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
  );
}
