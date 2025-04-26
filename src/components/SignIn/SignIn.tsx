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
    console.log('Hjjkdldldl')

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


// import { useMutation } from '@tanstack/react-query';
// import axios from 'axios';
// import { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { userContext } from '../../Context/Context';

// const SignIn = () => {
//   const navigate = useNavigate();
//   const { setUser } = useContext(userContext);
//   const [logUsername, setLogUsername] = useState('');
//   const [logPassword, setLogPassword] = useState('');

//   const loginMutation = useMutation({
//     mutationFn: async (formData: { logUsername: string, logPassword: string }) => {
//       const res = await axios.post('https://staffpolicy-nodeserver.onrender.com/login', formData);
//       return res.data;
//     },
//     onSuccess: (data) => {
//       localStorage.setItem('token', JSON.stringify(data));
//       setUser(data);
//       navigate('/dashboard');
//     },
//     onError: (error) => {
//       console.error('Login error:', error);
//     }
//   });

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     loginMutation.mutate({ logUsername, logPassword });
//   };

//   return (
//     <div className='bg-blue-900 mt-10 m-6 text-white pb-7'>
//       <h1 className='login-text text-center mb-3'>Login</h1>
//       {loginMutation.isError && <p className='text-red-400 text-center ml-20'>Your details are incorrect!</p>}
//       <form className='relative' onSubmit={handleSubmit}>
//         <input
//           className='text-black'
//           name='log_username'
//           placeholder='Type your username'
//           value={logUsername}
//           onChange={(e) => setLogUsername(e.target.value)}
//         />
//         <input
//           className='text-black'
//           name='log_password'
//           placeholder='Type your Password'
//           value={logPassword}
//           onChange={(e) => setLogPassword(e.target.value)}
//         />
//         <button type='submit' disabled={loginMutation.isPending} className='relative bottom-0 left-80 bg-blue-600 text-white p-2 rounded'>
//           {loginMutation.isPending ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn

// import axios from 'axios';
// import { useContext, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { userContext } from '../../Context/Context';
// import './login.css';

// const SignIn = () => {
//     const [logUsername, setLogUsername] = useState('');
//     const [logPassword, setLogPassword] = useState('');
//     const [error, setError] = useState(null);
//     const { setUser } = useContext(userContext);
//     const navigate = useNavigate();

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         const formData = {
//             logPassword,
//             logUsername
//         }
//         axios.post('https://staffpolicy-nodeserver.onrender.com/login', formData).
//         //axios.post('localhost:8080/login', formData).
//             then((res) => {
//                 localStorage.setItem('token', JSON.stringify(res.data));
//                 setUser(res.data);// userContext update
//                 console.log('bad data',res.data);
//                 navigate('/dashboard');
//                 setLogUsername('');
//                 setLogPassword('');
//                 setError(null);
//             })
//             .catch((err) => {
//                 console.log('errorrrrr', err)
//                 setError(err)
//             });

//     }

//     return (
//         <div className='bg-blue-900 mt-10  m-6 text-white pb-7'>
//             {/*  mr-64 pl-10 pr-10 bg-blue-700-50 */}
//             <h1 className='login-text mb-3'>Login</h1>
//          {error !==null &&    <p className='text-red-400 text-center ml-20'>Your details are incorrect!</p>}
//             <form className='relative' onSubmit={handleSubmit}>
               
//                 <input
//                     className='text-black'
//                     name='log_username'
//                     id='log_username'
//                     type='text'
//                     value={logUsername}
//                     placeholder='Type your username'
//                     onChange={(e) => setLogUsername(e.target.value)}
//                 />

//                 {/* <label htmlFor='log_password'>Password: *</label> */}
//                 {/* {showError && <span className='formError'>{errorMsg}</span>} */}
//                 <input
//                     className='text-black'
//                     name='log_password'
//                     placeholder='Type your Password'
//                     id='log_paasword'
//                     value={logPassword}
//                     onChange={(e) => setLogPassword(e.target.value)}
//                 />
//                 <button type='submit' className='relative bottom-0 left-80 bg-blue-600 text-white p-2 rounded'>
//                     Login
//                 </button>
//             </form>
//         </div>
//     )
// }

// export default SignIn