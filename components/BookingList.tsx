'use client';

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	CalendarIcon,
	MapPinIcon,
	MoreHorizontal,
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface Booking {
	id: string;
	hostingUser_id: string;
	pitch_id: string;
	booking_start: number;
	booking_end: number;
	status: 'Available' | 'Booked' | 'Cancelled' | 'Completed';
	user: {
		name: string;
		image?: string;
	};
	pitch: {
		name: string;
	};
}

interface BookingListProps {
	bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
	console.log(new Date(bookings[0].booking_start).toLocaleString());

	return (
		<Card className='w-full max-w-2xl mx-auto'>
			<CardHeader>
				<CardTitle className='text-xl font-semibold'>
					Upcoming Bookings
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4 max-h-full overflow-y-auto'>
				{bookings.map((booking) => (
					<div
						key={booking.id}
						className='flex flex-wrap items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/10'>
						<div className='flex flex-wrap items-center gap-4'>
							<Avatar className='h-12 w-12'>
								<AvatarImage
									src={booking.user.image}
									alt={booking.user.name}
								/>
								<AvatarFallback>
									{booking.user.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</AvatarFallback>
							</Avatar>
							<div className='space-y-1'>
								<h3 className='font-medium leading-none'>
									{booking.user.name}
								</h3>
								<div className='flex items-center text-sm text-muted-foreground gap-4'>
									<div className='flex items-center gap-1'>
										<CalendarIcon className='h-4 w-4' />
										<time
											dateTime={new Date(
												booking.booking_start
											).toLocaleString()}>
											{format(
												booking.booking_start,
												"MMM d, yyyy 'at' h:mm a"
											)}
										</time>
									</div>
									<div className='flex items-center gap-1'>
										<MapPinIcon className='h-4 w-4' />
										<span>{booking.pitch.name}</span>
									</div>
								</div>
							</div>
						</div>
						<div className='ml-auto flex items-center gap-2'>
							<div
								className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                ${
									booking.status === 'Available'
										? 'bg-green-100 text-green-700'
										: booking.status === 'Booked'
											? 'bg-blue-100 text-blue-700'
											: booking.status === 'Cancelled'
												? 'bg-red-100 text-red-700'
												: 'bg-gray-100 text-gray-700'
								}`}>
								{booking.status}
							</div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										className='h-8 w-8'>
										<MoreHorizontal className='h-4 w-4' />
										<span className='sr-only'>Open menu</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem>View details</DropdownMenuItem>
									<DropdownMenuItem>Cancel booking</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
