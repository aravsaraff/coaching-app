import React, { Component } from 'react';
import { SearchInput, Switch, Spinner, Text } from 'evergreen-ui';
import Axios from 'axios';
import './Courses.scss';

// Axios config
Axios.defaults.baseURL = process.env.REACT_APP_SERVER;

export default class Courses extends Component {
	constructor(props) {
		super(props);

		this.state = {
			query: '',
			courses: [],
			loading: false,
			message: ''
		};
		this.cancel = '';
		this.fetchCourses('');
	}

	handleOnInputChange = (event) => {
		try {
			const query = event.target.value;
			// console.log(query);
			this.setState({ query, loading: true, message: '' });
			this.fetchCourses(query);
		} catch (err) {
			console.log(err);
		}
	};

	fetchCourses = async (query) => {
		try {
			if (this.cancel) {
				this.cancel.cancel();
			}

			this.cancel = Axios.CancelToken.source();

			let courseList = await Axios.get('/getCourses', {
				params: {
					search: query
				},
				cancelToken: this.cancel.token
			});
			courseList = courseList.data;
			const resultMsg = courseList.length === 0 ? 'No results found.' : '';
			console.log(courseList);
			this.setState({
				courses: courseList,
				loading: false,
				message: resultMsg
			});
		} catch (err) {
			console.log(err);
			this.setState({
				loading: false,
				message: 'Failed to fetch results. Please check your network.'
			});
		}
	};

	toBase64 = (arr) => {
		// arr = new Uint8Array(arr); //if it's an ArrayBuffer
		return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
	};

	renderCourses = () => {
		const domain = process.env.REACT_APP_DOMAIN;

		const { courses, loading } = this.state;
		if (loading === true) {
			// Add loader logic here
			return <Spinner />;
		} else {
			return (
				<div className='results-container'>
					{courses.map((course) => {
						let imgUrl = `data:image/jpeg;base64,${this.toBase64(course.image.data)}`;
						console.log(imgUrl);
						return (
							<a key={course.id} href={`${domain}/course?id=${course.id}`} className='result-items'>
								<h6 className='course-name'>{course.name}</h6>
								<div className='image-wrapper'>
									<img className='image' src={imgUrl} alt='Course' />
								</div>
							</a>
						);
					})}
				</div>
			);
		}
	};

	render() {
		return (
			<div className='courses-container'>
				<div className='header'>
					<SearchInput
						placeholder='Search courses...'
						marginRight={10}
						marginBottom={10}
						height={40}
						onChange={this.handleOnInputChange}
					/>
					<div className='bought'>
						<Text>Show only bought courses?</Text>
						<Switch marginLeft={10} height={20} />
					</div>
				</div>
				{this.renderCourses()}
			</div>
		);
	}
}
