import React from 'react'
import Logo from "../img/logo.png"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
        <img src = {Logo} alt = ""/>
        <span>Made with <b>React.js</b></span>
        <Link className='link' to= "/chat">
          <b>Chatbot</b>
        </Link>
    </footer>
  )
}

export default Footer