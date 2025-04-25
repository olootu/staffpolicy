
import axios from 'axios';
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/Context';

const SignIn = () => {
    const [logUsername, setLogUsername] = useState('');
    const [logPassword, setLogPassword] = useState('');
    const { setUser } = useContext(userContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = {
            logPassword,
            logUsername
        }
        axios.post('https://staffpolicy-nodeserver.onrender.com/login', formData).
            then((res) => {
                localStorage.setItem('token', JSON.stringify(res.data));
                setUser(res.data);// userContext update
                console.log(res.data);
                navigate('/dashboard');
            })
            .catch((err) => console.log(err));

        setLogUsername('');
        setLogPassword('');

    }

    return (
        <div className='bg-blue-900 mt-10 m-6 text-white pb-7'>
            {/*  mr-64 pl-10 pr-10 bg-blue-700-50 */}
            <h1 className='relative left-96 mb-3'>Login</h1>
            <form className='relative' onSubmit={handleSubmit}>
               
                <input
                    className='text-black'
                    name='log_username'
                    id='log_username'
                    type='text'
                    value={logUsername}
                    placeholder='Type your username'
                    onChange={(e) => setLogUsername(e.target.value)}
                />

                {/* <label htmlFor='log_password'>Password: *</label> */}
                {/* {showError && <span className='formError'>{errorMsg}</span>} */}
                <input
                    className='text-black'
                    name='log_password'
                    placeholder='Type your Password'
                    id='log_paasword'
                    value={logPassword}
                    onChange={(e) => setLogPassword(e.target.value)}
                />
                <button type='submit' className='relative bottom-0 left-80 bg-blue-600 text-white p-2 rounded'>
                    Login
                </button>
            </form>
        </div>
    )
}

export default SignIn