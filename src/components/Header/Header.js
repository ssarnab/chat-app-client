import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './Header.css'
const Header = () =>  {
  const { user } = useContext(AuthContext)
  return (
    <div className="bg py-3">
      <div
        className='container'
      >
      <div className="content d-flex text-right">
     
       <img className='header-img' src={user.profilePicture} alt="" />
       <div className="username">
       welcome <span className='header-text'>{user.username}</span>
       </div>
      </div>
      </div>
    </div>
  );
}

export default Header;