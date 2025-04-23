
import axios from 'axios';
import { useState } from 'react'

const Login = () => {
    const [logUsername, setLogUsername] = useState('');
    const [logPassword, setLogPassword] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // const response = await fetch('http://localhost:9000/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ logUsername, logPassword })
        // });

        // return await response.json();

        // const res = await fetch('http://localhost:8080/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ logUsername, logPassword })
        // });
    
        // const data = await res.json();
    
        // if (res.ok) {
        //     localStorage.setItem('token', data.token);
        //     // redirect or set auth context
        // } else {
        //     alert(data.message);
        // }

        const formData = {
           logPassword,
           logUsername
          }
          // const navigate = useNavigate();
          axios.post('http://localhost:8080/login', formData).
            then((res) => {
              //this console.log will be in our frontend console
            localStorage.setItem('token', JSON.stringify(res.data));
              console.log(res.data);
            })
            .catch((err) => console.log(err));
          // apiCall(formData);
          // setName('');
          // setEmail('');
          // setUsername('');
          // setPassword('');
      
    }
    // if (isLoading) {
    //     return <div>Loading...</div>
    // }
    // console.log(data)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                className='text-black'
                    name='log_username'
                    id='log_username'
                    type='text'
                    value={logUsername}
                    placeholder='Type your username'
                    onChange={(e) => setLogUsername(e.target.value)}
                />

                <label htmlFor='log_password'>Password: *</label>
                {/* {showError && <span className='formError'>{errorMsg}</span>} */}
                <input
                className='text-black'
                    name='log_password'
                    placeholder='Type your Password'
                    id='log_paasword'
                    value={logPassword}
                    onChange={(e) => setLogPassword(e.target.value)}
                />
                <button type='submit' className='join-send bg-green-800 text-white p-4 rounded'>
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login