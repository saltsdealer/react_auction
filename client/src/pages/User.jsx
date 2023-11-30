import React, { useContext, useEffect, useState } from 'react';
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { AuthContext } from '../context/authContext';
import Message from '../components/msgBoard.jsx';

const User = () => {
  // buyer_rate is made by buyer to seller 
  // seller rate vice versa
  const location = useLocation();
  const [user, setUser] = useState({});
  const [buy, setBuy] = useState({});
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const username = location.pathname.split("/")[2];
  const [buyorder, setbuyOrder] = useState({});
  const [sellorder, setSellOrder] = useState({});
  const [latestReviews, setLatestReviews] = useState([]);
  const [averageRate, setAverageRate] = useState(null);


  const [visibility, setVisibility] = useState({
    boughtProducts: true,
    uploadedProducts: true,
    orderCreated: true
  });// State to toggle visibility

  function getOrderIDByProductID(order, productId) {
    for (let i = 0; i < order.length; i++) {
      if (order[i].product_id === productId) {
        return order[i].order_id;
      }
    }
    return null; // Return null if no match is found
  }

  const toggleVisibility = (section) => {
    setVisibility(prevState => ({
      ...prevState,
      [section]: !prevState[section]
    }));
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://34.125.1.254:8800/api/users/${username}`);
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
        const res = await axios.get(`http://34.125.1.254:8800/api/users/product/${username}`);
        setBuy(res.data);
      } catch (err) {
        console.error(err);
        // Redirect or handle error
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const buy_order = await axios.post(`http://34.125.1.254:8800/api/users/orderByUser/`, { name: username, userType: 'buyer' });
        const sell_order = await axios.post(`http://34.125.1.254:8800/api/users/orderByUser/`, { name: username, userType: 'seller' });
        setbuyOrder(buy_order.data);
        setSellOrder(sell_order.data);
      } catch (err) {
        console.error(err);
        // Redirect or handle error
      }
    };

    fetchOrder();
  }, [username]);

  const userDetails = user.userDetails;
  const userProducts = user.userProducts;

  useEffect(() => {
    const fetchAverageRates = async () => {
      try {
        const response = await axios.get(`http://34.125.1.254:8800/api/users/rate/${username}`); // Adjust the URL as needed
        setAverageRate(response.data.average_value);
        const reviews = await axios.get(`http://34.125.1.254:8800/api/users/reviews/${username}`);
        setLatestReviews(reviews.data)
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, for example, set an error state
      }
    };

    fetchAverageRates();
  }, [username]);



  if (!userDetails || !userProducts || !buy) {
    return <div>Loading...or have you logged in yet?</div>; // or any other loading indicator
  }

  

  const handleDelete = async () => {
    try {
      await axios.delete(`http://34.125.1.254:8800/api/users/${userDetails.user_id}`);
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
              <h2>AVG RATES AS SELLER : {averageRate}</h2>
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
              <div>
                {currentUser?.user_id === userDetails?.user_id ? (
                  <>
                    Address: {userDetails?.address_detail}<br />
                    State: {userDetails?.add_id}<br />
                    Service: {userDetails?.manager_id}<br />
                    Comments got as seller: {latestReviews.map((comment, index) => (
                      <div key={index}>"{comment.buyer_comment}"</div>
                    ))}
                  </>
                ) : (
                  <>State: {userDetails?.add_id}</>
                )}
              </div>
            </div>
            <div className='products'>
              <h1>Uploaded</h1>
              <button onClick={() => toggleVisibility('uploadedProducts')}>
                {visibility.uploadedProducts ? 'Hide' : 'Show'}
              </button>
              {visibility.uploadedProducts && userProducts.map((product_user, index) => (
                <div className='product_user' key={product_user.product_id}>
                  <div className='img'>
                    <img src={product_user.picture} alt='' />
                  </div>
                  <div className="content">
                    {
                      getOrderIDByProductID(sellorder, product_user.product_id) !== null ? (
                        <Link className="link" to={`/order/${getOrderIDByProductID(sellorder, product_user.product_id)}`}>
                          <h2>Item {index + 1} : order created</h2>
                        </Link>
                      ) : (
                        // Optionally, render something else when getOrderIDByProductID returns null
                        <h2>Item {index + 1}</h2>
                      )
                    }
                    <Link className="link" to={`/product/${product_user.product_id}`}>
                      <h1>{product_user.pname}</h1>
                    </Link>

                    <p>{product_user.pname} at {product_user.price}$</p>
                    <p>Status: {getText(product_user.status)}</p>
                  </div>
                </div>
              ))}
              {currentUser?.user_id === userDetails?.user_id && (
                <>
                  <h1>Bought</h1>
                  <button onClick={() => toggleVisibility('boughtProducts')}>
                    {visibility.boughtProducts ? 'Hide' : 'Show'}
                  </button>
                  {visibility.boughtProducts && buy.map((product_user, index) => (
                    <div className='product_user' key={product_user.product_id}>
                      <div className='img'>
                        <img src={product_user.picture} alt='' />
                      </div>
                      <div className="content">
                        {
                          getOrderIDByProductID(buyorder, product_user.product_id) !== null ? (
                            <Link className="link" to={`/order/${getOrderIDByProductID(buyorder, product_user.product_id)}`}>
                              <h2>Order {index + 1} : order created</h2>
                            </Link>
                          ) : (
                            // Optionally, render something else when getOrderIDByProductID returns null
                            <h2>Order {index + 1}</h2>
                          )
                        }
                        <Link className="link" to={`/product/${product_user.product_id}`}>
                          <h1>{product_user.pname}</h1>
                        </Link>
                        <p>{product_user.pname} at {product_user.final_price}$</p>
                        <p>Status: {product_user.status}</p>
                      </div>
                    </div>
                  ))}

                </>

              )}
              {/* the list of participated records */}
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