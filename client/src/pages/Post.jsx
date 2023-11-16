import axios from 'axios';
import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // this is text editor
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";

const Post = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.title || "");
  const [title, setTitle] = useState(state?.desc || "");
  const [price, setPrice] = useState();
  const [weight, setWeight] = useState();
  const [address_id, setSCode] = useState();
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate()

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8800/api/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      state
        ? await axios.put(`http://localhost:8800/api/products/${state.id}`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            price,
            weight,
            address_id,
          })
        : await axios.post(`http://localhost:8800/api/products/`, {
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
          onChange={(e) => setSCode(e.target.value)}
        />
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
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
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

//   return (
//     <div className='add'>
//       <div className='content'>
//         <input type='text' placeholder='Title' onChange = {e=>setTitle(e.target.value)}/>
//         <input type='text' placeholder='Price' />
//         <input type='text' placeholder='Address:state' />
//         <input type='text' placeholder='Address' />
//         <div className="editorContainer">
//           <ReactQuill className='editor' theme='snow' value={value} onChange={setValue} />  
//         </div>
//       </div>
//       <div className='menu'>
//         <div className='item'>
//           <h1>Publish</h1>
//           <input style = {{display:"none"}}type='file' name='' id='file' onChange={e=>setFile(e.target.files[0])}/>
//           <label className = "file" htmlFor="file">Upload Image</label>
//             <div className='buttons'>
//               <button>Save as a draft</button>
//               <button>Update</button>
//             </div>
//         </div>
//         <div className='item'>
//           <h1>Category</h1>
//           <select value={category} onChange={(e) => setCategory(e.target.value)}>
//             <option value="">Select Category</option>
//             <option value="Electronics">Electronics</option>
//             <option value="Appliances">Appliances</option>
//             <option value="Books">Books</option>
//             <option value="Apparel">Apparel</option>
//             <option value="Food">Food</option>
//             <option value="Furniture">Furniture</option>
//             <option value="Sports Equipment">Sports Equipment</option>
//             <option value="Health & Beauty">Health & Beauty</option>
//             <option value="Toys">Toys</option>
//             <option value="Jewelry">Jewelry</option>

//           </select>

//         </div>
//       </div>
//     </div>
//   )
// }

export default Post;