import { useLocation, useRoute } from 'preact-iso'
import { AppState } from '../../state.js'
import * as api from '../../api.js'
import { useContext } from 'preact/hooks'
import { useSignalEffect } from '@preact/signals'

const AccountPage = () => {
  const { params: { page_id } } = useRoute()
  const { route } = useLocation()

  if (page_id === undefined) {
    route('account/profile')
  }

  const is_selected = (page) => (page_id === page) ? 'selected' : ''

  return <main id="account-page">
    <nav>
      <ul className="tile-list">
        <li className={is_selected('profile')}><a href="/account/profile">Profile</a></li>
        <li className={is_selected('account')}><a href="/account/account">Account</a></li>
        <li className={is_selected('groups')}><a href="/account/groups">Groups</a></li>
        <li className={is_selected('tenants')}><a href="/account/tenants">Tenants</a></li>
      </ul>
    </nav>

    {({
      profile: <ProfileAccountPage />,
      account: <p>Account Page</p>,
      groups: <GroupAccountPage />,
      tenants: <p>Tenants Page</p>,
    })[page_id] ?? <p>Select Page</p>}

  </main>
}

const ProfileAccountPage = () => {

  const { params: { selection_id } } = useRoute()

  const state = useContext(AppState)
  if (!state.user_profile.value) {
    void api.get_user_profile(state, null)
  }

  return (selection_id === 'edit') ? <ProfileEditPage /> : <ProfileDetails />

}

const ProfileEditPage = () => {
  const state = useContext(AppState),
    { user_profile, user_profile_edit, user_profile_edit_response } = state
  user_profile_edit.value = { ...user_profile.value }

  const set_value = (k, v) => user_profile_edit.value[k] = v.currentTarget.value

  const on_submit = e => {
    e.preventDefault()
    console.log(user_profile_edit.value)
    user_profile_edit_response.value = api.update_user_profile(state)
    console.log(user_profile_edit_response.value)
  }

  useSignalEffect(() => {
    return () => user_profile_edit_response.value = undefined
  })

  return <div>
    <h2>Edit user</h2>
    {(user_profile_edit_response.value?.success === false)
      ? <p className="error">Error: {user_profile_edit_response.value?.message}</p>
      : user_profile_edit_response.value?.success
        ? <p className="success">Successfully updated user.</p>
        : null}
    <form onSubmit={on_submit}>
      <label>
        First Name <br />
        <input type="text" value={user_profile_edit.value?.firstName} onInput={(e) => set_value('firstName', e)}
               required />
      </label>
      <label>
        Last Name <br />
        <input type="text" value={user_profile_edit.value?.lastName} onInput={(e) => set_value('lastName', e)}
               required />
      </label>
      <label>
        Email <br />
        <input type="email" value={user_profile_edit.value?.email} onInput={(e) => set_value('email', e)} required />
      </label>
      <br />
      <div className="button-group">
        <button type="submit">Update Profile</button>
        <a href="/account/profile" className="button secondary">Cancel</a>
      </div>
    </form>
  </div>
}

const ProfileDetails = () => {
  const state = useContext(AppState),
    { user_profile } = state

  return <div>
    <h2>Profile</h2>
    <p>{user_profile.value?.firstName} {user_profile.value?.lastName}</p>
    <p>{user_profile.value?.email}</p>
    <br />
    <a href="/account/profile/edit" className="button">Edit profile</a>
  </div>
}

const GroupAccountPage = () => {

  const state = useContext(AppState),
    { user_groups, user_profile } = state

  void api.get_groups(state)

  return <div>
    <h2>Groups</h2>
    <h3>Edit {user_profile.value.firstName} {user_profile.value.lastName}'s Groups</h3>

    <table>
      <thead>
      <tr>
        <th>Group ID</th>
        <th>Group Name</th>
        <th>Group Type</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {user_groups.value?.map((group) => (
        <tr key={group.id}>
          <td><a href={`/group/${group.id}`}>{group.id}</a></td>
          <td>{group.name}</td>
          <td>{group.type}</td>
          <td><a>Remove</a></td>
        </tr>
      )) ?? <tr>
        <td>No group assigned</td>
      </tr>}
      </tbody>
    </table>
    <br />
    <button>Add to a group +</button>
  </div>
}

export {
  AccountPage
}