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
import { Progress } from '@/components/ui/progress';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Users } from 'lucide-react';
import TeamListSkeleton from './TeamListSkeleton';
import { v4 as uuidv4 } from 'uuid';

interface TeamListProps {
	booking_status: Doc<'bookings'>['status'];
	teamList: Id<'users'>[];
	side: 'home' | 'away';
	pitch: Doc<'pitches'>;
	onJoinTeam: (side: 'home' | 'away', user: Doc<'users'>) => void;
	onLeaveTeam: (side: 'home' | 'away', user: Doc<'users'>) => void;
	disabled: boolean;
}

export function TeamList({
	booking_status,
	teamList,
	side,
	pitch,
	onJoinTeam,
	onLeaveTeam,
	disabled,
}: TeamListProps) {
	const { user } = useUser();
	const players = useQuery(api.users.getUsersById, { ids: teamList });
	const currUser = useQuery(api.users.getUserByAuthId, {
		auth_id: user?.id ?? '',
	});
	const isJoined = teamList.includes(currUser?._id!);
	const progress = (teamList.length / (pitch.capacity / 2)) * 100;
	const teamAvailableSpots = pitch.capacity / 2 - teamList.length;

	return disabled ? (
		<TeamListSkeleton />
	) : (
		<Card
			className={`col-span-1 ${booking_status === 'Completed' || (booking_status === 'Cancelled' && 'pointer-events-none')}`}>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<span>{side === 'home' ? 'Home Team' : 'Away Team'}</span>
					<span className='text-sm text-muted-foreground'>
						{teamList.length}/{pitch.capacity / 2} Players
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Progress
					value={progress}
					className='h-2'
				/>

				<div className='space-y-4'>
					{players?.map(
						(player) =>
							player && (
								<div
									key={uuidv4()}
									className='flex items-center gap-3'>
									<Avatar>
										<AvatarImage
											src={player.user_profile_image_url}
											alt={player?.user_name}
										/>
										<AvatarFallback>
											{player.user_profile_image_url
												.split(' ')
												.map((n) => n[0])
												.join('')}
										</AvatarFallback>
									</Avatar>
									<span className='flex-1'>
										{player._id === currUser?._id
											? 'You'
											: player.user_name}
									</span>
								</div>
							)
					)}

					{players &&
						players.length < pitch.capacity / 2 &&
						Array.from(
							{ length: teamAvailableSpots },
							(_, i) => i
						).map((_) => (
							<div
								key={uuidv4()}
								className='flex items-center gap-3 text-muted-foreground'>
								<Avatar>
									<AvatarFallback>
										<Users className='h-4 w-4' />
									</AvatarFallback>
								</Avatar>
								<span>Available Spot</span>
							</div>
						))}
				</div>

				{currUser &&
				(booking_status === 'Cancelled' ||
					booking_status === 'Completed') ? (
					<Button
						disabled
						variant={isJoined ? 'destructive' : 'default'}
						className='w-full'>
						{isJoined ? 'Leave Team' : 'Join Team'}
					</Button>
				) : (
					currUser && (
						<Button
							variant={isJoined ? 'destructive' : 'default'}
							className='w-full'
							onClick={() =>
								isJoined
									? onLeaveTeam(side, currUser)
									: onJoinTeam(side, currUser)
							}>
							{isJoined ? 'Leave Team' : 'Join Team'}
						</Button>
					)
				)}
			</CardContent>
		</Card>
	);
}
