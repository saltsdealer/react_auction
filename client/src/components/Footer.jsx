import React from 'react'
import Logo from "../img/logo.png"
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
        <img src = {Logo} alt = ""/>
        <Link to = {'/admin/login'}>
        <span>Admin Login</span>
        </Link>
        <span>Made with <b>React.js</b></span>
        
    </footer>
  )
}

export default Footer