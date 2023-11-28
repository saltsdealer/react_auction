import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'


const Bidding = ({ product_id, indicator, user_id, start_price, puser, time, onBiddingUpdate }) => {
  // Assuming 'product_id' is an array of objects with bid details
  // For example: [{ bidder: 'User1', amount: 100, date: '2023-01-01' }, ...]
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [bidStatusMessage, setBidStatusMessage] = useState('');


  const handleBidAmountChange = (event) => {
    setBidAmount(event.target.value);
  };

  const fetchBids = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8800/api/orders/bids/${product_id}`);
      setBids(res.data); // Update the state with the fetched bids
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  }, [product_id]); // product_id is a dependency

  const formatBidder = (bidder) => {
    // Check if the bidder string is long enough
    if (bidder && bidder.length > 2) {
      return `${bidder.substring(0, 2)}${'*'.repeat(bidder.length - 2)}`;
    }
    return bidder;
  };

  const formatCreateTime = (createTime) => {
    // Extracting up to the minute part of the ISO string
    return createTime ? createTime.substring(0, 16) : '';
  };
  useEffect(() => {
    // Fetch bids when the component mounts
    fetchBids();
    // If the indicator is 'Bidding', set up polling to fetch bids every second
    let intervalId;
    if (indicator === 'Bidding') {
      intervalId = setInterval(fetchBids, 1000); // Poll every 1 second
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [product_id, indicator, fetchBids]);

  const handleBidClick = async () => {
    try {
      const highestBid = bids.length > 0 ? Math.max(...bids.map(bid => bid.price)) : start_price;
      if (Number(bidAmount) > highestBid) {
        // Handle successful bid logic
        setBidStatusMessage("Bid successful!");
        await axios.post(`http://localhost:8800/api/orders/add`, {
          bidder_id: user_id,
          product_id: product_id,
          bidprice: bidAmount
        })
      } else {
        // Handle unsuccessful bid logic
        setBidStatusMessage("Bidding unsuccessful. Bid amount is too low.");
      }
    } catch (err) {
      // Handle any errors
      console.error("Error in bidding process:", err);
    }
  };

  const checkOrder = useCallback(async (bids) => {
    try {
      if (bids.length === 0) {
        console.log("No bids available");
        return;
      }
      
      // First GET request to check if order exists
      const res = await axios.get(`http://localhost:8800/api/orders/order/${product_id}`);
      console.log('Order status:', res.data.order_status);
  
      // Proceed only if there is no existing order
      if (res.data.order_status === 'No Order') {
        // Find the highest bid
        const highestBid = bids.reduce((max, bid) => bid.price > max.price ? bid : max, bids[0]);
        console.log('Highest bid:', highestBid);
  
        // Get seller ID
        const sellerResponse = await axios.get(`http://localhost:8800/api/users/userByProduct/${product_id}`);
        console.log('Seller ID:', sellerResponse.data.user_id);
  
        // POST request to create a new order
        const orderResponse = await axios.post(`http://localhost:8800/api/orders/create`, {
          price: highestBid.price,
          buyer_id: highestBid.user_id,
          bid_session_id: highestBid.bid_session_id,
          seller_id: sellerResponse.data.user_id
        });
  
        // Handle the response from order creation
        console.log('Order created:', orderResponse.data);
        // Return or handle the response as needed
      }
    } catch (err) {
      console.error('Error in checkOrder:', err);
      // Handle the error appropriately
    }
  }, [product_id]);

  useEffect(() => {
    // Check and call createOrder only when product_id changes
    if (indicator === "Sold") {
      checkOrder(bids)
    }
  }, [indicator, checkOrder]); 

  return (
    <div style={{ padding: '20px', backgroundColor: '#e6f5f4', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} className="bids-table">

      <h3>Bids: </h3>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
          <tr>
            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Bidder</th>
            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Amount</th>
            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid, index) => (
            <tr key={index}>
              <td style={{ padding: '8px 10px', textAlign: 'left' }}>{formatBidder(bid.user_id)}</td>
              <td style={{ padding: '10px 10px', textAlign: 'left' }}> ${bid.price}</td>
              <td style={{ padding: '10px 10px', textAlign: 'left' }}>{formatCreateTime(bid.create_time)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {indicator === 'Bidding' && (
        <div style={{ marginTop: '20px' }}>

          {
            user_id !== puser && (
              <>
                <input
                  type="number"
                  placeholder="Bid amount"
                  onChange={handleBidAmountChange}
                  style={{ padding: '10px', marginRight: '10px', borderRadius: '5px' }}
                />
                <button
                  onClick={handleBidClick}
                  style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  Place Bid
                </button>
                {bidStatusMessage && <p>{bidStatusMessage}</p>}
              </>
            )
          }

        </div>
      )}
      {}
    </div>
  );
};

export default Bidding;
