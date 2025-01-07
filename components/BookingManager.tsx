'use client';
import React, { useActionState, useEffect, useState } from 'react';
import DateTimePicker from './DateTimePicker';
import { BookingList } from './BookingList';
import { Doc } from '@/convex/_generated/dataModel';
import { BookingWithUserData } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import { createBookingRequest } from '@/actions/bookingRequests';
import { redirect, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { differenceInHours, format } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { STATUS_CODES } from '@/lib/statusCodes';
import Loader from './Loader';

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
	const { user, isLoaded, isSignedIn } = useUser();
	const router = useRouter();
	const { toast } = useToast();
	const [isClient, setIsClient] = useState(false);

	if (!user || !isSignedIn || !isLoaded) redirect(ROUTES.play);

	useEffect(() => {
		setIsClient(true);
	}, []);
	if (!isClient) return <Loader />;

	async function submitBookingRequest(booking: {
		selectedDateTime_start: Date;
		selectedDateTime_end: Date;
	}) {
		if (!user || !user.id || !isSignedIn) return;
		const bookingRequest = await createBookingRequest(
			{
				booking_start: booking.selectedDateTime_start.getTime(),
				booking_end: booking.selectedDateTime_end.getTime(),
				teamA: [],
				teamB: [],
				pitch_id: pitch._id,
				status: 'Available',
				size: `${pitch.capacity / 2}-a-side` as Doc<'bookings'>['size'],
			},
			user.id
		);

		// if there is a conflict ie a bookings overlap with eachother then show toast for that
		// if there is a booking request that is successful then show toast for that
		// if there is an another error then show toast for that

		if (
			!bookingRequest.data &&
			bookingRequest.status === STATUS_CODES.CONFLICT
		) {
			toast({
				duration: 10000,
				variant: 'destructive',
				title: 'Whoops..',
				description: (
					<div className='flex flex-col gap-3 w-full'>
						<span>{bookingRequest.message}</span>
					</div>
				),
			});
		} else if (
			bookingRequest.data &&
			bookingRequest.status === STATUS_CODES.CREATED
		) {
			toast({
				duration: 10000,
				variant: 'default',
				title: 'Your booking is confirmed!',
				style: { width: '100%' },
				description: (
					<div className='flex flex-col gap-3 w-full'>
						<div className='flex flex-col gap-1'>
							<span>You&apos;ve got a game coming up on</span>
							<span className='flex items-center justify-start gap-1 text-muted-foreground'>
								<CalendarIcon className='h-4 w-4' />
								<time
									dateTime={new Date(
										bookingRequest.data.booking_start
									).toLocaleString()}>
									{format(
										bookingRequest.data.booking_start,
										"MMM d, yyyy 'at' h:mm a"
									)}
								</time>
							</span>
							<span className='flex items-center justify-start gap-1 text-muted-foreground'>
								<ClockIcon className='h-4 w-4' />
								<span>
									{differenceInHours(
										bookingRequest.data.booking_end,
										bookingRequest.data.booking_start
									)}{' '}
									Hrs
								</span>
							</span>
						</div>
						<Button
							variant={'secondary'}
							className='p-0 rounded-lg'>
							<Link
								className='w-full h-full flex justify-center items-center'
								href={`${ROUTES.bookings}/${bookingRequest.data._id}`}>
								<span>Open</span>
							</Link>
						</Button>
					</div>
				),
			});
			const url = new URL(window.location.href);
			url.searchParams.set(
				'booking_date',
				new Date(bookingRequest.data.booking_start)
					.getTime()
					.toString()
			);
			router.push(url.toString(), { scroll: false }); // Update URL and rerender on the server
		} else {
			toast({
				duration: 10000,
				variant: 'destructive',
				title: 'Whoops..',
				description: (
					<div className='flex flex-col gap-3 w-full'>
						<span>{bookingRequest.message}</span>
						<Button
							variant={'secondary'}
							className='h-fit w-fit p-2 rounded-lg'
							onClick={() => window.location.reload()}>
							Reload
						</Button>
					</div>
				),
			});
		}
	}

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
					<BookingList bookings={bookings} />
				</div>
			</div>

			{/* Booking Card */}
			<div className='col-span-1 h-fit rounded-xl border bg-card p-6'>
				<div className='flex items-baseline gap-1 mb-6'>
					<span className='text-2xl font-semibold'>£60</span>
					<span className='text-muted-foreground'>/hour</span>
				</div>

				<DateTimePicker
					submitBookingRequest={submitBookingRequest}
					selectedTimeStamp={selectedTimeStamp}
				/>

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
