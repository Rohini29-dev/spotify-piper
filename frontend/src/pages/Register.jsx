// import "./Register.css";
import { useState } from "react";
import "../styles/Register.css";
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Register = () => {
const Navigate = useNavigate()

// const [form, setform] = useState({
//     email:'',
//     password:'',
//     firstName:'',
//     lastName:'',
//     userType: 'user',
// })

const [firstName, setfirstName] = useState('')
const [lastName, setlastName] = useState('')
const [email, setemail] = useState('')
const [password, setpassword] = useState('')
const [role, setRole] = useState('user')


const submitHandler = async(e)=>{
e.preventDefault()

try {
    
    await axios.post('http://localhost:3000/api/auth/register',{
        email:email,
        fullName:{
            firstName:firstName,
            lastName:lastName
        },
        password:password,
        role:role

    },{
        withCredentials:true
    }

    
)
Navigate('/')
} catch (error) {
    console.error('error during registration:',err);
    
}

}

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>
        <p>Join Spotify Piper today</p>

        <button
        onClick={()=>{
            window.location.href = 'http://localhost:3000/api/auth/google'
        }}
        className="google-btn">
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form
        onSubmit={submitHandler}
        className="register-form">
          <div className="input-group">
            <label>First Name</label>
            <input
            onChange={(e)=>setfirstName(e.target.value)}
              type="text"
              name="firstName"
              value={firstName}
              placeholder="Enter first name"
            />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input
            onChange={(e)=>setlastName(e.target.value)}
            
              type="text"
              name="lastName"
              value={lastName}
              placeholder="Enter last name"
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
            onChange={(e)=>setemail(e.target.value)}
              type="email"
              name="email"
              value={email}
              placeholder="Enter email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
                onChange={(e)=>setpassword(e.target.value)}

              type="password"
              name="password"
              value={password}
              placeholder="Enter password"
            /> 
          </div>

          <div className="input-group">
            <label>User Type</label>

            <div className="radio-group">
              <label className="radio-option">
                <input
                onChange={(e)=>setRole(e.target.value)}
                
                  type="radio"
                  name="role"
                  value="user"
                   checked={role === 'user'}
                  defaultChecked
                />
                User
              </label>

              <label className="radio-option">
                <input
                onChange={(e)=>setRole(e.target.value)
                }
                  type="radio"
                  name="role"
                  value="artist"
                   checked={role === 'artist'}
                />
                Artist
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;






