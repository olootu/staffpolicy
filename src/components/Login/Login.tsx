
import axios from 'axios';
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/Context';

const Login = () => {
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
        axios.post('http://localhost:8080/login', formData).
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
        <div className='bg-black text-white pb-7 align-middle'>
            <h1>Login</h1>
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
                <button type='submit' className='join-send bg-green-800 text-white p-4 rounded'>
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login