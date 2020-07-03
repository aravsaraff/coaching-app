import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Popover, Menu, Position } from 'evergreen-ui';
import StoreContext from '../../StoreContext';
import { useObserver } from 'mobx-react';
import { banner } from '../../assets';
import './Header.scss';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;
Axios.defaults.withCredentials = true;

export default function Header() {
	const store = React.useContext(StoreContext);

	const logout = async () => {
		try {
			await Axios.get('/logout');
			localStorage.removeItem('isSignedIn');
			localStorage.removeItem('nameState');
			window.location.href = '/login';
		} catch (err) {
			console.log(err);
		}
	};

	const navRender = () => {
		const isAuth = localStorage.getItem('isSignedIn');
		if (!isAuth) {
			return (
				<div className='nav-btns'>
					<Link to='/courses'>
						<Button appearance='minimal' className='nav-courses-btn'>
							Courses
						</Button>
					</Link>
					<Link to='/login'>
						<Button appearance='minimal' className='nav-login-btn'>
							Login
						</Button>
					</Link>
					<Link to='/register'>
						<Button appearance='minimal' className='nav-register-btn'>
							Register
						</Button>
					</Link>
				</div>
			);
		} else {
			return (
				<div className='nav-btns'>
					<Link to='/courses'>
						<Button appearance='minimal' className='nav-courses-btn'>
							Courses
						</Button>
					</Link>
					<Popover
						position={Position.BOTTOM_LEFT}
						content={
							<Menu>
								<Menu.Group>
									<Menu.Item onSelect={logout}>Logout</Menu.Item>
								</Menu.Group>
							</Menu>
						}
					>
						<Avatar name={store.name} size={35} marginRight={7} />
					</Popover>

					<p className='username'>{store.name}</p>
				</div>
			);
		}
	};

	return useObserver(() => (
		<div className='nav-container'>
			<img src={banner} className='nav-logo' alt='banner' />
			{navRender()}
		</div>
	));
}
