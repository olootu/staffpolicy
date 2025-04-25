import axios from 'axios';
import { useContext, useState } from 'react';
import './register.css'
import { useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import { userContext } from '../../Context/Context';


export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');

  const profile = useContext(userContext);

  const isAuthenticated = !!localStorage.getItem('token');

  const isAdmin = isAuthenticated && profile.user?.role === 'admin';
  const navigate = useNavigate();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = {
      name,
      email,
      username,
      password,
      role
    }

    axios.post('http://localhost:8080/add_user', formData).
      then((res) => {
        console.log(res);

        navigate('/');
      })
      .catch((err) => console.log(err));

  };

  return (
    <>
      <div className='mb-10 mt-10'>
        <Login />
      </div>

      <div className='bg-blue-900 text-white'>
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
          <select className='text-black w-44' value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="staff">Staff</option>
            {isAdmin && (
              <option value="admin">Admin</option>
            )}
          </select>
          <br />
          <br />
          <button type='submit' className='join-send bg-green-800 text-white p-4 rounded'>
            Submit
          </button>
        </form>
      </div>
    </>
  )

}

