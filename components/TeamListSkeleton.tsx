'use client';

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users } from 'lucide-react';

export default function TeamListSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center justify-between'>
					<Skeleton className='h-6 w-24' />
					<Skeleton className='h-4 w-32' />
				</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<Skeleton className='h-2 w-full' />

				<div className='space-y-4'>
					{[...Array(3)].map((_, index) => (
						<div
							key={index}
							className='flex items-center gap-3'>
							<Skeleton className='h-10 w-10 rounded-full' />
							<Skeleton className='h-4 flex-1' />
						</div>
					))}

					<div className='flex items-center gap-3 text-muted-foreground'>
						<Skeleton className='h-10 w-10 rounded-full flex items-center justify-center'>
							<Users className='h-4 w-4' />
						</Skeleton>
						<Skeleton className='h-4 w-24' />
					</div>
				</div>

				<Skeleton className='h-10 w-full' />
			</CardContent>
		</Card>
	);
}
