import { POST } from '../helper.jsx'

// const login = (state, page) =>
//   POST(`/operaton/api/admin/auth/user/default/login/${page}`, null, state, state.user_login_response)

/**
 * Logout current user
 * @param {Object} state - Application state
 */
const logout = (state) =>
  POST('/operaton/api/admin/auth/user/default/logout', null, state, state.user_logout_response)

const auth = {
  logout,
  // login
}

export default auth