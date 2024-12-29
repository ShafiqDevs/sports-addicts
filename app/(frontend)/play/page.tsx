import DateTimePicker from '@/components/DateTimePicker';
import { PitchCard } from '@/components/PitchCard';
import { api } from '@/convex/_generated/api';
import { convex } from '@/lib/utils';
import React from 'react';

type Props = {};

export default async function PlayPage({}: Props) {
	const pitches = await convex.query(api.pitches.getAllPitches);
	if (!pitches) {
		// return a UI to indicate to the user that there are no pitches yet.
		return <h1>NO PITCHES WHAT?</h1>;
	}
	return (
		<div className='w-full h-screen '>
			<h1>Welcome to Sports Addicts!</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-4'>
				{pitches.map(
					({
						_id,
						_creationTime,
						address,
						capacity,
						images,
						name,
					}) => (
						<>
							<PitchCard
								_id={_id}
								key={_id}
								name={name}
								images={images}
								address={address}
								capacity={capacity}
							/>
							<PitchCard
								_id={_id}
								key={_id}
								name={name}
								images={images}
								address={address}
								capacity={capacity}
							/>
							<PitchCard
								_id={_id}
								key={_id}
								name={name}
								images={images}
								address={address}
								capacity={capacity}
							/>
							<PitchCard
								_id={_id}
								key={_id}
								name={name}
								images={images}
								address={address}
								capacity={capacity}
							/>
							<PitchCard
								_id={_id}
								key={_id}
								name={name}
								images={images}
								address={address}
								capacity={capacity}
							/>
						</>
					)
				)}
			</div>
		</div>
	);
}
