import { POST } from '../helper.jsx'

/**
 * Logout current user
 * @param {Object} state - Application state
 */
const user_logout = (state) =>
  POST('/operaton/api/admin/auth/user/default/logout', null, state, state.user_logout_response)

const auth = {
  logout: user_logout
}

export default auth