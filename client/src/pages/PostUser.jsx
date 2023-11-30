import axios from 'axios';
import React, { useContext, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // this is text editor
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import { AuthContext } from '../context/authContext.js'

const PostUser = () => {
    const state = useLocation().state;
    const [nname, setNname] = useState(state?.nickname || "");
    const [uname, setUname] = useState(state?.user_name || "");
    const [add, setSCode] = useState(state?.add_id || "");
    const [address, setAdd] = useState(state?.address_detail || "");
    const [pw, setPW] = useState();
    const [email, setEmail] = useState(state?.email || "");
    const { currentUser, logout } = useContext(AuthContext);

    const navigate = useNavigate()

    const combinedFunction = () => {
        handleClick();
        logout();
        navigate("/");
    };


    const handleClick = async (e) => {

        try {
            await axios.put(`http://34.125.1.254:8800/api/users/${state.user_id}`, {
                nname,
                uname,
                add,
                address,
                pw,
                email,
                pw
            })

            //navigate("/")
        } catch (err) {
            console.log(err);
        }
    };

    const allFieldsFilled = nname && uname && add && address && pw && email;

    return (
        <div className="add">
            <div className="content">
                <input
                    type="text"
                    placeholder={nname}
                    onChange={(e) => setUname(e.target.value)}

                />
                <input
                    type="text"
                    placeholder="new password"
                    onChange={(e) => setPW(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={uname}
                    onChange={(e) => setNname(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={address}
                    onChange={(e) => setAdd(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={add}
                    onChange={(e) => setSCode(e.target.value)}
                />
                <input
                    type="text"
                    placeholder={email}
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