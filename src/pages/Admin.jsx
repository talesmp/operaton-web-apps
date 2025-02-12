import { useContext } from 'preact/hooks'
import { useRoute, useLocation } from 'preact-iso'
import * as api from '../api.jsx'
import { AppState } from '../state.js'
import { Breadcrumbs } from '../components/Breadcrumbs.jsx'
import { RequestState } from '../api.jsx'

const AdminPage = () => {
  const
    { params: { page_id } } = useRoute(),
    { route } = useLocation(),
    state = useContext(AppState)

  if (page_id === undefined) {
    route('/admin/users')
  }
  if (page_id === 'system') {
    void api.get_telemetry_data(state)
  }

  const is_selected = (page) => (page_id === page) ? 'selected' : ''

  return <main id="admin-page">
    <nav>
      <ul class="list">
        <li class={is_selected('users')}><a href="/admin/users">Users</a></li>
        <li class={is_selected('groups')}><a href="/admin/groups">Groups</a></li>
        <li class={is_selected('tenants')}><a href="/admin/tenants">Tenants</a></li>
        <li class={is_selected('authorizations')}><a href="/admin/authorizations">Authorizations</a></li>
        <li class={is_selected('system')}><a href="/admin/system">System</a></li>
      </ul>
    </nav>


    {({
      users: <UserPage />,
      groups: <p>Groups Page</p>,
      tenants: <p>Tenants Page</p>,
      authorizations: <p>Authorizations Page</p>,
      system: <SystemPage />,
    })[page_id] ?? <p>Select Page</p>}

  </main>
}

const SystemPage = () => {
  const { api: { engine: { telemetry } } } = useContext(AppState)

  return <RequestState
    signl={telemetry}
    on_success={() => <pre>{telemetry.value !== undefined ? JSON.stringify(telemetry.value?.data, null, 2) : ''} </pre>}
  />
}

// const JsonToText = (json) => {
//   return
// }

const UserPage = () => {
  const
    state = useContext(AppState),
    { params: { selection_id } } = useRoute()

  selection_id === undefined ? void api.get_users(state) : null

  return (selection_id === 'new')
    ? <UserCreate />
    : (selection_id === undefined)
      ? <UserList />
      : <UserDetails user_id={selection_id} />
}

const UserList = () => {
  const { api: { user: { list: users } } } = useContext(AppState)

  return <div className="content fade-in">
    <Breadcrumbs paths={[
      { name: 'Admin', route: '/admin' },
      { name: 'Users' }]} />
    <h2>Users</h2>
    <a href="/admin/users/new">Create New User</a>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Email</th>
      </tr>
      </thead>
      <tbody>
      <RequestState
        signl={users}
        on_success={() => users.value?.data.map((user) => (
          <tr key={user.id}>
            <td><a href={`/admin/users/${user.id}`}>{user.id}</a></td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
          </tr>
        )) ?? <tr>
          <td>No Users found</td>
        </tr>} />
      </tbody>
    </table>
  </div>
}

const UserDetails = (user_id) => {
  const
    state = useContext(AppState)

  void api.get_user_profile(state, user_id.value)
  void api.get_user_groups(state, user_id.value)

  return <div class="content fade-in">
    <Breadcrumbs paths={[
      { name: 'Admin', route: '/admin' },
      { name: 'Users', route: '/admin/users' },
      { name: 'Details' }]} />

    <h2>User Details</h2>

    <h3>Profile</h3>
    <UserProfile />
    <h3>Password</h3>
    <UserPassword />
    <h3>Groups</h3>
    <UserGroups />
    <h3>Tenants</h3>
    <h3>Danger Zone</h3>
  </div>
}

const UserGroups = () => {
  const { user_groups } = useContext(AppState)

  return <api.RequestState
    signl={user_groups}
    on_success={() =>
      <table>
        <caption>User Groups</caption>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Type</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {user_groups.value.data.map(group => <tr key={group.id}>
          <td>{group.id}</td>
          <td>{group.name}</td>
          <td>{group.type}</td>
          <td>Remove from group</td>
        </tr>)}
        </tbody>
      </table>
    } />
}

const UserProfile = () => {
  const
    { user_profile } = useContext(AppState)

  return <>{user_profile.value?.data
    ? <form>
      <label for="first-name">First Name </label>
      <input id="first-name" value={user_profile.value.data.firstName ?? ''} />

      <label for="last-name">Last Name</label>
      <input id="last-name" value={user_profile.value.data.lastName ?? ''} />

      <label for="email">Email</label>
      <input id="email" type="email" value={user_profile.value.data.email ?? ''} />


      <div class="button-group">
        <button type="submit">Update Profile</button>
      </div>
    </form>
    : <p>Loading...</p>
  }</>
}

const UserPassword = () => {

  return <form>
    <label for="new-password">New Password</label>
    <input id="new-password" type="password" placeholder="* * * * * * * * *" />

    <label for="new-password-repeat">New Password (repeat)</label>
    <input id="new-password-repeat" type="password" placeholder="* * * * * * * * *" />

    <div class="button-group">
      <button type="submit">Change Password</button>
    </div>
  </form>
}

const UserCreate = () => {
  // https://preactjs.com/guide/v10/forms/
  const
    state = useContext(AppState),
    { user_create, user_create_response } = state

  const set_value = (k1, k2, v) => user_create.value[k1][k2] = v.currentTarget.value
  const set_p_value = (k, v) => set_value('profile', k, v)
  const set_c_value = (k, v) => set_value('credentials', k, v)

  const on_submit = e => {
    e.preventDefault()
    console.log(user_create.value)
    user_create_response.value = api.create_user(state)
    // e.currentTarget.reset(); // Clear the inputs to prepare for the next submission
  }

  return <div>
    <h2>Create New User</h2>
    {(user_create_response.value !== undefined)
      ? user_create_response.value.success
        ? <p class="success">Successfully created new user.</p>
        : <p class="error">Error: {user_create_response.value?.message}</p> : null}
    <form onSubmit={on_submit}>
      <label for="user-id">User ID</label>
      <input id="user-id" type="text" onInput={(e) => set_p_value('id', e)} required />

      <label for="password1">Password</label>
      <input id="password1" type="password" onInput={(e) => set_c_value('password', e)} required />

      <label for="password2"> Password (repeated)</label>
      <input id="password2" type="password" onInput={(e) => set_c_value('password', e)} />

      <label for="first-name"> First Name</label>
      <input id="first-name" type="text" onInput={(e) => set_p_value('firstName', e)} required />

      <label for="last-name">Last Name</label>
      <input id="last-name" type="text" onInput={(e) => set_p_value('lastName', e)} required />

      <label for="email">Email</label>
      <input id="email" type="email" onInput={(e) => set_p_value('email', e)} required />

      <div class="button-group">
        <button type="submit">Create New User</button>
        <a href="/admin/users" class="button secondary">Cancel</a>
      </div>
    </form>
  </div>
}

export { AdminPage }
