import moment from 'moment'
import { Component } from 'react'
import { v4 as uuid } from 'uuid'

interface OverlayState {
  dialogs: any
  isMounted: boolean
}

interface dialogProps {
  key: number
  id: number
  props: any
  Component: any
  open: boolean
  onClose(): void
}

const defaultState: OverlayState = {
  dialogs: [],
  isMounted: false,
}

class Overlay extends Component<any, OverlayState> {
  static instance: any

  constructor(props: any) {
    super(props)
    this.state = defaultState

    if (Overlay.instance) {
      Overlay.instance?.clear()
      Overlay.instance.props = this.props
      return Overlay.instance
    }

    Overlay.instance = this
  }

  showDialog(Component: any, options = {}) {
    const { key, ...props }: any = options
    const [...dialogs] = this.state.dialogs.filter(({ key, open }: any) => open || key)
    const dialog = dialogs.find((dialog: any) => dialog.key && dialog.key === key)
    const id = uuid().split('-')[0]

    if (dialog) {
      dialog.open = true
      dialog.props = props
    } else dialogs.push({ open: true, props, Component, key, id })

    this.setState({ dialogs })

    return id
  }

  delDueToBackButton(id: number) {
    this.setState(state => {
      const dialog = state.dialogs.find((dialog: any) => dialog.id === id)
      if (dialog) dialog.open = false
      return { ...state }
    })
  }

  delDialog(id: number) {
    this.delDueToBackButton(id)
  }

  clear() {
    this.state.dialogs.forEach((dialog: any) => {
      this.delDialog(dialog.id)
    })
  }

  render() {
    return this.state.dialogs.map(({ Component, open, props, id }: dialogProps) => (
      <Component
        key={id}
        {...props}
        {...{
          open,
          onClose: () => {
            this.delDialog(id)
          },
        }}
      />
    ))
  }
}

export const showModal = async (...args: any) => {
  const options = args[1] || {}
  if (options.activeKey) {
    const expiration: any = JSON.parse(localStorage.getItem(options.activeKey) || '{}')
    if (moment(new Date(expiration.value)).isAfter(moment(new Date()))) {
      await options.onYes?.({ ...options, onClose: () => {} })
      return
    }
    localStorage.removeItem(options.activeKey)
  }

  return Overlay.instance.showDialog(...args)
}
export const delModal = (...args: any) => Overlay.instance.delDialog(...args)
export const clearModals = () => Overlay.instance?.clear()

export default Overlay
