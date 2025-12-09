import { useState } from 'react'

import CountryChart from './components/CountryChart'
import CountrySearch from './components/CountrySearch'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div className="App">
      <h1>University Data Visualization</h1>
      <CountryChart/>
      <h1>Country Search</h1>
      <CountrySearch/>
    </div>
  )
}

export default App
