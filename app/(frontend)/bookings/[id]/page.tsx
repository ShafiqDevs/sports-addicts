'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, MapPinIcon, Clock } from 'lucide-react';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TeamList } from '@/components/TeamList';
import Image from 'next/image';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { STATUS_CODES } from '@/lib/statusCodes';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';
import { v4 as uuidv4 } from 'uuid';
type Props = {
	params: Promise<{ id: string }>;
};

export default function BookingDetailsPage({ params }: Props) {
	const { id } = useParams<{ id: string }>();
	const [isClient, setIsClient] = useState(false);
	const [isJoinPending, setIsJoinPending] = useState(false);
	const { toast } = useToast();
	const { user, isSignedIn } = useUser();

	useEffect(() => {
		setIsClient(true);
	}, []);

	const booking = useQuery(api.bookings.getBookingById, {
		booking_id: id as Id<'bookings'>,
	});

	const pitch = useQuery(api.pitches.getPitchById, {
		id: booking?.pitch_id as any,
	});

	const host = useQuery(api.users.GetUserById, {
		id: booking?.hostingUser_id as any,
	});

	const pitchImage = useQuery(api.files.getFileUrl, {
		storageId: pitch?.images[0],
	});

	const currUser = useQuery(api.users.getUserByAuthId, {
		auth_id: user?.id!,
	});

	const joinTeam = useMutation(api.bookings.joinBooking);
	const leaveTeam = useMutation(api.bookings.leaveBooking);

	if (!isClient) {
		return null;
	}

	async function handleJoinTeam(
		booking_id: Id<'bookings'>,
		side: 'home' | 'away',
		user: Doc<'users'>
	) {
		const response = await joinTeam({
			booking_id,
			side: side === 'home' ? 'teamA' : 'teamB',
			user_id: user._id,
		});

		switch (response?.status) {
			case STATUS_CODES.CREATED:
				toast({
					duration: 4000,
					variant: 'default',
					title: `Swtiched to ${side} team`,
					description: (
						<div className='flex flex-col gap-3 w-full'>
							<div className='flex flex-col gap-1'>
								<span>{response.message}</span>
							</div>
						</div>
					),
				});
				break;
			case STATUS_CODES.CONFLICT:
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
				break;
		}
	}
	async function handleLeaveTeam(
		booking_id: Id<'bookings'>,
		side: 'home' | 'away',
		user: Doc<'users'>
	) {
		const response = await leaveTeam({
			booking_id,
			side: side === 'home' ? 'teamA' : 'teamB',
			user_id: user._id,
		});

		switch (response?.status) {
			case STATUS_CODES.OK:
				toast({
					duration: 4000,
					variant: 'default',
					title: `Left ${side}`,
					description: (
						<div className='flex flex-col gap-3 w-full'>
							<div className='flex flex-col gap-1'>
								<span>{response.message}</span>
							</div>
						</div>
					),
				});
				break;
			case STATUS_CODES.CONFLICT:
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
				break;
		}
	}

	return (
		<div className='container mx-auto py-10 space-y-8'>
			{booking && pitch && host && (
				<Card>
					<CardContent className='p-6'>
						<div className='grid gap-6 md:grid-cols-2'>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<h1 className='text-2xl font-bold'>
										Football Match
									</h1>
									<div className='flex items-center gap-2'>
										<Badge
											variant={
												booking.status === 'Available'
													? 'secondary'
													: booking.status === 'Booked'
														? 'default'
														: booking.status === 'Cancelled'
															? 'destructive'
															: 'outline'
											}>
											{booking.status}
										</Badge>
									</div>
								</div>

								<div className='space-y-2 text-sm'>
									<div className='flex items-center gap-2 text-muted-foreground'>
										<CalendarIcon className='h-4 w-4' />
										<time
											dateTime={new Date(
												booking.booking_start
											).toISOString()}>
											{format(
												booking.booking_start,
												'EEEE, MMMM d, yyyy'
											)}
										</time>
									</div>
									<div className='flex items-center gap-2 text-muted-foreground'>
										<Clock className='h-4 w-4' />
										<span>
											{format(booking.booking_start, 'h:mm a')} -{' '}
											{format(booking.booking_end, 'h:mm a')}
										</span>
									</div>
									<div className='flex items-center gap-2 text-muted-foreground'>
										<MapPinIcon className='h-4 w-4' />
										<span>{pitch.address}</span>
									</div>
								</div>

								<Separator />

								<div className='space-y-2'>
									<h2 className='text-sm font-medium'>Hosted by</h2>
									<div className='flex items-center gap-2'>
										<Avatar>
											<AvatarImage
												src={host.user_profile_image_url}
												alt={host.user_name}
											/>
											<AvatarFallback>
												{host.user_name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>
										<span>
											{host._id === currUser?._id
												? 'You'
												: host.user_name}
										</span>
									</div>
								</div>
							</div>

							<div className='relative aspect-video rounded-lg overflow-hidden'>
								{pitchImage ? (
									<Image
										src={pitchImage}
										alt={pitch.name}
										className='w-full h-full object-cover'
										width={600}
										height={400}
									/>
								) : (
									<Skeleton className='w-full h-full object-cover' />
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{booking?.teamA && booking?.teamB && pitch && (
				<div className='grid gap-6 md:grid-cols-2'>
					<TeamList
						key={uuidv4()}
						onJoinTeam={async (side, user) => {
							console.log(`joining ${side}`);
							try {
								setIsJoinPending(true);
								handleJoinTeam(booking._id, side, user);
							} catch (error) {
								console.log(error);
							} finally {
								setIsJoinPending(false);
							}
						}}
						onLeaveTeam={async (side, user) => {
							console.log(`leaving ${side}`);
							try {
								setIsJoinPending(true);
								handleLeaveTeam(booking._id, side, user);
							} catch (error) {
								console.log(error);
							} finally {
								setIsJoinPending(false);
							}
						}}
						disabled={isJoinPending}
						teamList={booking?.teamA}
						side='home'
						pitch={pitch}
						booking_status={booking.status}
					/>
					<TeamList
						key={uuidv4()}
						onJoinTeam={async (side, user) => {
							console.log(`joining ${side}`);
							try {
								setIsJoinPending(true);
								handleJoinTeam(booking._id, side, user);
							} catch (error) {
								console.log(error);
							} finally {
								setIsJoinPending(false);
							}
						}}
						onLeaveTeam={async (side, user) => {
							console.log(`leaving ${side}`);
							try {
								setIsJoinPending(true);
								handleLeaveTeam(booking._id, side, user);
							} catch (error) {
								console.log(error);
							} finally {
								setIsJoinPending(false);
							}
						}}
						disabled={isJoinPending}
						teamList={booking?.teamB}
						side='away'
						pitch={pitch}
						booking_status={booking.status}
					/>
				</div>
			)}
		</div>
	);
}
