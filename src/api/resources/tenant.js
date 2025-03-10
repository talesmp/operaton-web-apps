import { GET, DELETE, PUT } from '../helper.jsx'


const get_user_tenants = (state, user_name) =>
  // TODO remove `?? 'demo'` when we have working authentication
  GET(`/tenant?userMember=${user_name ?? 'demo'}&maxResult=50&firstResult=0`, state, state.api.tenant.by_member)

const get_tenants = (state) =>
  GET(`/tenant?firstResult=0&maxResults=20&sortBy=id&sortOrder=asc`, state, state.api.tenant.list)

const add_tenant = (state, tenant_id, user_name) =>
  PUT(`/tenant/${tenant_id}/user-members/${user_name ?? 'demo'}`, {
    id: tenant_id,
    // TODO remove `?? 'demo'` when we have working authentication
    userId: user_name ?? 'demo',
  }, state, state.add_tenant_response)

const remove_tenant = (state, tenant_id, user_name) =>
  DELETE(`/tenant/${tenant_id}/user-members/${user_name ?? 'demo'}`, {
    id: tenant_id,
    // TODO remove `?? 'demo'` when we have working authentication
    userId: user_name ?? 'demo',
  }, state, state.remove_tenant_response)


const tenant = {
  all: get_tenants,
  create: add_tenant,
  delete: remove_tenant,
  by_member: get_user_tenants
}

export default tenant