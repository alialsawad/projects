import App from './App'
import './global.css'
import { createRoot } from 'react-dom/client'
const container = document.getElementById('app')
const root = createRoot(container as Element | DocumentFragment)
root.render(<App />)
