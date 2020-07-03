import React from 'react';
import { useForm } from 'react-hook-form';
import { TextInputField, FilePicker, TextareaField, Button } from 'evergreen-ui';
import './styles.scss';
import Axios from 'axios';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default function AddCourse() {
	const { register, handleSubmit } = useForm();
	const [file, setFile] = React.useState('');

	const onSubmit = async (data) => {
		try {
			data.image = file;
			console.log(data);
			const resp = await Axios.post('/addcourse', data);
			if (resp.status === 200) {
				console.log('Successfully added course');
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='admin-container'>
			<form className='add-course' onSubmit={handleSubmit(onSubmit)}>
				<TextInputField required label='Course Name' name='name' placeholder='Course Name' innerRef={register()} />
				<TextareaField
					required
					label='Course Description'
					name='desc'
					placeholder='Course Description'
					innerRef={register()}
				/>
				<TextInputField
					required
					label='Course Price'
					name='price'
					placeholder='Course Price in Rupees'
					innerRef={register()}
				/>
				<FilePicker required accept='image/*' onChange={(file) => setFile(file[0])} placeholder='Course Image' />

				<Button marginTop={10} appearance='default' type='submit'>
					Submit
				</Button>
			</form>
		</div>
	);
}
