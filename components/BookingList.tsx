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
	ClockIcon,
	MapPinIcon,
	MoreHorizontal,
	User,
} from 'lucide-react';
import {
	formatDistanceToNow,
	format,
	differenceInHours,
} from 'date-fns';
import { Doc } from '@/convex/_generated/dataModel';
import { BookingWithUserData } from '@/lib/types';
import { groupedBookingByDateLabel } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingListProps {
	bookings: BookingWithUserData[];
}

export function BookingList({ bookings }: BookingListProps) {
	if (!bookings || bookings.length < 1) {
		//TODO: add a proper UI for this case
		return <p>No Bookings for now </p>;
	}

	const { user } = useUser();

	return (
		<Card className='w-full mx-auto'>
			<CardHeader>
				<CardTitle className='text-xl font-semibold'>
					Upcoming Bookings
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-8 max-h-full overflow-y-auto'>
				{Object.entries(groupedBookingByDateLabel(bookings)).map(
					([label, bookings], index) => (
						<div
							key={`${label}'bookings`}
							className='w-full flex flex-col gap-1'>
							<h3 className='text-primary text-sm'>{label}</h3>
							<div className='flex flex-col gap-2'>
								{bookings.map((booking) => {
									if (!booking.hostingUser) return;
									return (
										<Link
											href={`${ROUTES.bookings}/${booking._id}`}
											key={booking._id}
											className=' flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/10'>
											<AnimatePresence mode='popLayout'>
												<motion.div>
													<div className='flex flex-wrap items-center gap-4'>
														<Avatar className='h-12 w-12'>
															<AvatarImage
																src={
																	booking.hostingUser
																		.user_profile_image_url
																}
																alt={booking.hostingUser.user_name}
															/>
															<AvatarFallback>
																{booking.hostingUser.user_name
																	.split(' ')
																	.map((n) => n[0])
																	.join('')}
															</AvatarFallback>
														</Avatar>
														<div className='space-y-1'>
															<h3 className='font-medium leading-none'>
																{booking.hostingUser.user_name}
															</h3>
															<div className='flex items-center flex-wrap text-sm text-muted-foreground gap-1'>
																<div className='flex items-center gap-1 shrink-0'>
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
																<span className='flex items-center justify-start gap-1 text-muted-foreground shrink-0'>
																	<ClockIcon className='h-4 w-4' />
																	<span>
																		{differenceInHours(
																			booking.booking_end,
																			booking.booking_start
																		)}
																		Hrs
																	</span>
																</span>
																<span className='flex items-center gap-1 shrink-0'>
																	<MapPinIcon className='h-4 w-4' />
																	<span>
																		{booking.pitch?.address}
																	</span>
																</span>
															</div>
														</div>
													</div>
													<div className='ml-auto flex items-center justify-between w-full'>
														<div className='flex items-center gap-2 text-muted-foreground text-sm'>
															<User className='h-4 w-4' />
															<span>
																{booking.teamA.length +
																	booking.teamB.length}
																/{booking.pitch?.capacity}
															</span>
														</div>
														<div className='flex gap-2'>
															{booking.hostingUser.clerk_id ===
																user?.id && (
																<div
																	className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400 dark:bg-blue-500 pointer-events-none`}>
																	<span>I&apos;m hosting</span>
																</div>
															)}
															<div
																className={`px-2.5 py-0.5 rounded-full text-xs font-medium pointer-events-none
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
														</div>

														{/* <DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'>
															<MoreHorizontal className='h-4 w-4' />
															<span className='sr-only'>
																Open menu
															</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem>
															View details
														</DropdownMenuItem>
														{booking.hostingUser.clerk_id ===
														user?.id ? (
															<DropdownMenuItem>
																Cancel booking
															</DropdownMenuItem>
														) : (
															<DropdownMenuItem>
																Cancel booking
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu> */}
													</div>
												</motion.div>
											</AnimatePresence>
										</Link>
									);
								})}
							</div>
						</div>
					)
				)}
			</CardContent>
		</Card>
	);
}
