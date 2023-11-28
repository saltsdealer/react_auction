import React ,{ useState }from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"


const Register = () => {
  const [inputs,setInputs] = useState({
    user_id : "",
    password : "",
    username : "",
    user_name : "",
    email : "",
    address : "",
    state : "",
    age : "",
  });
  const [err,setError] = useState(null);
  const navigate = useNavigate(); // this isn't working , and I don't know why yet

  const handleChange = e =>{
    setInputs(prev =>({...prev,[e.target.name]:e.target.value}))
  };

  const handleSubmit =  async e =>{
    e.preventDefault()
    try{
      await axios.post('http://localhost:8800/api/auth/register',inputs);
      navigate("/Login");
    } catch(err){

      setError(err.response.data);
    }
    
  };

  console.log(inputs);

  return (
    <div className='auth'>
        <h1>Register</h1>
        <form>
            <input required type = "user_id" placeholder='nuid' name ='user_id' onChange={handleChange}/>
            <input required type = "password" placeholder='password' name ='password' onChange={handleChange}/>
            <input required type = "username" placeholder='username' name ='username' onChange={handleChange}/> 
            <input required type = "user_name" placeholder='your name' name ='user_name' onChange={handleChange}/> 
            <input required type = "email" placeholder='email' name ='email' onChange={handleChange}/>
            <input required type = "address" placeholder='address' name ='address' onChange={handleChange}/>
            <input required type = "state" placeholder='state' name ='state' onChange={handleChange}/>
            <input required type = "age" placeholder='age' name ='age' onChange={handleChange}/>
            <button onClick={handleSubmit}>Register</button>
            {err && <p>{err} </p>}
            <span>Have an account already?
                <Link to = "/Login">
                    Login
                </Link>
            </span>
        </form>

    </div>
  );
};

export default Register