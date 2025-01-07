import Image from 'next/image';
import { Share, Heart } from 'lucide-react';
import FramerCarousell from '@/components/FramerCarousell';
import { convex } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { BookingWithUserData } from '@/lib/types';
import BookingManager from '@/components/BookingManager';

type Props = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		booking_date: string;
	}>;
};

export default async function PitchPage({
	params,
	searchParams,
}: Props) {
	let id: string;
	let booking_date: string | number | null;
	let pitch: Doc<'pitches'> | null;
	let pitchImages: string[];

	try {
		const paramsResult = await params;
		const searchParamsResult = await searchParams;

		id = paramsResult.id;
		booking_date = searchParamsResult.booking_date || null;

		console.log(`query>>>>> ${booking_date}`);

		if (booking_date)
			booking_date = new Date(parseInt(booking_date)).getTime();
		else booking_date = new Date().getTime();

		pitch = await convex.query(api.pitches.getPitchById, {
			id: id as Id<'pitches'>,
		});
		if (!pitch) {
			// return a UI to indicate to the user that the pitch does not exist.
			return;
		}
		pitchImages = await convex.query(api.files.getFiles, {
			storageIds: pitch.images,
		});
		console.log('pitch images>>>', pitchImages);
	} catch (error) {
		console.error('Error fetching data:', error);
		// Handle the error appropriately here

		return <h1>a</h1>;
	}
	const bookings: BookingWithUserData[] = await convex.query(
		api.bookings.getBookingsForPitchByDate,
		{
			booking_start: booking_date,
			pitch_id: id,
		}
	);

	console.log(
		'Play/[id]/page Bookings>>>',
		JSON.stringify(bookings, null, 2)
	);

	return (
		<main className='relative w-full h-full mb-8 layoutXPadding overflow-hidden'>
			{/* SVG Shapes */}
			{/* <div className='absolute inset-0 pointer-events-none z-0'>
				<svg
					className='absolute top-0 left-0 w-1/3 h-auto text-primary/10'
					viewBox='0 0 200 200'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						fill='currentColor'
						d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.4,-0.3C88.8,15.7,85.1,31.3,76.9,44.3C68.7,57.3,56.1,67.6,42.2,74.3C28.3,81,14.1,84.1,-0.7,85.3C-15.5,86.5,-31.1,85.8,-44.1,79.1C-57.1,72.4,-67.6,59.7,-74.9,45.4C-82.2,31,-86.3,15.5,-87.6,-0.7C-88.9,-17,-87.4,-34,-79.1,-46.6C-70.8,-59.2,-55.7,-67.4,-41.1,-74.6C-26.5,-81.8,-13.2,-88,1.8,-91C16.8,-94,33.6,-93.8,44.7,-76.4Z'
						transform='translate(100 100)'
					/>
				</svg>
				<svg
					className='absolute bottom-0 right-0 w-1/2 h-auto text-secondary/10'
					viewBox='0 0 200 200'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						fill='currentColor'
						d='M39.9,-65.7C54.1,-60.5,69.3,-53.3,77.7,-41.3C86.2,-29.3,87.9,-12.7,85.6,2.9C83.4,18.5,77.2,33,67.1,44C57,55,43,62.4,28.7,68.7C14.4,75,-0.3,80.2,-14.9,78.9C-29.5,77.5,-44,69.6,-56.4,59C-68.8,48.4,-79.1,35.1,-83.7,19.9C-88.3,4.7,-87.2,-12.4,-80.8,-26.8C-74.4,-41.1,-62.8,-52.7,-49.5,-58.5C-36.2,-64.3,-21.3,-64.3,-6.8,-64.1C7.7,-63.9,25.7,-70.9,39.9,-65.7Z'
						transform='translate(100 100)'
					/>
				</svg>
			</div> */}
			{/* Header */}
			<div className=' bg- flex justify-between items-center py-6'>
				<h1 className='text-2xl font-medium'>{pitch.name}</h1>
				<div className='flex gap-4'>
					<button className='flex items-center gap-2 hover:underline'>
						<Share className='h-4 w-4' />
						Share
					</button>
					<button className='flex items-center gap-2 hover:underline'>
						<Heart className='h-4 w-4' />
						Save
					</button>
				</div>
			</div>

			{/* Image Grid on large screen only */}
			<div className='hidden sm:grid grid-cols-4 gap-2 rounded-xl overflow-hidden aspect-[20/9]'>
				<div className='col-span-2 row-span-2 relative'>
					<Image
						src={pitchImages[0] || ''}
						alt={pitch.name}
						fill
						className='object-cover'
						priority
					/>
				</div>
				{pitchImages.slice(1).map((image, i) => (
					<div
						key={i}
						className='relative'>
						<Image
							src={image}
							alt={`${pitch.name} view ${i + 2}`}
							fill
							className='object-cover'
						/>
					</div>
				))}
			</div>

			{/* image carousell on small screens only */}
			<div className='flex sm:hidden items-center justify-center w-full h-fit'>
				<FramerCarousell images={pitchImages} />
			</div>

			<BookingManager
				selectedTimeStamp={booking_date}
				bookings={bookings}
				pitch={pitch}
			/>
		</main>
	);
}

const student = {
	name: 'hahdsf',
	id: 123,
	year: 12312,
};
