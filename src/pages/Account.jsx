import { useLocation, useRoute } from 'preact-iso'
import { AppState } from '../state.js'
import * as api from '../api.js'
import { useContext } from 'preact/hooks'
import { useComputed, useSignal, useSignalEffect } from '@preact/signals'

const AccountPage = () => {
  const
    { params: { page_id } } = useRoute(),
    { route } = useLocation()

  if (page_id === undefined) {
    route('account/profile')
  }

  const is_selected = (page) => (page_id === page) ? 'selected' : ''

  return <main id="account-page">
    <nav>
      <ul class="list">
        <li class={is_selected('profile')}><a href="/account/profile">Profile</a></li>
        <li class={is_selected('account')}><a href="/account/account">Account</a></li>
        <li class={is_selected('groups')}><a href="/account/groups">Groups</a></li>
        <li class={is_selected('tenants')}><a href="/account/tenants">Tenants</a></li>
      </ul>
    </nav>

    {({
      profile: <ProfileAccountPage />,
      account: <AccountAccountPage />,
      groups: <GroupAccountPage />,
      tenants: <p>Tenants Page</p>,
    })[page_id] ?? <p>Select Page</p>}

  </main>
}

const ProfileAccountPage = () => {
  const
    { params: { selection_id } } = useRoute(),
    state = useContext(AppState)

  if (!state.user_profile.value) {
    void api.get_user_profile(state, null)
  }

  return (selection_id === 'edit') ? <ProfileEditPage /> : <ProfileDetails />
}

const ProfileEditPage = () => {
  const
    state = useContext(AppState),
    { user_profile, user_profile_edit, user_profile_edit_response } = state

  user_profile_edit.value = { ...user_profile.value }

  const set_value = (k, v) => user_profile_edit.value[k] = v.currentTarget.value

  const on_submit = e => {
    e.preventDefault()
    user_profile_edit_response.value = api.update_user_profile(state)
  }

  useSignalEffect(() => {
    return () => user_profile_edit_response.value = undefined
  })

  return <div>
    <h2>Edit Profile</h2>
    {(user_profile_edit_response.value?.success === false)
      ? <p className="error">Error: {user_profile_edit_response.value?.message}</p>
      : user_profile_edit_response.value?.success
        ? <p className="success">Successfully updated user.</p>
        : null}
    <form onSubmit={on_submit}>
      <label for="first-name">First Name</label>
      <input id="first-name" type="text" value={user_profile_edit.value?.firstName}
             onInput={(e) => set_value('firstName', e)} required />

      <label for="last-name">Last Name</label>
      <input id="last-name" type="text" value={user_profile_edit.value?.lastName}
             onInput={(e) => set_value('lastName', e)} required />

      <label for="email">Email</label>
      <input id="email" type="email" value={user_profile_edit.value?.email}
             onInput={(e) => set_value('email', e)} required />

      <div class="button-group">
        <a href="/account/profile" class="button secondary">Cancel</a>
        <button type="submit">Update Profile</button>
      </div>
    </form>
  </div>
}

const ProfileDetails = () => {
  const
    state = useContext(AppState),
    { user_profile } = state

  return <div>
    <h2>Profile</h2>
    <dl>
      <dt>First Name</dt>
      <dd>{user_profile.value?.firstName}</dd>
      <dt>Last Name</dt>
      <dd>{user_profile.value?.lastName}</dd>
      <dt>Email</dt>
      <dd>{user_profile.value?.email}</dd>
    </dl>
    <a href="/account/profile/edit" class="button">Edit profile</a>
  </div>
}

