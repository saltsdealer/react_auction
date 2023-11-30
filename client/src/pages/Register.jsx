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
  const [isValid, setIsValid] = useState(true);
  const USStateCodes = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

  const validateStateCode = (code) => {
    if (USStateCodes.includes(code.toUpperCase())) {
        console.log("Valid State Code");
        setIsValid(true);
    } else {
        console.log("Invalid State Code");
        setIsValid(false);
        
    }
}
  const [err,setError] = useState(null);
  const navigate = useNavigate(); // this isn't working , and I don't know why yet

  const handleChange = e =>{
    setInputs(prev =>({...prev,[e.target.name]:e.target.value}))
  };

  const handleInputChange = (e) => {
    handleChange(e);
    validateStateCode(e.target.value);
}

  const handleSubmit =  async e =>{
    e.preventDefault()
    try{
      await axios.post('http://34.125.1.254:8800/api/auth/register',inputs);
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
            <input required type = "state" placeholder='state' name ='state' onChange={handleInputChange}/>
            {!isValid && <p>Please enter a valid state code.</p>}
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