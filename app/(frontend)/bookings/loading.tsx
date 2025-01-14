import Loader from '@/components/Loader';
import React from 'react';

type Props = {};

function loading({}: Props) {
	return (
		<main>
			<Loader />
		</main>
	);
}

export default loading;
