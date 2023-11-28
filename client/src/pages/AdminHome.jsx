import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/authContext';
import moment from 'moment';
import Message from '../components/msgBoard.jsx';

const AdminHome = () => {

    const [cats, setCats] = useState();
    const { currentUser } = useContext(AuthContext);
    const [managed, setManaged] = useState();
    const [type, setType] = useState('');
    const [sells, setSells] = useState();
    const [currentTime, setCurrentTime] = useState(moment().format('dddd, MMMM Do YYYY, HH:mm:ss'));
    const [bidders, setBidders] = useState();
    useEffect(() => {
        const fetchSells = () => {
            try {
                axios.get(`http://localhost:8800/api/admin/sells`).then(response => {
                    // The data you want is in response.data
                    console.log(response.data); // This will log the data part to the console
                    // You can now use this data as needed in your application
                    setSells(response.data);
                });
                //

            } catch (err) {
                console.log(err)
            }
        };

        fetchSells();
    }, []);

    useEffect(() => {
        const fetchCats = () => {
            try {
                axios.get(`http://localhost:8800/api/admin/home/bycat`).then(response => {

                    setCats(response.data);
                });


            } catch (err) {
                // Handle error
            }
        };

        fetchCats();
    }, []);

    useEffect(() => {
        const fetchManaged = async () => {
            let t;
            if (currentUser.admin_id < '1000') {
                t = 'manager';
            } else if (currentUser.admin_id > '1000') {
                t = 'admin';
            } else {
                console.log("Something wrong");
                return;
            }
            setType(t);

            try {
                await axios.get(`http://localhost:8800/api/admin/${currentUser.admin_id}/${t}`).then(response => {

                    setManaged(response.data);
                });

            } catch (err) {
                // Handle error
            }
        };

        fetchManaged();
    }, [currentUser]);

    useEffect(() => {
        const fetchBidders = () => {


            try {
                axios.get(`http://localhost:8800/api/admin/bidders`).then(response => {

                    setBidders(response.data);

                });

            } catch (err) {
                // Handle error
            }
        };

        fetchBidders();
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(moment().format('dddd, MMMM Do YYYY, HH:mm:ss'));
        }, 1000);

        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    if (!currentUser) return <div>Confidential content login to access</div>; 
    
    return (
        <>
            <div>Welcome! Manager {currentUser.admin_name} </div>
            <div>Today is {currentTime}</div>
            <>Product info:</>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                        <th style={{ padding: '5px' }}>Category Name</th>
                        <th style={{ padding: '5px' }}>Number of Products</th>
                        <th style={{ padding: '5px' }}>Combined Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cats && cats.map((cat, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '5px' }}>{cat.category_name}</td>
                            <td style={{ padding: '5px' }}>{cat.number_of_products}</td>
                            <td style={{ padding: '5px' }}>{cat.combined_price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {managed && (
                <>
                    <>Managed info</>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ padding: '5px' }}>Managed ID</th>
                                <th style={{ padding: '5px' }}>Create Time</th>
                                <th style={{ padding: '5px' }}>End Time</th>
                                {type === 'admin' && (<><th style={{ padding: '5px' }}>Number of Users</th></>)}

                            </tr>
                        </thead>
                        <tbody>
                            {managed && managed.map((manage, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    {type === 'manager' && (<><td style={{ padding: '5px' }}>{manage.user_id}</td></>)}
                                    {type === 'admin' && (<><td style={{ padding: '5px' }}>{manage.manager_id}</td></>)}
                                    <td style={{ padding: '5px' }}>{manage.create_time}</td>
                                    <td style={{ padding: '5px' }}>{manage.end_time}</td>
                                    {type === 'admin' && (<><td style={{ padding: '5px' }}>{manage.num_of_users}</td></>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>)}
            {currentUser.admin_id > '1000' && sells && (
                <>
                    <>Manager sells:</>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                <th style={{ padding: '5px' }}>Manager</th>
                                <th style={{ padding: '5px' }}>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sells && sells.map((sell, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '5px' }}>{sell.manager_id}</td>
                                    <td style={{ padding: '5px' }}>{sell.total_sales}</td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {
                bidders && (
                    <>
                        <div>Active bidders:</div> {/* Note: Use <div> or another HTML element instead of <> for text nodes */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
                                    <th style={{ padding: '5px' }}>User</th>
                                    <th style={{ padding: '5px' }}>Bids Made</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bidders.map((bider, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                        <td style={{ padding: '5px' }}>{bider.user_id}</td>
                                        <td style={{ padding: '5px' }}>{bider.bid_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )
            }
            <div>Messages from user: </div>
            <Message user_id = {currentUser.admin_id} type = 'toUser' order_id = 'temp'/>
        </>
    );
};

export default AdminHome