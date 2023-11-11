import { createPortal } from 'react-dom'

const Portal = ({ children, el = document.body }: any) => createPortal(children, el)

export default Portal
