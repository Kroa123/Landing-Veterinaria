import { Component } from 'react'

// Si la escena 3D falla (contexto WebGL perdido, chunk que no carga), muestra el fallback
// en lugar de romper el hero.
export default class SceneBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
