import { useMutation } from '@tanstack/react-query';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/Context';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import './login.css';

const SignIn = () => {
  const [logUsername, setLogUsername] = useState('');
  const [logPassword, setLogPassword] = useState('');
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();



  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (formData: { logUsername: string; logPassword: string }) => {
      const res = await axios.post('https://staffpolicy-nodeserver.onrender.com/login', formData);
      return res.data;
    },
    onSuccess: async (data) => {
      localStorage.setItem('token', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');

      // ⏳ Preload documents immediately
      await queryClient.invalidateQueries({ queryKey: ['docs'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ logUsername, logPassword });

  };

  return (
    <div className='bg-blue-900 mt-10 m-6 text-white pb-7'>
      <h1 className='login-text mb-3'>Login</h1>
      {loginMutation.isError && (
        <p className='text-red-400 text-center ml-20'>Your details are incorrect!</p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          className='text-black'
          type='text'
          value={logUsername}
          placeholder='Type your username'
          onChange={(e) => setLogUsername(e.target.value)}
        />
        <input
          className='text-black'
          type='password'
          value={logPassword}
          placeholder='Type your password'
          onChange={(e) => setLogPassword(e.target.value)}
        />
        <button
          type='submit'
          className='relative bottom-0 left-80 bg-blue-600 text-white p-2 rounded'
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;