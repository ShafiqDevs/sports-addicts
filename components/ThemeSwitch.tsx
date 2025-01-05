'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitch() {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className='mr-2'>
			{theme === 'light' ? (
				<Moon className='h-5 w-5 text-primary' />
			) : (
				<Sun className='h-5 w-5 text-primary' />
			)}
			<span className='sr-only'>Toggle theme</span>
		</Button>
		// <DropdownMenu>
		// 	<DropdownMenuTrigger asChild className='rounded-full'>
		// 		<Button
		// 			variant='outline'
		// 			size='icon'>
		// 			<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
		// 			<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
		// 			<span className='sr-only'>Toggle theme</span>
		// 		</Button>
		// 	</DropdownMenuTrigger>
		// 	<DropdownMenuContent
		// 		align='end'
		// 		className='z-[99]'>
		// 		<DropdownMenuItem onClick={() => setTheme('light')}>
		// 			Light
		// 		</DropdownMenuItem>
		// 		<DropdownMenuItem onClick={() => setTheme('dark')}>
		// 			Dark
		// 		</DropdownMenuItem>
		// 		<DropdownMenuItem onClick={() => setTheme('system')}>
		// 			System
		// 		</DropdownMenuItem>
		// 	</DropdownMenuContent>
		// </DropdownMenu>
	);
}
