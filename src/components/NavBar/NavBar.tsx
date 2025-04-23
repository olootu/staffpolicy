import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/Context';

const NavBar = () => {
    // const navigate = useNavigate();
    const data = useContext(userContext);

    console.log('context', data?.user?.user?.name)
  return (
    <div className="navbar pt-4 h-16 flex gap-10 bg-black text-white justify-center">
    <Link to='/'>Home</Link>
   
    <Link to='/login'>Login</Link> 

    <div>
      {data?.user?.user?.name}
    </div>
    {/* <Link to='/login'>Login</Link>  */}
    
    {/* <div className='flex justify-end gap-4'>
        <div><Link to='/create-product'>Create Product</Link></div>
        <div className='flex justify-end gap-4'>
            <img className='h-7' src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
            Welcome: {user?.displayName}
            <button className='pl-4 pr-4' onClick={signUserOut}>Log out</button>
            </div>     
    </div> */}

   
    </div>
  )
}

export default NavBar





