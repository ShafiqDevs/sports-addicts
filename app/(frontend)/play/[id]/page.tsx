import Image from 'next/image';
import { Share, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DateTimePicker from '@/components/DateTimePicker';
import FramerCarousell from '@/components/FramerCarousell';
import { BookingList } from '@/components/BookingList';
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

	// const pitch = {
	// 	name: 'Champions Arena',
	// 	capacity: 22,
	// 	address: 'Football City, FC1 2BA',
	// 	images: [
	// 		'https://placehold.co/600x400.png',
	// 		'https://placehold.co/600x400.png',
	// 		'https://placehold.co/600x400.png',
	// 		'https://placehold.co/600x400.png',
	// 		'https://placehold.co/600x400.png',
	// 	],

	// 	host: {
	// 		name: 'John Smith',
	// 		image: '/placeholder.svg?height=50&width=50',
	// 	},
	// 	description:
	// 		'Clean, modern football pitch with easy access to city center, great changing rooms, and public transportation. Perfect for matches and training sessions.',
	// };

	return (
		<main className='w-full h-screen layoutXPadding'>
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
			{/* //TODO: booking component here */}
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
