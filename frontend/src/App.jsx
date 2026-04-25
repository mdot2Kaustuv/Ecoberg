import { useState } from 'react'
import './assets/css/style.css'
import Home from './components/Home'
import Footer from './components/Footer'
import Header from './components/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <Home />
    <Footer/>

    </>
  )
}

export default App
