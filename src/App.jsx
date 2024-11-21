import { useState } from 'react'
import './App.css'
import DataTable from './DataTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DataTable />
    </>
  )
}

export default App
