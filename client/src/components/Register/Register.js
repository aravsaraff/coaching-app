import React from 'react';
import Axios from 'axios';
import { useForm } from 'react-hook-form';
import './Register.scss';

//Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default function Register() {
	const { register, handleSubmit, errors, watch } = useForm();
	const onSubmit = async (data) => {
		console.log(data);
		await Axios.post('/register', data);
	};
	console.log(errors);

	return (
		<div className='register-container'>
			<form className='register-form' onSubmit={handleSubmit(onSubmit)}>
				<input
					type='text'
					placeholder='First name'
					name='first_name'
					ref={register({ required: true, maxLength: 80 })}
				/>
				<input
					type='text'
					placeholder='Last name'
					name='last_name'
					ref={register({ required: true, maxLength: 100 })}
				/>
				<input type='text' placeholder='Email' name='email' ref={register({ required: true, pattern: /^\S+@\S+$/i })} />
				<input type='text' placeholder='Password' name='password' ref={register({ required: true, minLength: 8 })} />
				<input
					type='text'
					placeholder='Confirm Password'
					name='password_confirmation'
					ref={register({
						required: true,
						minLength: 8,
						validate: (value) => {
							return value === watch('password');
						}
					})}
				/>
				<input
					type='tel'
					placeholder='Mobile number'
					name='phone'
					ref={register({ required: true, minLength: 6, maxLength: 12 })}
				/>

				<input className='submit-btn' type='submit' />
			</form>
		</div>
	);
}
