import React from 'react';
import ReactPlayer from 'react-player';
import { pdfjs, Document, Page } from 'react-pdf';
import { Avatar } from 'evergreen-ui';
import sample from './sample.pdf';
import './Course.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function Course() {
	return (
		<div className='course-container'>
			<div className='playback-container'>
				<div className='course-list'>
					<h2>List goes here</h2>
				</div>
				<div className='course-player'></div>
				<ReactPlayer
					url='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
					controls={true}
					width='100%'
					height='100%'
					config={{
						file: {
							forceVideo: true
						}
					}}
				/>
			</div>
			<div className='material-container'>
				<div className='header'>
					<h2>Video Header!</h2>
					<Avatar name='Moby Dick' size={35} />
				</div>
				<div className='content'>
					<Document className='pdf' file={sample}>
						<Page pageNumber={1} scale='1' renderAnnotationLayer='false' />
						<Page pageNumber={2} scale='1' renderAnnotationLayer='false' />
					</Document>
				</div>
			</div>
		</div>
	);
}
