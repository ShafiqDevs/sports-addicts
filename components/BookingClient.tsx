'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import {
	CalendarIcon,
	Clock,
	Users,
	MapPinIcon,
	ClockIcon,
	User,
} from 'lucide-react';
import { differenceInHours, format } from 'date-fns';
import { cn, groupedBookingByDateLabel } from '@/lib/utils';
import {
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation';
import { BookingWithUserData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
import NoBookingsUI from './NoBookingsUI';

const filters = [
	{ name: 'date', id: 'all', label: 'All Games', icon: Users },
	{ name: 'date', id: 'today', label: 'Today', icon: CalendarIcon },
	{ name: 'date', id: 'tomorrow', label: 'Tomorrow', icon: Clock },
	{ name: 'size', id: '11-a-side', label: '11-a-side', icon: Users },
	{ name: 'size', id: '10-a-side', label: '10-a-side', icon: Users },
	{ name: 'size', id: '8-a-side', label: '8-a-side', icon: Users },
	{ name: 'size', id: '6-a-side', label: '6-a-side', icon: Users },
	{ name: 'size', id: '5-a-side', label: '5-a-side', icon: Users },
];

type Props = {
	bookings: BookingWithUserData[];
};
type searchParamsObject = {
	date: string | null;
	size: string | null;
};

export default function BookingsClient({ bookings }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const date = searchParams.get('date');
	const size = searchParams.get('size');
	const pathName = usePathname();
	const { user } = useUser();
	const [selectedFilter, setSelectedFilter] = useState(
		date || size || 'all'
	);

	function handleFilter(filter_item: searchParamsObject) {
		const searchParams = new URLSearchParams();

		if (filter_item.date) {
			searchParams.set('date', filter_item.date);
		} else {
			searchParams.delete('date');
		}

		if (filter_item.size) {
			searchParams.set('size', filter_item.size);
		} else {
			searchParams.delete('size');
		}

		router.push(`${pathName}?${searchParams.toString()}`);
		setSelectedFilter(filter_item.date || filter_item.size || 'all');
	}

	return (
		<div className='w-full h-full bg-background relative'>
			<div className=' sticky top-0 z-10 bg-background/951 backdrop-blur supports-[backdrop-filter]:bg-background/601'>
				<div className=' py-4'>
					<ScrollArea className='w-full whitespace-nowrap'>
						<div className='flex w-max space-x-4 py-1'>
							{filters.map((filter) => (
								<button
									key={uuidv4()}
									onClick={() =>
										handleFilter(
											filter.name === 'date'
												? { date: filter.id, size: null }
												: { date: null, size: filter.id }
										)
									}
									className={cn(
										'inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors',
										`${selectedFilter === filter.id ? '' : 'hover:bg-muted'}`,
										selectedFilter === filter.id
											? 'bg-primary text-primary-foreground'
											: 'bg-background border border-input'
									)}>
									<filter.icon className='mr-2 h-4 w-4' />
									{filter.label}
								</button>
							))}
						</div>
						<ScrollBar orientation='horizontal' />
					</ScrollArea>
				</div>
			</div>

			<div className=' py-6'>
				<AnimatePresence mode='popLayout'>
					{bookings.length === 0 ? (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className='text-center py-12 text-muted-foreground'>
							<NoBookingsUI withAction />
						</motion.div>
					) : (
						<Card className='w-full mx-auto'>
							<CardHeader className='max-sm:px-3 max-sm:py-3'>
								<CardTitle className='text-xl font-semibold'>
									Upcoming Bookings
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-8 max-sm:px-3 max-h-full overflow-y-auto'>
								{Object.entries(
									groupedBookingByDateLabel(bookings)
								).map(([label, bookings], index) => (
									<div
										key={uuidv4()}
										className='w-full flex flex-col gap-1'>
										<h3 className='text-primary text-sm'>{label}</h3>
										<div className='flex flex-col gap-2 w-full '>
											<AnimatePresence mode='popLayout'>
												{bookings.map((booking) => {
													if (!booking.hostingUser) return;
													return (
														<motion.div
															key={uuidv4()}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -20 }}
															layout
															className='w-full'>
															<Link
																href={`${ROUTES.bookings}/${booking._id}`}
																key={booking._id}
																className=' flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/10'>
																<div className=' flex flex-wrap items-center gap-4'>
																	<Avatar className='h-12 w-12'>
																		<AvatarImage
																			src={
																				booking.hostingUser
																					.user_profile_image_url
																			}
																			alt={
																				booking.hostingUser.user_name
																			}
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
																<div className='ml-auto flex flex-wrap items-center justify-between gap-4 w-full'>
																	<div className='flex items-center gap-2 text-muted-foreground text-sm'>
																		<User className='h-4 w-4' />
																		<span>
																			{booking.teamA.length +
																				booking.teamB.length}
																			/{booking.pitch?.capacity}
																		</span>
																	</div>
																	<div className='flex flex-wrap gap-1'>
																		<div className='flex gap-2'>
																			{booking.hostingUser
																				.clerk_id === user?.id && (
																				<div
																					className={`px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400 dark:bg-blue-500 pointer-events-none`}>
																					<span>
																						I&apos;m hosting
																					</span>
																				</div>
																			)}
																		</div>
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
																</div>
															</Link>
														</motion.div>
													);
												})}
											</AnimatePresence>
										</div>
									</div>
								))}
							</CardContent>
						</Card>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
