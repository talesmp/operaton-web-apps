import { useContext } from 'preact/hooks'
import { useRoute, useLocation } from 'preact-iso'
import * as api from '../../api'
import { AppState } from '../../state.js'

const AdminPage = () => {
  const { params: { page_id } } = useRoute()
  const { route } = useLocation()

  if (page_id === undefined) {
    route('admin/users')
  }

  const is_selected = (page) => (page_id === page) ? 'selected' : ''

  return <main id="admin-page">
    <nav>
      <ul class="tile-list">
        <li class={is_selected('users')}><a href="/admin/users">Users</a></li>
        <li class={is_selected('groups')}><a href="/admin/groups">Groups</a></li>
        <li class={is_selected('tenants')}><a href="/admin/tenants">Tenants</a></li>
        <li class={is_selected('authorizations')}><a href="/admin/authorizations">Authorizations</a></li>
        <li class={is_selected('system')}><a href="/admin/system">System</a></li>
      </ul>
    </nav>


    {({
      users: <UserAdminPage />,
      groups: <p>Groups Page</p>,
      tenants: <p>Tenants Page</p>,
      authorizations: <p>Authorizations Page</p>,
      system: <p>System Page</p>,
    })[page_id] ?? <p>Select Page</p>}

  </main>
}

const UserAdminPage = () => {
  const
    state = useContext(AppState),
    { params: { selection_id } } = useRoute()

  selection_id === undefined ? void api.get_users(state) : null

  return (selection_id === 'new')
    ? <CreateUserPage />
    : (selection_id === undefined)
      ? <UserList />
      : <UserDetails user_id={selection_id} />
}

const UserList = () =>
  <div>
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
      {useContext(AppState).users.value?.map((user) => (
        <tr key={user.id}>
          <td><a href={`/admin/users/${user.id}`}>{user.id}</a></td>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.email}</td>
        </tr>
      )) ?? <tr>
        <td>No Users found</td>
      </tr>}
      </tbody>
    </table>
  </div>


const UserDetails = (user_id) => {
  const
    state = useContext(AppState)

  void api.get_user_profile(state, user_id.value)
  void api.get_user_groups(state, user_id.value)

  return <div>
    <h2>User Details</h2>

    <h3>Profile</h3>
    <h3>Password</h3>
    <h3>Groups</h3>
    <h3>Tenants</h3>
    <h3>Danger Zone</h3>
  </div>
}

const CreateUserPage = () => {
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
      <label>
        User ID <br />
        <input type="text" onInput={(e) => set_p_value('id', e)} required />
      </label>
      <label>
        Password <br />
        <input type="password" onInput={(e) => set_c_value('password', e)} required />
      </label>
      <label>
        Password (repeated) <br />
        <input type="password" />
      </label>
      <label>
        First Name <br />
        <input type="text" onInput={(e) => set_p_value('firstName', e)} required />
      </label>
      <label>
        Last Name <br />
        <input type="text" onInput={(e) => set_p_value('lastName', e)} required />
      </label>
      <label>
        Email <br />
        <input type="email" onInput={(e) => set_p_value('email', e)} required />
      </label>
      <br />
      <div class="button-group">
        <button type="submit">Create New User</button>
        <a href="/admin/users" class="button secondary">Cancel</a>
      </div>
    </form>
  </div>
}

export { AdminPage }
