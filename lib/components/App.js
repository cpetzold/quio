import { shell, remote } from 'electron'
import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, css } from 'aphrodite';
import Mousetrap from 'mousetrap'

import { setQuery } from '../actions'

function mapStateToProps (state) {
  const {query, applications} = state.toJS()
  return {
    query,
    matchedApplications: applications.filter(({name}) => {
      return query !== '' && name.toLowerCase().startsWith(query.toLowerCase())
    })
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setQuery: (newQuery) => {
      dispatch(setQuery(newQuery))
    }
  }
}

class App extends React.Component {

  componentDidMount() {
    const keys = new Mousetrap(this.input)
    keys.bind('escape', ::this.onEscape)
    keys.bind('enter', ::this.onEnter)
  }

  componentWillUnmount() {
    Mousetrap.reset()
  }

  onEscape(e) {
    if (this.props.query === '') {
      remote.getCurrentWindow().hide()
    } else {
      this.resetQuery()
    }
  }

  onEnter(e) {
    this.openFirstMatch()
  }

  resetQuery() {
    this.props.setQuery('')
  }

  openFirstMatch() {
    const {matchedApplications} = this.props
    let firstMatch = matchedApplications[0]

    if (firstMatch) {
      shell.openItem(firstMatch.path)
      this.resetQuery()
      remote.getCurrentWindow().hide()
    }
  }

  onQueryChange(e) {
    this.props.setQuery(e.target.value)
  }

  render () {
    const {query, matchedApplications} = this.props
    let firstMatch = matchedApplications[0]
    let hint = firstMatch ? firstMatch.name.substr(query.length) : ''

    return (
      <div>
        <input
          type="text"
          ref={i => this.input = i}
          placeholder="Search"
          autoFocus={true}
          className={css(styles.input)}
          value={query}
          onChange={::this.onQueryChange} />
        <div className={css(styles.input, styles.inputHint)}>{query}{hint}</div>
        {firstMatch &&
          <div
            className={css(styles.matchImage)}
            style={{backgroundImage: `url('file://${firstMatch.iconPng}')`}} />}
      </div>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'Helvetica',
    fontSize: 32,
    lineHeight: 1,
    padding: 16,
    width: '100vw',
    height: '100vh'
  },

  inputHint: {
    position: 'absolute',
    zIndex: -1,
    left: 0,
    top: 0,
    color: 'gray'
  },

  matchImage: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 48,
    height: 48,
    backgroundSize: 'cover'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
