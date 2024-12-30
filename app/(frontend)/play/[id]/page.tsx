import Image from 'next/image';
import { Share, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DateTimePicker from '@/components/DateTimePicker';
import FramerCarousell from '@/components/FramerCarousell';
import { BookingList } from '@/components/BookingList';
import { convex } from '@/lib/utils';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

type Props = {
	params: Promise<{ id: string }>;
	searchParams: Promise<{
		query: string;
	}>;
};

export default async function PitchPage({
	params,
	searchParams,
}: Props) {
	const { id } = await params;
	const { query } = await searchParams;

	console.log(`query>>>>> ${query}`);

	let searchDate = new Date(parseInt(query)).getTime();
	if (!query) {
		searchDate = new Date().getTime();
	}

	const pitch = await convex.query(api.pitches.getPitchById, {
		id: id as Id<'pitches'>,
	});
	if (!pitch) {
		// return a UI to indicate to the user that the pitch does not exist.
		return;
	}
	const bookings = await convex.query(api.bookings.getBookingByDate, {
		booking_start: searchDate,
	});

	console.log(JSON.stringify(bookings, null, 2));

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
		<main className='max-w-[1280px] mx-auto px-6 pb-12'>
			{/* Header */}
			<div className='flex justify-between items-center py-6'>
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
						src={pitch.images[0]}
						alt={pitch.name}
						fill
						className='object-cover'
						priority
					/>
				</div>
				{pitch.images.slice(1).map((image, i) => (
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
				<FramerCarousell
					images={[
						'https://placehold.co/600x400.png',
						'https://placehold.co/600x400.png',
						'https://placehold.co/600x400.png',
					]}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-12 mt-8'>
				<div className='col-span-1'>
					{/* Basic Info */}
					<div className='flex justify-between pb-6 border-b '>
						<div>
							<h2 className='text-xl font-medium'>{`${pitch.capacity / 2}-a-side pitch`}</h2>
							<p className='text-muted-foreground'>{pitch.address}</p>
						</div>
						{/* <div className='flex items-center gap-2'>
							<Image
								src={pitch.host.image}
								alt={pitch.host.name}
								width={50}
								height={50}
								className='rounded-full'
							/>
							<div>
								<p className='font-medium'>
									Hosted by {pitch.host.name}
								</p>
								<p className='text-sm text-muted-foreground'>
									Superhost
								</p>
							</div>
						</div> */}
					</div>

					{/* Description */}
					<div className='py-6 border-b'>
						<p className='text-muted-foreground leading-relaxed'>
							{pitch.description}
						</p>
					</div>
					<div>
						<BookingList
							//TODO: fix the bookingList component
							bookings={[
								{
									booking_start: bookings![0].booking_start,
									booking_end: bookings![0].booking_end,
									status: bookings![0].status,
									hostingUser_id: 'j977gssn3f9ykqwmxj4eprh9w977bkfg',
									pitch_id: 'jd72tqd83h1pnwrw9banxz8kpd77dvte',
									id: 'j977gssn3f9ykqwmxj4eprh9w977bkfg',
									pitch: {
										name: 'Champions Arena',
									},
									user: { name: 'Shafiq' },
								},
							]}
						/>
					</div>
				</div>

				{/* Booking Card */}
				<div className='col-span-1 h-fit rounded-xl border bg-card p-6'>
					<div className='flex items-baseline gap-1 mb-6'>
						<span className='text-2xl font-semibold'>£60</span>
						<span className='text-muted-foreground'>/hour</span>
					</div>

					<DateTimePicker />

					<div className='space-y-4 mt-6 pt-6 border-t'>
						<div className='flex justify-between'>
							<span>£60 x 2 hours</span>
							<span>£120</span>
						</div>
						<div className='flex justify-between'>
							<span>Service fee</span>
							<span>£15</span>
						</div>
						<div className='flex justify-between pt-4 border-t font-semibold'>
							<span>Total</span>
							<span>£135</span>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
