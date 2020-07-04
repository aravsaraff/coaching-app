import React from 'react';
import { useForm } from 'react-hook-form';
import { TextInputField, FilePicker, TextareaField, Button } from 'evergreen-ui';
import './styles.scss';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default function BuyCourse() {
	const { register, handleSubmit } = useForm();

	const onSubmit = async (data) => {
		try {
			console.log(data);
			const resp = await Axios.post('/buycourse', data);
			if (resp.status === 200) {
				console.log('Successfully bought course');
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='buy-container'>
			<form className='buy-course' onSubmit={handleSubmit(onSubmit)}>
				<TextInputField required label='Course ID' name='course_id' placeholder='Course ID' innerRef={register()} />
				<Button marginTop={10} appearance='default' type='submit'>
					Submit
				</Button>
			</form>
		</div>
	);
}