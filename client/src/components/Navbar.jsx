import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../img/logo.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="container">
            <div className="logo">
                <img src = {Logo} alt=''/>
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
                <Link className='link' to= "/?cat=apl">
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
                <span>Signup</span>
                <span>Logout</span>
                <span className="post">
                    <Link className = "link" to = "/post">Post</Link>
                </span>
            </div>
        </div>
    </div>
  )
}

export default Navbar