import React from 'react'
import temp_img from "../img/products/th.jpg"
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link } from 'react-router-dom'
import Menu from '../components/Menu'

const Product = () => {
  return (
    <div className='product'>
      <div className="content">
        <img src={temp_img} alt='' />
        <div className='user'>
          <div className="info">
            <span>John</span>
            <p>Temp info</p>
          </div>
          <div className='edit'>
            <Link to={'/change?edit='}>
              <img src={Edit} alt='' />
            </Link>
            <img src={Delete} alt='' />
          </div>
        </div>
        <h1>temp_text</h1>
        
      </div>
      <Menu />
    </div>
  )
}

export default Product