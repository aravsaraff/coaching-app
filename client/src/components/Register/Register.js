import React from 'react';
import Axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import './Register.scss';

//Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default function Register() {
	const { register, handleSubmit, errors, watch } = useForm();
	const recaptchaRef = React.useRef();

	const onSubmit = async (data) => {
		try {
			console.log(data);
			const token = await recaptchaRef.current.executeAsync();
			data.token = token;
			await Axios.post('/register', data);
		} catch (err) {
			console.log(err);
		}
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
				<input
					type='password'
					placeholder='Password'
					name='password'
					ref={register({ required: true, minLength: 8, maxLength: 30 })}
				/>
				<input
					type='password'
					placeholder='Confirm Password'
					name='password_confirmation'
					ref={register({
						required: true,
						minLength: 8,
						maxLength: 30,
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
				<ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey='6LeoraoZAAAAAKXabsQ_0Nme8iqA21UUN3_L83fv' />

				<input className='submit-btn' type='submit' />
			</form>
		</div>
	);
}
