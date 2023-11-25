import React, { useCallback, useContext, useEffect, useState } from 'react'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { AuthContext } from '../context/authContext';

const Order = () => {

  const location = useLocation();
  const order_id = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  const [orders, setOrder] = useState(null);
  const [ratings, setRatings] = useState({});


  const truncateID = (id) => {
    if (id && id.length > 2) {
      return `${id.substring(0, 2)}***`; // Replace with asterisks
    }
    return id;
  };

  const handleRatingChange = (orderId, role, newRating) => {
    const ratingKey = `${orderId}_${role}`;
    setRatings(prevRatings => ({
      ...prevRatings,
      [ratingKey]: newRating
    }));
  };

  const handlePublishRating = async (orderId, role) => {
    const ratingKey = `${orderId}_${role}`;
    const ratingValue = ratings[ratingKey];

    // Validate the rating value
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }

    // Prepare the data payload for the POST request
    const data = {
      order_id: orderId,
      [`${role}_rate`]: ratingValue, // Dynamically set the key based on the role
    };

    try {
      // Send a POST request to the server endpoint
      const response = await axios.post(`http://localhost:8800/api/users/rates`, data);
      console.log(response.data); // Handle the response as needed
      alert('Rating published successfully.');

      // Optionally, clear the input field after successful publishing
      setRatings(prevRatings => ({
        ...prevRatings,
        [ratingKey]: '' // Clear the input field
      }));
    } catch (error) {
      console.error('Failed to publish rating:', error);
      alert('Failed to publish rating.');
    }
  };

  const displayRating = (rate, orderId, role, order) => {
    if (rate === -1) {
      const ratingKey = `${orderId}_${role}`;

      if ((role === 'buyer' && currentUser.user_id === order.buyer_id) ||
        (role === 'seller' && currentUser.user_id === order.seller_id)) {
        return (
          <>
            <input
              type="number"
              min="1"
              max="5"
              value={ratings[ratingKey] || ''}
              onChange={(e) => handleRatingChange(orderId, role, e.target.value)}
              placeholder="Rate 1-5"
            />
            <button onClick={() => handlePublishRating(orderId, role)}>Publish</button>
          </>
        );
      } else {
        return 'Unrated';
      }
    }
    return rate;
  };

  const handleStatus = async (orderId, actionType) => {

    try {
      console.log(orderId, actionType);
      const response = axios.post('http://localhost:8800/api/users/update-status', { order_id: orderId, actionType: actionType });
      console.log(response.status);
      if (!response.status) {
        alert(`${actionType} succesfully`)
        window.location.reload();
        // Here you might want to update the state or inform the user of success
      }
    } catch (error) {
      alert('Error occurred while updating status');
      window.location.reload();
    }
  };

  function updateOrderComments(orderId, comments, role) {
    // Check which comment to update based on the role
    const updatePayload = { order_id: orderId, comment: comments, role: role };

    // Making an API call with axios to update the comments in the database
    axios.post(`http://localhost:8800/api/users/update-comments`, updatePayload)
      .then(response => {
        console.log('Success:', response.data);

      })
      .catch(error => {
        alert('Error occurred while updating status');
        window.location.reload();
      });
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("res");
        const res = await axios.get(`http://localhost:8800/api/users/order/${order_id}`);

        setOrder(res.data);


      } catch (err) {
        console.error(err);
        // Redirect or handle error
      }
    };

    fetchOrder();
  }, [order_id]);



  if (!orders || !currentUser?.user_id) {
    return <div>Loading...or have you logged in yet?</div>; // or any other loading indicator
  };

  let orderStatus = ''; // Declare orderStatus here

  if (orders[0].buyer_comment !== null && orders[0].buyer_rate !== -1 && orders[0].seller_comment !== null && orders[0].seller_rate !== -1) {
    orderStatus = 'Completed'; // Assign value to orderStatus
  } else {
    orderStatus = 'Incomplete'; // Assign value to orderStatus
  }

  console.log(orders);
  return (
    <div className="order-web">
      {orders.map((order, index) => (
        (currentUser.user_id === order.buyer_id || currentUser.user_id === order.seller_id) ? (
          <div key={index} className="order-card">
            <div><strong>Order ID:</strong> {order.order_id}</div>
            <div><strong>Order Status:</strong> {orderStatus}</div>
            <div><strong>Bid Session ID:</strong> {order.bid_session_id}</div>
            <div><strong>Final Price:</strong> {order.final_price}</div>
            <div><strong>Buyer ID:</strong> {order.buyer_id}</div>
            <div><strong>Seller ID:</strong> {order.seller_id}</div>
            <div><strong>Buyer Rate:</strong> {displayRating(order.buyer_rate, order.order_id, 'buyer', order)}</div>
            <div><strong>Seller Rate:</strong> {displayRating(order.seller_rate, order.order_id, 'seller', order)}</div>
            <div><strong>Ship Company:</strong> {order.company}</div>
            <div><strong>Ship Status:</strong> {order.ship_status === 0 ? 'Unshipped' : 'Shipped'}</div>

            {order.ship_status === 0 && currentUser.user_id === order.seller_id && (
              <button onClick={() => { handleStatus(order.order_id, 'ship') }}>
                Ship Hopefully You really shipped
              </button>

            )}
            <div><strong>Pay Status:</strong> {order.pay_status === 0 ? 'Unpaid' : 'Paid'}</div>
            {order.pay_status === 0 && currentUser.user_id === order.buyer_id && (
              <button onClick={() => { handleStatus(order.order_id, 'pay') }} >
                Pay Hopefully You really paid</button>
            )}

            <div><strong>Buyer Comments : </strong></div>

            <div>
              {order.buyer_comment || (
                <form>
                  {currentUser.user_id === order.buyer_id && (
                    <>
                      <input type="text" name="buyerComment" placeholder="Add comment" />
                      <button type="button" onClick={() => {
                        const comment = document.querySelector('[name="buyerComment"]').value;
                        updateOrderComments(order.order_id, comment, 'buyer');
                        alert('Comment uploaded successfully');
                        window.location.reload();
                      }}>Submit</button>
                    </>
                  )}
                </form>
              )}
            </div>

            <div><strong>Seller Comments : </strong></div>

            <div>
              {order.seller_comment || (
                <form>
                  {currentUser.user_id === order.seller_id && (
                    <>
                      <input type="text" name="sellerComment" placeholder="Add comment" />
                      <button type="button" onClick={() => {
                        const comment = document.querySelector('[name="sellerComment"]').value;
                        updateOrderComments(order.order_id, comment, 'seller');
                        alert('Comment uploaded successfully');
                        window.location.reload();
                      }}>Submit</button>
                    </>
                  )}
                </form>
              )}
            </div>

            <div><strong>Product:</strong> {order.pname}</div>

          </div>
        ) : (
          <div key={index} className="order-message">
            Only your order is visible
          </div>
        )
      ))}
    </div>
  );
}

export default Order