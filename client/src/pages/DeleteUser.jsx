import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "react-quill/dist/quill.snow.css"; // this is text editor

const DeleteUser = () => {
  // if not login, login first
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (!currentUser) {
      navigate("/admin/login", { replace: true });
    }
  }, [currentUser, navigate]);

  const [inputs, setInputs] = useState({
    userid: "",
  });
  const [returnMessage, setReturnMedssage] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    try {
      await axios.delete(`http://localhost:8800/api/admin/user`, {
        data: inputs,
      });
      setReturnMedssage("Successfully deleted!");
    } catch (err) {
      console.log(err);
      setReturnMedssage(err.message || "An error occurred");
    }
  };

  return (
    <div>
      <div className="content">
        <h4>Input the user id to delete:</h4>
        <input
          type="text"
          name="userid"
          placeholder="user id"
          onChange={handleChange}
        />
      </div>
      <div className="menu">
        <div className="item">
          <div className="buttons">
            <button onClick={handleClick}>Delete User</button>
          </div>
        </div>
      </div>
      <p>{returnMessage}</p>
    </div>
  );
};

export default DeleteUser;
