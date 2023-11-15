import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../img/logo.png'
import { AuthContext } from '../context/authContext.js'

const Navbar = () => {
    const {currentUser,logout} = useContext(AuthContext);
  return (
    <div className='navbar'>
        <div className="container">
            <div className="logo">
                <Link to = "/">
                    <img src = {Logo} alt=''/>
                </Link>
            </div>
            <div className="links">
                <Link className='link' to= "/?cat=elc">
                    <h6>Electronics</h6>
                </Link>
                <Link className='link' to= "/?cat=apl">
                    <h6>Appliances</h6>
                </Link>
                <Link className='link' to= "/?cat=bks">
                    <h6>Books</h6>
                </Link>
                <Link className='link' to= "/?cat=fod">
                    <h6>Food</h6>
                </Link>
                <Link className='link' to= "/?cat=frn">
                    <h6>Furniture</h6>
                </Link>
                <Link className='link' to= "/?cat=spt">
                    <h6>Sports</h6>
                </Link>
                <Link className='link' to= "/?cat=app">
                    <h6>Apparel</h6>
                </Link>
                <Link className='link' to= "/?cat=toy">
                    <h6>Toys</h6>
                </Link>
                <Link className='link' to= "/?cat=hlh">
                    <h6>Health</h6>
                </Link>
                <Link className='link' to= "/?cat=jwl">
                    <h6>Jewelry</h6>
                </Link>
                <span>{currentUser?.username}</span>
                {currentUser ? (
                    <span onClick={logout}>Logout</span>
                ) : (
                    <Link className="link" to="/login">
                        Login
                    </Link>
                )} 
                <span className="post">
                    <Link className = "link" to = "/post">Post</Link>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Navbar