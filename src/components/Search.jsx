import * as Icons from '../assets/icons.jsx'

export function Search () {

  return <dialog id="global-search">
    <search class="col gap-2">
      <div class="row space-between">
        <h2>Search</h2>
        <button
          class="neutral"
          onClick={() => document.getElementById('global-search').close()}>
          <Icons.close />
        </button>
      </div>

      <label class="col gap-1">
        <small>Find everything globally</small>
        <input type="search" placeholder="Search Operaton..." class="font-size-1" />
      </label>

      <section>
        <h3>Results</h3>
        <ul id="search-results" />
        <output id="no-search-results">
          Nothing to show
        </output>
      </section>
    </search>
  </dialog>
}
