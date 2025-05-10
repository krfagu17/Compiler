import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EditorComp from './components/EditorComp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="mainContainer">
      
      <EditorComp/>
    </div>
    </>
  )
}

export default App
