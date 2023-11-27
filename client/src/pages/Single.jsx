import React, { useCallback, useContext, useEffect, useState } from 'react'
import Edit from "../img/edit.png"
import Delete from "../img/delete.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Menu from '../components/Menu'
import axios from 'axios'
import moment from 'moment'
import { AuthContext } from '../context/authContext';
import Bidding from '../components/Bidding.jsx'

const Single = () => {

  const [product, setProduct] = useState({});
  const [timerDuration, setTimerDuration] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const product_id = location.pathname.split("/")[2];
  const [status, setStatus] = useState('');
  const { currentUser } = useContext(AuthContext);


  const openBidding = async () => {
    setStatus('Bidding'); // Open bidding immediately
    // count down trying 
    const endTime = new Date();
    endTime.setSeconds(endTime.getSeconds() + parseInt(timerDuration));
    localStorage.setItem('endTime', endTime);

    setCountdown(timerDuration);
    // ended here
    // setTimeout(() => {
    //   setStatus('Ended'); // End bidding after the specified duration
    // }, timerDuration * 1000); // Convert seconds to milliseconds
  };

  // change or break this to a use effect just check if it is sold
  const startBidSession = async () => {
    try {
      const before = await axios.get(`http://34.125.1.254:8800/api/orders/before/${product_id}`);
      if (before.data.status === '1') {
        setStatus('Sold');
        // get the bid session and find all the bids here
        return
      } else {
        //create bid session
        await axios.post(`http://34.125.1.254:8800/api/orders/`, {
          user_id: currentUser.user_id,
          time: timerDuration,
          productId: product_id
        });

      }
    } catch (err) {

    }
  }
  //setting status 
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        console.log("error here 1");
        // 1 for sold 0 for unsold
        const res1 = await axios.get(`http://34.125.1.254:8800/api/orders/before/${product_id}`);
        console.log("status: ", res1.data.status)
        if (res1.data.status === '1') setStatus('Sold');
        // if not initialized to unopened
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchStatus();
  }, [product_id]);

  // setting products
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data for product ID:", product_id);
      try {
        const res = await axios.get(`http://34.125.1.254:8800/api/products/${product_id}`);
        setProduct(res.data);
        
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    fetchData();
  }, [product_id]);


  const handleDelete = async () => {
    try {
      await axios.delete(`http://34.125.1.254:8800/api/products/${product_id}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };



  const startBiddingProcess = () => {
    startBidSession(); // Starting the bid session
    openBidding();     // Opening the bidding
  };


  const fetchStatusProcessing = useCallback(async () => {
    
    if (status !== 'Sold' && status !== 'unopened') {
      console.log("reading status", status)
      
      const response = await axios.get(`http://34.125.1.254:8800/api/orders/time/${product_id}`);
      console.log("reading res:", response.data.endTime);
      if (!response.data.endTime ){
        setStatus('unopened');
        return;
      }
      const endTime = new Date(response.data.endTime);
      const currentTime = new Date();
      if (endTime > currentTime) {
        if (status !== 'Bidding')
        setStatus('Bidding');
        return;
      } else if (endTime < currentTime) {
        // time ended
        const res = await axios.get(`http://34.125.1.254:8800/api/orders/bid_in_session/${product_id}`);
        if (res.data.bid_status === '1') {
          setStatus('Sold');
          await axios.post(`http://34.125.1.254:8800/api/orders/update/${product_id}`);
          return;
        } else if (res.data.bid_status === '0'){
          setStatus('Ended With No biders')
          await axios.delete(`http://34.125.1.254:8800/api/orders/${product_id}`);
        } else {
          console.log('No return value, check backend logic')
        }
    }
    }
  },[status,product_id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchStatusProcessing();
    }, 1000); // Run every second
  
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [fetchStatusProcessing]);

  //count down 
  const [countdown, setCountdown] = useState(null);
  const fetchEndTime = useCallback(async () => {
    try {
      const response = await axios.get(`http://34.125.1.254:8800/api/orders/time/${product_id}`);
      const endTime = new Date(response.data.endTime);
      //console.log("end_time:",endTime);
      return endTime;
    } catch (error) {
      console.error("Error fetching end time:", error);
      return null;
    }
  });

  const calculateRemainingTime = (endTime) => {
    const remainingTime = Math.floor((endTime.getTime() - new Date().getTime()) / 1000);
    return remainingTime > 0 ? remainingTime : null;
  };

  useEffect(() => {
    if (status !== 'Bidding') {
      setCountdown(null);
      return;
    }
    let intervalId;

    const initializeCountdown = async () => {
      const endTime = await fetchEndTime();
      if (endTime) {
        const remainingTime = calculateRemainingTime(endTime);
        setCountdown(remainingTime);

        intervalId = setInterval(() => {
          const newRemainingTime = calculateRemainingTime(endTime);
          if (newRemainingTime !== null) {
            setCountdown(newRemainingTime);
          } else {
            clearInterval(intervalId);
              // Set the status to 'Ended' here
          }
        }, 1000);
      }
    };

    initializeCountdown();

    return () => clearInterval(intervalId);
  }, [fetchEndTime,status]);
  // Render countdown if it's active
  const renderCountdown = () => {
    if (countdown !== null) {
      return <p>Time remaining: {countdown} seconds</p>;
    }
    //setStatus('Ended')
    return null;
  };
  // ended here
  if (!product || !currentUser || !product.user_id || !currentUser.user_id) {
    return <div>Login to see more...</div>; // or any other appropriate fallback content
  }
  // console.log("status", status)
  return (
    <div className='single'>
      <div className="content">
        <img src={product?.picture} alt='' />
        <div className='user'>
          <div className="info">
            <Link to={`/user/${product?.username}`}>
              <span>Uploaded by : {product?.username}</span>
            </Link>
            <p>Posted {moment(product.create_time).fromNow()}</p>
            <p>Starting at {product.price} $</p>
          </div>
          {currentUser.user_id === product.user_id && (

            <div className='edit'>

              {status !== 'Bidding' && (
                <div className='edit'>
                  <Link to={'/upload?edit=2'} state={product}>
                    <img src={Edit} alt='' />
                  </Link>
                  <img onClick={handleDelete} src={Delete} alt='' />
                </div>
              )}

              {/* modify this part so that a useeffect would return the status real time
              and hence this part could check the status to decide showing or not */}
              {status !== 'Sold' && status !== 'Bidding' && (
                <>
                  <input
                    type="number"
                    placeholder="Enter time in seconds"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(e.target.value)}
                  />
                  <button onClick={startBiddingProcess}>Open Bidding</button>
                </>
              )}

            </div>
          )}
        </div>
        <h1>{product.pname}</h1>
        {product.description}
        <div className="status">Status: {status} : {renderCountdown()}</div>
        {/* Bids Table */}
        {status !== 'unopened' && <Bidding product_id={product?.product_id} indicator={status}
          user_id={currentUser?.user_id} start_price={product?.price} puser={product?.user_id}
          time={timerDuration} />}
      </div>
      <Menu cat={product.prod_id} />
      {/* Status Indicator */}

    </div>
  )
}

export default Single;