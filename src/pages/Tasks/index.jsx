import preactLogo from "../../assets/preact.svg";

const tasks = [
  { name: "Approve Invoice" },
  { name: "Book Trip", selected: true },
];

export const Tasks = () => (
  <>
    <aside>
      <ul class="tile-list">
        {tasks.map((task) => (
          <Task {...task} />
        ))}
      </ul>
    </aside>
    <main>
      <a href="https://preactjs.com" target="_blank">
        <img src={preactLogo} alt="Preact logo" height="160" width="160" />
      </a>
      <h1>Operaton</h1>
    </main>
  </>
);

const Task = ({ name, selected }) => (
  <li>
    <a href="" target="_blank" class={selected ? "tile selected" : "tile"}>
      <h2>{name}</h2>
    </a>
  </li>
);
