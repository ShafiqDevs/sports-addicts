import Form from 'next/form';
import { Search } from 'lucide-react';
import { Button } from './ui/button';
import { x } from '@/actions/search';
import { Input } from './ui/input';

type Props = {};

function SearchBar({}: Props) {
	return (
		<Form
			action={x}
			className='hidden w-full max-w-sm lg:flex'>
			<div className='relative'>
				<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
				<Input
					type='search'
					placeholder='Find a game...'
					className='w-full appearance-none bg-background pl-8 shadow-none md:w-[300px]'
				/>
			</div>
		</Form>
	);
}

export default SearchBar;
