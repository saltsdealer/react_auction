import React, { useContext, useEffect, useState } from 'react'
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../context/authContext';

const Single = () => {

  const [product, setProduct] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const product_id = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for product ID:", product_id);
      try {
        const res = await axios.get(`http://localhost:8800/api/products/${product_id}`);
        setProduct(res.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, [product_id]);
 
  const handleDelete = async ()=>{
    try {
      await axios.delete(`http://localhost:8800/api/products/${product_id}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  if (!product || !currentUser || !product.user_id || !currentUser.user_id) {
    return <div>Login to see more...</div>; // or any other appropriate fallback content
  }

  console.log("user:",currentUser);
  console.log("product:",product);
  return (
    <div className='single'>
      <div className="content">
        <img src={product?.picture} alt='' />
        <div className='user'>
          <div className="info">
            <span>{product.user_name}</span>
            <p>Posted {moment(product.create_time).fromNow()}</p>
          </div>
          {currentUser.user_id === product.user_id && (
            
          <div className='edit'>
            <Link to={'/upload?edit=2'} state = {product}>
              <img src={Edit} alt='' />
            </Link>
            <img onClick = {handleDelete} src={Delete} alt='' />
          </div>
          )}
        </div>
        <h1>{product.pname}</h1>
        {product.description}
      </div>
      <Menu cat = {product.prod_id}/>
      {/* console.log(cat); */}
    </div>
  )
}

export default Single;