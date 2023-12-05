import React, { useEffect, useState } from 'react'
import img from "../img/products/wm.png"
import axios from 'axios';
import { Link } from 'react-router-dom';



const Menu = ({cat}) => {
    // const product_home = [
    //     {
    //       id:"prod202310271000002001",
    //       title: "Washing Machine",
    //       desc: "Top Load Washing Machine",
    //       img: img,
    //     }
    //   ];
  const [product_homes,setProduct_homes] = useState([]);
  console.log(cat);

  useEffect(()=>{
    const fetchData = async ()=>{
    try {
      const res = await axios.get(`http://34.125.1.254:8800/api/products/?cat=${cat}`);
      setProduct_homes(res.data);
      console.log(res.data);
    } catch(err){
      console.log(err);
    }
  };
  fetchData();
},[cat]);

    return (
    <div className='menu'>
        <h1 >Other products</h1>
        {product_homes.map(product_home=>(
            <div className='product_home' key ={product_home.product_id}>
                <img src={product_home.picture} alt=''/>
                <h2>{product_home.pname}</h2>
                <Link to = {`/product/${product_home.product_id}`}>
                <button>Read More</button>
                </Link>
            </div>
        ))}
    </div>
  )
}
export default Menu
