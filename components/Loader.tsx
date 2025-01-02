import React from 'react';

type Props = {};

export default function Loader({}: Props) {
	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-e-blue-500'></div>
		</div>
	);
}
