import React from 'react';
import Axios from 'axios';
import { Pane, TextInputField, Button } from 'evergreen-ui';
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
			<Pane className='register-pane' elevation={1}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<h2>Register for Coaching App</h2>
					<TextInputField
						required
						name='first_name'
						label='First Name'
						inputHeight={30}
						inputWidth={250}
						innerRef={register({
							// required: true,
							maxLength: { value: 80, message: 'Exceeded max input length.' }
						})}
					/>
					{errors.first_name && <p className='form-error'>{errors.first_name.message}</p>}

					<TextInputField
						required
						name='last_name'
						label='Last Name'
						inputHeight={30}
						inputWidth={250}
						innerRef={register({
							// required: true,
							maxLength: { value: 100, message: 'Exceeded max input length.' }
						})}
					/>
					{errors.last_name && <p className='form-error'>{errors.last_name.message}</p>}

					<TextInputField
						required
						name='email'
						label='Email'
						inputHeight={30}
						inputWidth={250}
						innerRef={register({
							// required: true,
							pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email.' }
						})}
					/>
					{errors.email && <p className='form-error'>{errors.email.message}</p>}

					<TextInputField
						required
						type='password'
						name='password'
						label='Password'
						inputHeight={30}
						inputWidth={250}
						innerRef={register({
							// required: true,
							minLength: { value: 8, message: 'Password should be at least 8 characters.' },
							maxLength: { value: 30, message: 'Exceeded max input length.' }
						})}
					/>
					{errors.password && <p className='form-error'>{errors.password.message}</p>}

					<TextInputField
						required
						type='password'
						name='password_confirmation'
						label='Confirm Password'
						inputHeight={30}
						inputWidth={250}
						innerRef={register({
							// minLength: { value: 8, message: 'Password should be at least 8 characters.' },
							// maxLength: { value: 30, message: 'Exceeded max input length.' },
							validate: (value) => {
								return value === watch('password');
							}
						})}
					/>
					{errors.password_confirmation && <p className='form-error'>{errors.password_confirmation.message}</p>}

					<TextInputField
						required
						type='tel'
						name='phone'
						label='Mobile Number'
						inputHeight={30}
						inputWidth={250}
						innerRef={register({
							// required: true,
							minLength: { value: 6, message: 'Invalid phone number.' },
							maxLength: { value: 12, message: 'Invalid phone number.' }
						})}
					/>
					{errors.phone && <p className='form-error'>{errors.phone.message}</p>}

					<ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey='6LeoraoZAAAAAKXabsQ_0Nme8iqA21UUN3_L83fv' />

					<Button type='submit' appearance='primary'>
						Sign Up
					</Button>
				</form>
			</Pane>
		</div>
	);
}
