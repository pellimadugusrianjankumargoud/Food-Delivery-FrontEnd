import React, { useContext, useState } from 'react';
import './Navber.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navber = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");

  // ✅ ONLY use context
  const { getTotalCartAmount, user, logoutUser } = useContext(StoreContext);

  return (
    <div className='navber'>
      <Link to='/'><img src={assets.logo} alt="logo" className='logo' /></Link>

      <ul className="navber-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
        <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
      </ul>

      <div className="navbar-right">
        <img src={assets.search_icon} alt="search" />

        <div className='navbar-search-icon'>
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>

        {/* ✅ SAFE CONDITION */}
        {user  ? (
          <div className="navbar-user">
            <button onClick={logoutUser}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navber;
