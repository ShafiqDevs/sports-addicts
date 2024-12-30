'use client';
import React from 'react';
import DateTimePicker from './DateTimePicker';
import { BookingList } from './BookingList';
import { Doc } from '@/convex/_generated/dataModel';
import { BookingWithUserData } from '@/lib/types';

type Props = {
	bookings: BookingWithUserData[];
	pitch: Doc<'pitches'>;
	selectedTimeStamp: number;
};

function BookingManager({
	pitch,
	bookings,
	selectedTimeStamp,
}: Props) {
	console.log(
		`Booking Manager>>> ${JSON.stringify(bookings, null, 2)}`
	);

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-12 mt-8'>
			<div className='col-span-1 space-y-6'>
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
				<div className='w-full'>
					<BookingList
						//TODO: fix the bookingList component
						bookings={bookings}
					/>
				</div>
			</div>

			{/* Booking Card */}
			<div className='col-span-1 h-fit rounded-xl border bg-card p-6'>
				<div className='flex items-baseline gap-1 mb-6'>
					<span className='text-2xl font-semibold'>£60</span>
					<span className='text-muted-foreground'>/hour</span>
				</div>

				<DateTimePicker selectedTimeStamp={selectedTimeStamp} />

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
	);
}

export default BookingManager;
