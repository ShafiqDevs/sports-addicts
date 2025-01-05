'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { format, set } from 'date-fns';
import { cancelBooking } from '@/actions/bookingRequests';
import { STATUS_CODES } from '@/lib/statusCodes';
import { useToast } from '@/hooks/use-toast';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';

interface BookingDetails {
	title: string;
	date: string;
	time: string;
	location: string;
	status: string;
	hostName: string;
}

interface CancelBookingDialogProps {
	booking: BookingDetails;
	booking_id: Id<'bookings'>;
	currUser_id: Id<'users'> | undefined;
}

export function CancelBookingDialog({
	booking,
	booking_id,
	currUser_id,
}: CancelBookingDialogProps) {
	const { toast } = useToast();
	const [
		isBookingCancellationPending,
		setIsBookingCancellationPending,
	] = useState(false);

	async function handleCancelBooking(
		booking_id?: string,
		user_id?: string
	) {
		if (!booking_id || !user_id) return;
		setIsBookingCancellationPending(() => true);
		const response = await cancelBooking(booking_id, user_id);

		switch (response.status) {
			case STATUS_CODES.OK:
				setIsBookingCancellationPending(() => false);
				toast({
					duration: 4000,
					variant: 'default',
					title: `Booking Cancellation`,
					description: (
						<div className='flex flex-col gap-3 w-full'>
							<div className='flex flex-col gap-1'>
								<span>{response.message}</span>
							</div>
						</div>
					),
				});
				break;
			case STATUS_CODES.UNAUTHORIZED:
				setIsBookingCancellationPending(() => false);
				toast({
					duration: 4000,
					variant: 'destructive',
					title: `Whoops..`,
					description: (
						<div className='flex flex-col gap-3 w-full'>
							<div className='flex flex-col gap-1'>
								<span>{response.message}</span>
							</div>
						</div>
					),
				});
				break;

			case STATUS_CODES.INTERNAL_SERVER_ERROR:
				setIsBookingCancellationPending(() => false);
				toast({
					duration: 4000,
					variant: 'destructive',
					title: `Whoops..`,
					description: (
						<div className='flex flex-col gap-3 w-full'>
							<div className='flex flex-col gap-1'>
								<span>{response.message}</span>
							</div>
						</div>
					),
				});
				break;
			default:
				setIsBookingCancellationPending(() => false);
				break;
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='destructive'
					size='sm'>
					Cancel Booking
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Cancel Booking</DialogTitle>
					<DialogDescription>
						Are you sure you want to cancel this booking? This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<h3 className='font-semibold'>{booking.title}</h3>
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<Calendar className='h-4 w-4' />
							<span>
								{format(booking.date, 'EEEE, MMMM d, yyyy')}
							</span>
						</div>
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<Clock className='h-4 w-4' />
							<span>{format(booking.time, 'h:mm a')}</span>
						</div>
						<div className='flex items-center gap-2 text-sm text-muted-foreground'>
							<MapPin className='h-4 w-4' />
							<span>{booking.location}</span>
						</div>
					</div>
					<div className='grid gap-1'>
						<div className='text-sm font-medium'>Status</div>
						<div className='flex items-center gap-2'>
							<div className='h-2 w-2 rounded-full bg-emerald-500' />
							<span className='text-sm text-muted-foreground'>
								{booking.status}
							</span>
						</div>
					</div>
					<div className='grid gap-1'>
						<div className='text-sm font-medium'>Host</div>
						<div className='text-sm text-muted-foreground'>
							{booking.hostName}
						</div>
					</div>
				</div>
				<DialogFooter className='flex gap-2 sm:gap-0'>
					<DialogTrigger asChild>
						<Button variant='outline'>Keep Booking</Button>
					</DialogTrigger>
					<Button
						disabled={isBookingCancellationPending}
						variant='destructive'
						onClick={async () =>
							handleCancelBooking(booking_id, currUser_id)
						}>
						{isBookingCancellationPending
							? '1 Sec..'
							: 'Cancel Booking'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
