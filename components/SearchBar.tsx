'use client';
import React, { useState } from 'react';
import Form from 'next/form';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { x } from '@/actions/search';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

type Props = {};

function SearchBar({}: Props) {
	const [search, setSearch] = useState<string | null>(null);

	return (
		<div className=''>
			<Form action={x}>
				<div className='flex flex-row justify-between border border-border py-1 pr-2 pl-4 rounded-full'>
					<input
						className='outline-none w-full'
						type='text'
						placeholder='Search for lobbies...'
						defaultValue={search ?? ''}
						onChange={(ev) => {
							if (!ev) return;
							const { value } = ev.target;
							setSearch(value);
						}}
					/>
                    
					<Button
						className='hidden md:flex items-center justify-center rounded-full p-2 aspect-square '
						variant={'default'}>
						<Search />
					</Button>
				</div>
				{search && <h1>sdfdasf</h1>}
			</Form>
		</div>
	);
}

export default SearchBar;
