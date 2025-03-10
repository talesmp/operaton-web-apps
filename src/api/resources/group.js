import { POST, DELETE, PUT } from '../helper.jsx'

/* groups */

const get_groups = (state) =>
  POST('/group', {
    firstResult: 0,
    maxResults: 50,
    sortBy: 'id',
    sortOrder: 'asc'
  }, state, state.api.group.list)

const add_group = (state, group_id, user_name) =>
  PUT(`/group/${group_id}/members/${user_name ?? 'demo'}`, {
    id: group_id,
    // TODO remove `?? 'demo'` when we have working authentication
    userId: user_name ?? 'demo',
  }, state, state.add_group_response)

const remove_group = (state, group_id, user_name) =>
  DELETE(`/group/${group_id}/members/${user_name ?? 'demo'}`, {
    id: group_id,
    // TODO remove `?? 'demo'` when we have working authentication
    userId: user_name ?? 'demo',
  }, state, state.remove_group_response)

const get_user_groups = (state) =>
  POST('/group', {
    member: state.auth.user.id.value,
    firstResult: 0,
    maxResults: 50
  }, state, state.api.user.group.list)


const group = {
  all: get_groups,
  create: add_group,
  delete: remove_group,
  by_member: get_user_groups
}

export default group