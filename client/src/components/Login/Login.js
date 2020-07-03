import React from 'react';
import Axios from 'axios';
import { useForm } from 'react-hook-form';
import { Pane, TextInputField, Button, Text, Link } from 'evergreen-ui';
import './Login.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default function Login() {
	const { register, handleSubmit, errors } = useForm();
	const onSubmit = async (data) => {
		try {
			console.log(data);
			let resp = await Axios.post('/login', data);
			if (resp.status === 200) {
				localStorage.setItem('isSignedIn', true);
				window.location.href = '/';
			}
		} catch (err) {
			console.log(err);
		}
	};
	console.log(errors);

	return (
		<div className='login-container'>
			<Pane className='login-pane' elevation={1}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<h2>Login to Coaching App</h2>
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
						})}
					/>
					{errors.password && <p className='form-error'>{errors.password.message}</p>}
					<Button type='submit' appearance='primary'>
						Login
					</Button>
					<Text marginTop={24} marginBottom={8} display='block' textAlign='center'>
						Forgot your password? <Link color='blue'>Reset your password</Link>
					</Text>
				</form>
			</Pane>
		</div>
	);
}
