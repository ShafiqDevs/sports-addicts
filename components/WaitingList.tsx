import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '@/components/ui/avatar';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { WaitingListWithUserData } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import { Badge } from './ui/badge';
import { v4 as uuidv4 } from 'uuid';

type WaitingListProps = {
	waitingList: WaitingListWithUserData[];
	onJoinWaitingList: () => void;
	onLeaveWaitingList: () => void;
	isUserInWaitingList: boolean;
	isDisabled: boolean;
};

export function WaitingList({
	waitingList,
	onJoinWaitingList,
	onLeaveWaitingList,
	isUserInWaitingList,
	isDisabled,
}: WaitingListProps) {
	const { user: currUser } = useUser();
	return (
		<Card className='w-full'>
			<CardHeader>
				<CardTitle className='text-xl font-semibold'>
					Waiting List
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='flex flex-wrap gap-2'>
						{waitingList.map((waitingEntry, index) => (
							<div
								key={uuidv4()}
								className='flex flex-col items-center gap-2'>
								<Avatar
									key={waitingEntry._id}
									className='h-12 w-12'>
									<AvatarImage
										src={waitingEntry.user?.user_profile_image_url}
										alt={waitingEntry.user?.user_name}
									/>
									<AvatarFallback>
										{waitingEntry.user?.user_name
											.split(' ')
											.map((n) => n[0])
											.join('')}
									</AvatarFallback>
								</Avatar>
								<Badge
									variant={'secondary'}
									className='text-sm'>
									{waitingEntry.user?.clerk_id === currUser?.id
										? `You in position ${index + 1}`
										: `${waitingEntry.user?.user_name} in position ${index + 1}`}
								</Badge>
							</div>
						))}
						{waitingList.length === 0 && (
							<p className='text-sm text-muted-foreground'>
								No one is waiting yet.
							</p>
						)}
					</div>
					<Button
						variant={isUserInWaitingList ? 'destructive' : 'default'}
						onClick={
							isUserInWaitingList
								? onLeaveWaitingList
								: onJoinWaitingList
						}
						disabled={isDisabled}
						className='w-full sm:w-auto'>
						{isUserInWaitingList
							? 'Leave Waiting List'
							: 'Join Waiting List'}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
