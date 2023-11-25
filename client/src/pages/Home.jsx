import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios';

const Home = () => {

const [product_homes,setProduct_homes] = useState([]);

const cat = useLocation().search

const [pname, setSearchTerm] = useState('');

const [category, setCategory] = useState('');

const [stateUploaded, setState] = useState('');

const [lowerPrice, setLowerPrice] = useState('');

const [upperPrice, setUpperPrice] = useState('');

const [searched, setSearched] = useState('');



const handleSearch = async (event) => {
  const searchParams = {
    pname,
    category,
    stateUploaded,
    lowerPrice,
    upperPrice
  };
  console.log(searchParams);
  try {
    const res = await axios.post(`http://localhost:8800/api/products/search`, searchParams);
    setSearched(res.data);
    console.log("res:", res.data);
  } catch (error) {
    console.error('Search failed:', error);
    // Handle errors here
  }
};

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

useEffect(() => {
  // If `searched` has a value, set `product_homes` to that value
  if (searched) {
      setProduct_homes(searched); // Assuming you want to set product_homes as an array with `searched` as its only element
  }
  
}, [searched]);

const getText = (html) =>{
  const doc = new DOMParser().parseFromString(html, "text/html")
  return doc.body.textContent
}

console.log("pd", product_homes);

  return (
    <div className='home'>
      <div className="searchBox">
      <input
        type="text"
        placeholder="Search products..."
        value={pname}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="elc">Electronics</option>
        <option value="bks">Books</option>
        <option value="fod">Food</option>
        <option value="frn">Furniture</option>
        <option value="hlh">Health & Beauty</option>
        <option value="jwl">Jewelry</option>
        <option value="spt">Sports</option>
        <option value="toy">Toys</option>
        {/* Add more categories as needed */}
      </select>

      <input
        type="State"
        placeholder="State"
        value={stateUploaded}
        onChange={(e) => setState(e.target.value)}
      />
       <div className="price-range">
      <input
        type="text"
        placeholder="Min Price"
        value={lowerPrice}
        onChange={(e) => setLowerPrice(e.target.value)}
      />

      <input
        type="text"
        placeholder="Max Price"
        value={upperPrice}
        onChange={(e) => setUpperPrice(e.target.value)}
      />
      </div>
      <button onClick={handleSearch}>Search</button>
    </div>

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
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;