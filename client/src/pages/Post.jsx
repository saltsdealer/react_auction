import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // this is text editor
const Post = () => {
  const [value, setValue] = useState('');
  const [category, setCategory] = useState(''); 
  return (
    <div className='add'>
      <div className='content'>
        <input type='text' placeholder='Title' />
        <input type='text' placeholder='Price' />
        <input type='text' placeholder='From:state' />
        <div className="editorContainer">
          <ReactQuill className='editor' theme='snow' value={value} onChange={setValue} />  
        </div>
      </div>
      <div className='menu'>
        <div className='item'>
          <h1>Publish</h1>
          <input style = {{display:"none"}}type='file' name='file' id='file'/>
          <label htmlFor="file">Upload Image</label>
            <div className='buttons'>
              <button>Save as a draft</button>
              <button>Update</button>
            </div>
        </div>
        <div className='item'>
          <h1>Category</h1>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Appliances">Appliances</option>
            <option value="Books">Books</option>
            <option value="Apparel">Apparel</option>
            <option value="Food">Food</option>
            <option value="Furniture">Furniture</option>
            <option value="Sports Equipment">Sports Equipment</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="Toys">Toys</option>
            <option value="Jewelry">Jewelry</option>

          </select>

        </div>
      </div>
    </div>
  )
}

export default Post