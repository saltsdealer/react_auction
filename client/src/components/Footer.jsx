import React, { useContext } from 'react'
import Logo from "../img/logo.png"
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext';

const Footer = () => {

  const { currentUser } = useContext(AuthContext);
  const getChatbotLink = () => {
    if (currentUser && !currentUser.user_id && currentUser.admin_id) {
      return '/adminchat'; // Link to a special admin chat, for example
    } else {
      return '/chat'; // Default link to the regular chatbot
    }
  };
  console.log(getChatbotLink);
  return (
    <footer>
        <img src = {Logo} alt = ""/>
        <Link to = {'/admin/login'}>
        <span>Admin Login</span>
        </Link>
       
        
        <Link className='link' to= {getChatbotLink()}>
          <b>Chatbot</b>
        </Link>
        <span>Made with <b>React.js</b></span>
    </footer>
  )
}

export default Footer