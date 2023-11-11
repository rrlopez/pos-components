import ReactDOM from 'react-dom'

function Portal({ children, container = document.getElementById('headlessui-portal-root') || document.getElementsByTagName('body')[0] }: any) {
  return ReactDOM.createPortal(children, container)
}

export default Portal
