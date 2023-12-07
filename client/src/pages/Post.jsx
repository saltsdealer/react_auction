import axios from 'axios';
import React, { useContext, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // this is text editor
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import { AuthContext } from '../context/authContext';

const Post = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.title || "");
  const [title, setTitle] = useState(state?.desc || "");
  const [price, setPrice] = useState();
  const [weight, setWeight] = useState();
  const [address_id, setSCode] = useState();
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const { currentUser } = useContext(AuthContext);
  const [isValid, setIsValid] = useState(true);
  
;

  const USStateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
                      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
                      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
                      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
                      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  const navigate = useNavigate()

  const validateStateCode = (code) => {
    if (USStateCodes.includes(code.toUpperCase())) {
        console.log("Valid State Code");
        setIsValid(true);
    } else {
        console.log("Invalid State Code");
        setIsValid(false);
        setSCode(''); // Reset the input field
    }
}
  const allFieldsFilled = value && title && price && weight && address_id && file && cat;
  if (!currentUser) return <div>login to post items</div>;

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://34.125.1.254:8800/api/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();
    let product_id
    if (state) {
      product_id = state.product_id
    }
    try {
      state
        ? await axios.put(`http://34.125.1.254:8800/api/products/${product_id}`, {
          title,
          desc: value,
          cat,
          picture: file ? imgUrl : "",
          price,
          weight,
          address_id,
        })
        : await axios.post(`http://34.125.1.254:8800/api/products/`, {
          title,
          desc: value,
          cat,
          picture: file ? imgUrl : "",
          create_time: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          price,
          weight,
          address_id,
        });
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  };
  const handleInputChange = (e) => {
    setSCode(e.target.value);
    validateStateCode(e.target.value);
  }

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="number" step="0.01"
          placeholder="Price"
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Weight"
          onChange={(e) => setWeight(e.target.value)}
        />
        <input
          type="text"
          placeholder="State code"
          onChange={handleInputChange}
        />
          {!isValid && <p>Please enter a valid state code.</p>}

        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">

            {allFieldsFilled && (
              <button onClick={handleClick}>Publish</button>
            )}
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "apl"}
              name="cat"
              value="apl"
              id="apl"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="apl">Appliances</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "app"}
              name="cat"
              value="app"
              id="app"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="app">Apparel</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "bks"}
              name="cat"
              value="bks"
              id="bks"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="bks">Books</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "elc"}
              name="cat"
              value="elc"
              id="elc"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="elc">Electronics</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "fod"}
              name="cat"
              value="fod"
              id="fod"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="fod">Food</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "frn"}
              name="cat"
              value="frn"
              id="frn"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="frn">Furniture</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "hlh"}
              name="cat"
              value="hlh"
              id="hlh"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="hlh">Health & Beauty</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "jwl"}
              name="cat"
              value="jwl"
              id="jwl"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="jwl">Jewelry</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "spt"}
              name="cat"
              value="spt"
              id="spt"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="spt">Sports</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "toy"}
              name="cat"
              value="toy"
              id="toy"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="toy">Toys</label>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Post;