import React from 'react';
import { Link } from 'react-router-dom';
import { banner } from '../../assets';
import './Header.scss';

export default function Header() {
	return (
		<div className='nav-container'>
			<img src={banner} className='nav-logo' alt='banner' />
			<div className='nav-btns'>
				<Link to='/login'>
					<button className='nav-login-btn'>Login</button>
				</Link>
				<Link to='/register'>
					<button className='nav-register-btn'>Register</button>
				</Link>
			</div>
		</div>
	);
}
