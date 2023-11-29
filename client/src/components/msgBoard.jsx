import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/' // Import the Quill stylesheet

import axios from 'axios';

const Message = ({ user_id, type, product_id, username }) => {
  const [value, setValue] = useState('');

  const [messages, setMessages] = useState([]);

  const [userId, setUserId] = useState('');

  const [order_id, setOrderId] = useState('');

  useEffect(() => {
    // Fetch messages from the database
    // This is a placeholder function, replace with your actual data fetching logic
    const fetchMessages = async () => {
      try {
        if (user_id === '' && type === '' && product_id === '') {
          return;
        }
        if (type === 'toUser') {
          const res = await axios.post(`/admin/adminmsg`, { admin_id: user_id })
          console.log(res);
          setMessages(res.data)
          return;
        }
        const response = await axios.post(`/admin/messages`, { type: type, product_id: product_id }); // Replace with your API endpoint
        const data = response.data;
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the message is empty
    if (value.trim() === '') {
      alert('Please enter a message before submitting.');
      return; // Stop the function if the message is empty
    }

    try {
      // Send a POST request to the server
      if (type === 'user') {
        const response = await axios.post(`/admin/postmsg`, {
          type: type,
          sender_id: user_id,
          msg: value,
          product_id: product_id
        });
      } else if (type === 'admin') {
        const response = await axios.post(`/admin/postmsg`, {
          type: type,
          sender_id: user_id,
          msg: value,
          order_id: product_id
        });
      } else if (type === 'toUser') {
        const response = await axios.post(`/admin/postadmin`, {
          admin_id: user_id,
          sender_id: userId,
          order_id: order_id,
          msg: processText(value)

        })
      }
      // Clear the editor after successful submission
      setValue('');

      // Optionally, provide feedback to the user
      alert('Message sent successfully!');
      window.location.reload();
      // Or you can update the state/UI based on the successful submission
    } catch (error) {
      // Handle errors (e.g., network issues, server errors)
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  function processText(text) {
    return text.replace(/<\/?[^>]+(>|$)/g, "");
  }

  return (
    <div>
      {/* Conditional Message Display */}
      {
        type === 'user' && (
          <div style={{ marginBottom: '10px' }}>
            <p style={{ color: 'blue' }}>Chat Board, do be polite ok?</p>
            {messages && messages.length === 0 && (
              <p style={{ color: 'blue' }}>
                You don't have any messages at the moment, post a message?
              </p>
            )}
          </div>
        )
      }

      {/* Messages Table */}
      {messages && messages.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd', backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                {type === 'toUser' && (
                  <>
                    <td style={{ padding: '8px', textAlign: 'left', color: 'blue' }}>
                      {!msg.message.includes('Regarding') && `${msg.sender_id} : `}
                      {processText(msg.message)} <br />
                      FOR ORDER : {msg.order_id}
                    </td>
                  </>
                )}
                {type === 'admin' &&  (
                  <td style={{ padding: '8px', textAlign: 'left', color: 'blue' }}>
                    {msg.message.startsWith('Regarding') ? 'Manager : ' : `${msg.sender_id} : `}
                    {processText(msg.message)}
                  </td>
                )}
                {type === 'user' &&  (
                  <td style={{ padding: '8px', textAlign: 'left', color: 'blue' }}>
                    {`${msg.username}: `}
                    {processText(msg.message)}
                  </td>
                )}

                {/* Add other columns if needed */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Message Input Form */}
      {type === 'toUser' && messages && (
        <>
          <p style={{ color: 'blue', marginBottom: '5px' }}>Add your comments!</p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Enter replying user id"
                style={{ flex: 1, marginRight: '5px', padding: '5px' }}
                // Assuming you have a state variable and setter for userId
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter order number"
                style={{ flex: 1, padding: '5px' }}
                // Assuming you have a state variable and setter for orderId
                value={order_id}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
            />
            <button type="submit" style={{ marginTop: '10px', backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              Submit
            </button>
          </form>
        </>
      )}
      {type !== 'toUser' && (
        <>
          <p style={{ color: 'blue', marginBottom: '5px' }}>Add your comments!</p>
          <form onSubmit={handleSubmit}>
            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
            />
            <button type="submit" style={{ marginTop: '10px', backgroundColor: 'blue', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              Submit
            </button>
          </form>
        </>
      )}

    </div>
  );
};

export default Message;
