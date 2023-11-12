import React from 'react'
import img from "../img/wm.png"



const Menu = () => {
    const product_home = [
        {
          id:"prod202310271000002001",
          title: "Washing Machine",
          desc: "Top Load Washing Machine",
          img: img,
        }
      ];
    
    return (
    <div className='menu'>
        <h1 >Other products</h1>
        {product_home.map(product_home=>(
            <div className='product_home' key ={product_home.id}>
                <img src={product_home.img} alt=''/>
                <h2>{product_home.title}</h2>
                <button>Read More</button>
            </div>
        ))}
    </div>
  )
}
export default Menu
