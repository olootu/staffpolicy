import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../../Context/Context';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(userContext);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="navbar pt-4 h-16 flex gap-10 bg-black text-white justify-center">
      <div>
          <img className='h-10 w-auto rounded' src={'Bluebirds-childcare-logo-small-1.png'} alt='' />
        </div>
      {isAuthenticated ? (
        <>
        
          <Link to="/">Home</Link>
          <button className="mb-10" onClick={logOut}>Logout</button>
          {isAdmin && <Link to="/admin">Admin</Link>}
          <div>{user?.name} ({user?.role})</div>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default NavBar


// import { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userContext } from '../../Context/Context';

// const NavBar = () => {
//     const navigate = useNavigate();
//     const { user, setUser} = useContext(userContext);
//     // const profile = useContext(userContext);
//     // const isAuthenticated = !!localStorage.getItem("token");
//     const isAuthenticated = !!user;
//     const isAdmin = user?.role === 'admin'

//     const logOut = () => {
//       localStorage.removeItem("token");
//      setUser(null);
//       navigate('/login');
//     }
//   return (
//     <div className="navbar pt-4 h-16 flex gap-10 bg-black text-white justify-center">
//     { isAuthenticated ?
    
//     <>
//     <Link to='/'>Home</Link>
//     <button className='mb-10' onClick={logOut}>Logout</button>
//    {isAdmin &&
//     <Link to='/admin'>Admin</Link> 
//    }
//     <div>
//       {user?.name}({user?.role})
//     </div>
//     </>
    
    
//     :  <Link to='/login'>Login</Link> } 

   
//     </div>
//   )
// }

// export default NavBar





