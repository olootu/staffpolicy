import axios from 'axios';
import { useState } from 'react';
import './signin.css'
import { Link, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';


export const SignIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isAuthenticated = !!localStorage.getItem('token');

  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      username,
      password
    }
    const navigate = useNavigate();
    axios.post('http://localhost:8080/add_user', formData).
      then((res) => {
        console.log(res);

        navigate('/');
      })
      .catch((err) => console.log(err));

  };

  return (
    <div className='container bg-blue-900 text-white'>
{
isAuthenticated ? 
<>
<h1>Register</h1>
<form onSubmit={handleSubmit}>
<label htmlFor='name'>Name: </label>
<input
className='text-black'
  name='name'
  id='name'
  type='text'
  placeholder='Type your review'
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<label htmlFor='email'>Email: *</label>
<input
className='text-black'
  name='email'
  placeholder='Type your email'
  id='email'
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<label htmlFor='username'>Username: </label>
<input
className='text-black'
  name='username'
  id='username'
  type='text'
  placeholder='Type your username'
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

<label htmlFor='password'>Password: </label>
<input
className='text-black'
  name='password'
  id='password'
  type='text'
  placeholder='Type your password'
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

<br />
<button type='submit' className='join-send bg-green-800 text-white p-4 rounded'>
  Submit
</button>
</form>
</>
: 
<>
<h1>Log In</h1>
<Login />
</>
} 
    </div>
  )
}

