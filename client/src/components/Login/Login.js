import React from 'react';
import Axios from 'axios';
import { useForm } from 'react-hook-form';
import StoreContext from '../../StoreContext';
import './Login.scss';

//Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default function Login() {
	const { register, handleSubmit, errors } = useForm();
	const onSubmit = async (data) => {
		try {
			console.log(data);
			let resp = await Axios.post('/login', data);
			if (resp.status === 200) {
				window.location.href = '/';
			}
		} catch (err) {
			console.log(err);
		}
	};
	console.log(errors);

	return (
		<div className='login-container'>
			<form className='login-form' onSubmit={handleSubmit(onSubmit)}>
				<input type='text' placeholder='Email' name='email' ref={register({ required: true, pattern: /^\S+@\S+$/i })} />
				<input type='text' placeholder='Password' name='password' ref={register({ required: true })} />

				<input className='submit-btn' type='submit' />
			</form>
		</div>
	);
}
