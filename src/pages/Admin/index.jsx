import { useSignalEffect } from '@preact/signals'
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
        <li class={is_selected("users")}><a href="/admin/users">Users</a></li>
        <li class={is_selected("groups")}><a href="/admin/groups">Groups</a></li>
        <li class={is_selected("tenants")}><a href="/admin/tenants">Tenants</a></li>
        <li class={is_selected("authorizations")}><a href="/admin/authorizations">Authorizations</a></li>
        <li class={is_selected("system")}><a href="/admin/system">System</a></li>
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
  const { params: { selection_id } } = useRoute();

  return  (selection_id === undefined)
    ? <UserList />
    : <UserDetails user_id={selection_id} />
}

const UserList = () => {
  const state = useContext(AppState)
  useSignalEffect(() => { void api.get_users(state) })

  return <div>
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
      {state.users.value?.map((user) => (
        <tr key={user.id}>
          <td><a href={`/admin/users/${user.id}`}>{user.id}</a></td>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.email}</td>
        </tr>
      )) ?? <tr><td>No Users found</td></tr>}
      </tbody>
    </table>
  </div>
}

const UserDetails = (user_id) => {
  return <div>
    <h2>User Details</h2>
    <p>
      {/*{user_id ?? 'unknown'}*/}
    </p>
  </div>
}



export { AdminPage }
