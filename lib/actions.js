export const SET_QUERY = 'SET_QUERY'
export const ADD_APPLICATION = 'ADD_APPLICATION'

export function setQuery (query) {
  return {type: SET_QUERY, query}
}

export function addApplication (application) {
  return {type: ADD_APPLICATION, application}
}
