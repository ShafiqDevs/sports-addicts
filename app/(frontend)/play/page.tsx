import DateTimePicker from '@/components/DateTimePicker';
import { PitchCard } from '@/components/PitchCard';
import { ScrollBar } from '@/components/ui/scroll-area';
import { api } from '@/convex/_generated/api';
import { ROUTES } from '@/lib/routes';
import { cn, convex } from '@/lib/utils';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { Users } from 'lucide-react';
import Link from 'next/link';

import React from 'react';

type Props = {
	searchParams: Promise<{ [query: string]: string }>;
};

type searchParamsObject = {
	date: string | null;
	size: string | null;
};

export default async function PlayPage({ searchParams }: Props) {
	const params = await searchParams;
	const { date = undefined, size = undefined } = params;
	const pitches = await convex.query(api.pitches.getPitchesByFilter, {
		size,
	});
	if (!pitches.data) {
		// return a UI to indicate to the user that there are no pitches yet.
		return <h1>NO PITCHES WHAT?</h1>;
	}

	const filters = [
		{
			name: 'size',
			id: 'all',
			label: 'all',
			icon: Users,
		},
		{
			name: 'size',
			id: '11-a-side',
			label: '11-a-side',
			icon: Users,
		},
		{
			name: 'size',
			id: '10-a-side',
			label: '10-a-side',
			icon: Users,
		},
		{ name: 'size', id: '8-a-side', label: '8-a-side', icon: Users },
		{ name: 'size', id: '6-a-side', label: '6-a-side', icon: Users },
		{ name: 'size', id: '5-a-side', label: '5-a-side', icon: Users },
	];

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

		return `${ROUTES.play}?${searchParams.toString()}`;

		// router.push(`${ROUTES.play}?${searchParams.toString()}`);
		// setSelectedFilter(filter_item.date || filter_item.size || 'all');
	}

	return (
		<main className='w-full h-full layoutXPadding overflow-hidden'>
			{/* <h1>Welcome to Sports Addicts!</h1> */}
			{/* Filters Section */}
			<div className=' sticky top-0 w-full mb-8 z-10 bg-background/951 backdrop-blur supports-[backdrop-filter]:bg-background/601 overflow-x-auto'>
				<div className='w-full px-4 py-4'>
					<ScrollArea className='w-full whitespace-nowrap'>
						<div className='flex w-max space-x-4 py-1'>
							{filters.map((filter) => (
								<Link
									href={handleFilter(
										filter.name === 'date'
											? { date: filter.id, size: null }
											: { date: null, size: filter.id }
									)}
									key={filter.id}
									className={cn(
										'inline-flex items-center rounded-full px-4 py-2 text-sm transition-colors',
										`${size === filter.id ? '' : 'hover:bg-muted'}`,
										size === filter.id
											? 'bg-primary text-primary-foreground'
											: 'bg-background border border-input'
									)}>
									<filter.icon className='mr-2 h-4 w-4' />
									{filter.label}
								</Link>
							))}
						</div>
						<ScrollBar orientation='horizontal' />
					</ScrollArea>
				</div>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  place-items-center gap-4'>
				{pitches.data.map(
					({
						_id,
						_creationTime,
						address,
						capacity,
						images,
						name,
					}) => (
						<PitchCard
							_id={_id}
							key={_id}
							name={name}
							images={images}
							address={address}
							capacity={capacity}
							rating={4.5}
						/>
					)
				)}
			</div>
		</main>
	);
}
