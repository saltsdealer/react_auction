import React, { useContext, useEffect, useState } from 'react';
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Menu from '../components/Menu';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from '../context/authContext';

const User = () => {

  const location = useLocation();
  const [user, setUser] = useState({});
  const [buy, setBuy] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const username = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users/${username}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        // Redirect or handle error
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/users/product/${username}`);
        setBuy(res.data);
      } catch (err) {
        console.error(err);
        // Redirect or handle error
      }
    };

    fetchUser();
  }, [username]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }



  const userDetails = user.userDetails;
  const userProducts = user.userProducts;

  console.log(buy);


  if (!userDetails || !userProducts || !buy) {
    return <div>Loading...or have you logged in yet?</div>; // or any other loading indicator
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/users/${userDetails.user_id}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='user_page'>
      <div className="content_user">
        {userDetails && currentUser && Array.isArray(userProducts) && Array.isArray(buy) ? (
          <div>
            <div className='user_info'>
              <h2>NUID : {userDetails?.user_id}</h2>
              <h2>
                USER : {currentUser?.user_id === userDetails?.user_id ? userDetails?.user_name : userDetails?.nickname}
              </h2>
  
              {currentUser?.user_id === userDetails?.user_id && (
                <div className='edit'>
                  <Link to={'/change?edit=2'} state={userDetails}>
                    <img src={Edit} alt='' />
                  </Link>
                  <img onClick={handleDelete} src={Delete} alt='' />
                </div>
              )}
              <p>
                Created {userDetails?.create_time ? moment(userDetails.create_time).fromNow() : ''} <br />
              </p>
              <p>
                {currentUser?.user_id === userDetails?.user_id ? (
                  <>
                    Address: {userDetails?.address_detail}<br />
                    State: {userDetails?.add_id}<br />
                    Service: {userDetails?.manager_id}
                  </>
                ) : (
                  <>State: {userDetails?.add_id}</>
                )}
              </p>
            </div>
            <div className='products'>
              <h1>Uploaded</h1>
              {userProducts.map((product_user, index) => (
                <div className='product_user' key={product_user.product_id}>
                  <div className='img'>
                    <img src={product_user.picture} alt='' />
                  </div>
                  <div className="content">
                    <h2>Item {index + 1}</h2>
                    <Link className="link" to={`/product/${product_user.product_id}`}>
                      <h1>{product_user.pname}</h1>
                    </Link>
                    <p>{getText(product_user.description)} = {product_user.price}$</p>
                    <p>Status: {getText(product_user.status)}</p>
                  </div>
                </div>
              ))}
              {currentUser?.user_id === userDetails?.user_id && (
                <>
                  <h1>Bought</h1>
                  {buy.map((product_user, index) => (
                    <div className='product_user' key={product_user.product_id}>
                      <div className='img'>
                        <img src={product_user.picture} alt='' />
                      </div>
                      <div className="content">
                        <h2>Order {index + 1}</h2>
                        <Link className="link" to={`/product/${product_user.product_id}`}>
                          <h1>{product_user.pname}</h1>
                        </Link>
                        <p>{getText(product_user.description)} = {product_user.price}$</p>
                        <p>Status: {getText(product_user.status)}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div>Log out...</div>
        )}
      </div>
    </div>
  );
  
}

export default User