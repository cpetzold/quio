import { remote } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'

const { getApplications } = remote.require('./macApplications')

const rootNode = document.createElement('div')
document.body.appendChild(rootNode)

ReactDOM.render(
  <div>
    Hello world
  </div>,
  rootNode
)
