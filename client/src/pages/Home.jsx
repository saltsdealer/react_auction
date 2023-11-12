import React from 'react'
import { Link } from 'react-router-dom'
import img from '../img/th.jpg';

const Home = () => {

  const product_home = [
    {
      id:"prod202310270900002000",
      title: "Latest iPhone",
      desc: "Latest iPhone or maybe not?",
      img: img,
    }
  ]

  return (
    <div className='home'>
      <div className='product_homes'>
        {product_home.map(product_home=>(
          <div className='product_home' key={product_home.id}>
            <div className='img'>
              <img src = {product_home.img} alt=''/>
            </div>
            <div className="content">
              <Link className = "link" to ={`/product/${product_home.id}`}>
                <h1>{product_home.title}</h1>
                
              </Link>  
              <p>{product_home.desc}</p>
              <button>More Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home