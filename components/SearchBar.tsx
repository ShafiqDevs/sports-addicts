import Form from 'next/form';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { x } from '@/actions/search';

type Props = {};

function SearchBar({}: Props) {
	return (
		<Form
			action={x}
			className='flex flex-col md:flex-row items-center justify-center gap-2'>
			<div className='flex flex-row justify-between border border-border py-1 pr-2 pl-4 rounded-full w-full md:w-60 '>
				<input
					className='outline-none bg-transparent w-full text-sm'
					type='text'
					placeholder='Search for lobbies...'
				/>

				<Button
					className='hidden md:flex items-center justify-center rounded-full p-2 aspect-square '
					variant={'default'}>
					<Search />
				</Button>
			</div>
		</Form>
	);
}

export default SearchBar;
