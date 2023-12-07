import axios from 'axios';
import React, { useContext, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // this is text editor
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import { AuthContext } from '../context/authContext.js'

const PostUser = () => {
    const state = useLocation().state;
    const [nname, setNname] = useState("");
    const [uname, setUname] = useState( "");
    const [add, setSCode] = useState("");
    const [address, setAdd] = useState("");
    const [pw, setPW] = useState();
    const [email, setEmail] = useState("");
    const { currentUser, logout } = useContext(AuthContext);
    const user_id = state.user_id;
    const navigate = useNavigate()

    const combinedFunction = () => {
        handleClick();
        logout();
        navigate("/");
    };


    const handleClick = async (e) => {

        try {
            await axios.put(`http://34.125.1.254:8800/api/users/${user_id}`, {
                nname,
                uname,
                add,
                address,
                pw,
                email
            }, {
                withCredentials: true
            })

            //navigate("/")
        } catch (err) {
            console.log(err);
        }
    };
  

    const allFieldsFilled = nname && uname && add && address && pw && email;
    console.log(nname, uname)
    return (
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    placeholder="new username"
                    onChange={(e) => setNname(e.target.value)}

                />
                <input
                    type="text"
                    placeholder="new password"
                    onChange={(e) => setPW(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="modify your name"
                    onChange={(e) => setUname(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="new address"
                    onChange={(e) => setAdd(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="state code"
                    onChange={(e) => setSCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="new email"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="menu">
                <div className="item">

                    {allFieldsFilled && (
                        <div className="buttons">
                            <button onClick={combinedFunction}>Logout and Upload</button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    
    );
};

export default PostUser;