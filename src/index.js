import { remote } from 'electron'
import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { SET_QUERY, ADD_APPLICATION, addApplication } from './actions'

import App from './components/App'

const { getApplications } = remote.require('./macApplications')

const initialState = Immutable.fromJS({
  query: '',
  applications: []
})

function reducer (state = initialState , action) {
  switch (action.type) {
    case SET_QUERY:
      return state.set('query', action.query.trimLeft())
    case ADD_APPLICATION:
      return state.update('applications', (apps) => apps.push(action.application))
  }
  return state
}

const store = createStore(reducer, window.devToolsExtension && window.devToolsExtension())

async function main() {
  let applications = await getApplications()
  applications.forEach(application => {
    store.dispatch(addApplication(application))
  })
}

main()

const rootNode = document.createElement('div')
document.body.appendChild(rootNode)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootNode
)
