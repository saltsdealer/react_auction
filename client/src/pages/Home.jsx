import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';

const Home = () => {

  // const product_home = [
  //   {
  //     id:"prod202310270900002000",
  //     title: "Latest iPhone",
  //     desc: "Latest iPhone or maybe not?",
  //     img: img,
  //   }
  // ]
const [product_homes,setProduct_homes] = useState([]);

const cat = useLocation().search

useEffect(()=>{
  const fetchData = async ()=>{
    try {
      const res = await axios.get(`http://localhost:8800/api/products${cat}`);
      setProduct_homes(res.data);
    } catch(err){
      console.log(err);
    }
  };
  fetchData();
},[cat]);



const getText = (html) =>{
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.body.textContent
}

  return (
    <div className='home'>
      <div className='product_homes'>
        {product_homes.map((product_home)=>(
          <div className='product_home' key={product_home.product_id}>
            <div className='img'>
              <img src = {product_home.picture} alt=''/>
              
            </div>
            <div className="content">
              <Link className = "link" to ={`/product/${product_home.product_id}`}>
                <h1>{product_home.pname}</h1>
              </Link>  
              <p>{getText(product_home.description)} For {product_home.price}$</p>
              <p> Status: {getText(product_home.status)}</p>
              <button>More Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;