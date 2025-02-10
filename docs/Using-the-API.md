# Using the API

The Operaton API is defined in [`/src/api.jsx`](../src/api.jsx). For detailed documentation
on the shown functions below, have a look at the docstrings inside the file.

We want to adhere to a common pattern when extending and using the API.

## Extending the API

We have some generic wrappers for the standard JavaScript `fetch` function. 

```js
const get = (url, state, signl) => {
  signl.value = { status: _STATE.LOADING }
  return fetch(`${_url(state)}${url}`)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(json => signl.value = { status: _STATE.SUCCESS, data: json })
    .catch(error => signl.value = { status: _STATE.ERROR, error: error.json() })
}
```

As you can see, it either creates a success response with the json and status code in a 
response object, or an error response (in the `.catch` clause) with the status code and error message. 


> **Important**: The signal's value has the following structure:  
> `signl.value = { status: _STATE.SUCCESS, data: json }`  
> `signl.value = { status: _STATE.ERROR, error: error.json() }`

Those should be used when adding a new endpoint:

```js
export const get_user_profile = (state, user_name) => get(`/user/${user_name ?? 'demo'}/profile`, state, state.user_profile)
```

## Using the API functions in a view component

To ensure every state of a request is communicated to the user, we defined an object (enum)
which represents every possible state:


```js
const _STATE = {
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
}
```

To keep things simple, when adding a section to the view component, we use the
`RequestState` component, which automatically chooses between the right content 
to show:

```js
export const RequestState = ({ signl, on_success }) =>
  <>
    {signl.value !== null ?
      {
        NOT_INITIALIZED: <p>No data requested</p>,
        LOADING: <p>Loading...</p>,
        SUCCESS: signl.value?.data ? on_success() : <p>No data</p>,
        ERROR: <p>Error: {signl.value.error}</p>
      }[signl.value.status]
      : <p>Fetching...</p>
    }
  </>
```

When calling the `RequestState` component, the following code may look like the following:

```js
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
```

> **Important**: The `on_success` parameter needs an (anonymous) function to prevent 
> executing possible (highly likely) access on the response when it is not successfully
> loaded.