const AccountAccountPage = () => {
  const
    state = useContext(AppState),
    { user_credentials, user_credentials_response, user_unlock_response } = state,
    // local state
    old_password = useSignal(''),
    password = useSignal(''),
    password_repeat = useSignal(''),
    // computed local state
    is_change_pw_button_disabled = useComputed(() => password.value !== password_repeat.value || !old_password.value || !password.value || !password_repeat.value),
    show_repeated_pw_hint = useComputed(() => password.value !== password_repeat.value),
    // form handlers
    on_submit = e => {
      e.preventDefault()
      user_credentials.value.authenticatedUserPassword = old_password.value
      user_credentials.value.password = password.value
      void api.update_credentials(state, null)
    },
    handle_delete_user = e => {
      e.preventDefault()
      console.log('Delete User')
      api.delete_user(state)
      //TODO close dialog
      //TODO api.logout
    },
    handle_unlock_user = e => {
      e.preventDefault()
      void api.unlock_user(state)
    },
    close_delete_user_dialog = () => document.getElementById('delete-user-dialog').close(),
    show_delete_user_dialog = () => document.getElementById('delete-user-dialog').showModal()


  useSignalEffect(() => {
    return () => {
      user_credentials_response.value = undefined
      user_unlock_response.value = undefined
    }
  })

  return <div>
    <h2>Edit Account</h2>

    <section>
      <h3>Change Password</h3>
      <form onSubmit={on_submit}>
        <label for="old-pw">Old Password</label>
        <input id="old-pw" type="password" onInput={(e) => old_password.value = e.currentTarget.value} required />

        <label for="new-pw">New Password</label>
        <input id="new-pw" type="password" onInput={(e) => password.value = e.currentTarget.value} required />

        <label for="new-pw-repeat">New Password (repeat)</label>
        <input id="new-pw-repeat" type="password" onInput={(e) => password_repeat.value = e.currentTarget.value}
               required />

        <div className="button-group">
          {show_repeated_pw_hint.value && <div class="danger">Passwords must match.</div>}
          {user_credentials_response.value?.success && <div>Password successfully changed.</div>}
          {user_credentials_response.value?.success === false && <div class="danger">Failed to change password!</div>}
          <button type="submit" disabled={is_change_pw_button_disabled.value}>Change Password</button>
        </div>
      </form>
    </section>

    <div>
      <h3>Delete User</h3>
      <p class="danger"><strong>Warning:</strong> deleting a user account cannot be undone.</p>
      <button onClick={show_delete_user_dialog}>Delete User</button>
      <dialog id="delete-user-dialog" class="fade-in">
        <h2>Please confirm</h2>
        <p><b>Warning:</b> Authorizations that belong to this user are not deleted automatically when you delete the
          user. Leftover authorizations are applied when creating a new user with the same id.
          Please head over to the <b>Authorizations page</b> to delete related authorizations or delete them via API.
        </p>
        <p>Really delete user?</p>
        <div class="button-group">
          <button onClick={close_delete_user_dialog}>Cancel</button>
          <button onClick={handle_delete_user}>Delete User</button>
        </div>
      </dialog>
    </div>

    <section>
      <h3>Unlock User</h3>
      <p class="hint"><strong>Notice:</strong> Only relevant if the user is locked.</p>
      <button onClick={handle_unlock_user}>Unlock User</button>
      {user_unlock_response.value?.success && <p>Success : User successfully unlocked.</p>}
      {user_unlock_response.value?.success === false && <p class="danger">Failed : Failed to unlock user.</p>}
    </section>
  </div>
}

const GroupAccountPage = () => {
  const
    state = useContext(AppState),
    { user_groups, groups } = state

  if (!user_groups.value) {
    void api.get_user_groups(state, null)
  }

  const close_add_group_dialog = () => document.getElementById('add-group-dialog').close()
  const show_add_group_dialog = () => {
    void api.get_groups(state)
    document.getElementById('add-group-dialog').showModal()
  }

  const handle_add_group = async (group_id) => {
    await api.add_group(state, group_id)
    user_groups.value = null;
  }

  const  handle_remove_group = async (group_id) => {
    await api.remove_group(state, group_id)
    user_groups.value = null;
  }

  const groups_without_user_groups = useComputed(() => {
    return groups.value?.response.filter(group => !user_groups.value?.response.map(user_group => user_group.id).includes(group.id))
  })

  return <div>
    <h2>Groups</h2>

    {user_groups.value?.response.length > 0 ? <table>
      <thead>
      <tr>
        <th>Group ID</th>
        <th>Group Name</th>
        <th>Group Type</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      {user_groups.value.response.map((group) => (
        <tr key={group.id}>
          <td><a href={`/group/${group.id}`}>{group.id}</a></td>
          <td>{group.name}</td>
          <td>{group.type}</td>
          <td><a onClick={() => handle_remove_group(group.id)}>Remove</a></td>
        </tr>
      ))}
      </tbody>
    </table>
      : <p>User is currently not a member of any group.</p>
    }
    <br />
    <button onClick={show_add_group_dialog}>Add to a group +</button>
    <dialog id="add-group-dialog" className="fade-in">
      <h2>Select Groups</h2>
      {groups_without_user_groups.value?.length > 0 ? <table>
        <thead>
        <tr>
          <th>Group ID</th>
          <th>Group Name</th>
          <th>Group Type</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {groups_without_user_groups.value.map((group) => (
          <tr key={group.id}>
            <td><a href={`/group/${group.id}`}>{group.id}</a></td>
            <td>{group.name}</td>
            <td>{group.type}</td>
            <td><a onClick={() => handle_add_group(group.id)}>Add</a></td>
          </tr>
        ))}
        </tbody>
      </table>
        : <p>There are no additional groups available on this page to which the user can be added.</p>
      }
      <br />
      <div className="button-group">
        <button onClick={close_add_group_dialog}>Close</button>
      </div>
    </dialog>
  </div>
}

export {
  AccountPage
}