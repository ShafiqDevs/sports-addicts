import Link from 'next/link';
import { Menu, Search, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import UserClerkMenu from './UserClerkMenu';
import { ThemeSwitch } from './ThemeSwitch';

export function Navbar() {
	return (
		<header className='sticky top-0 z-50 w-full layoutXPadding border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='w-full flex h-16 items-center'>
				<Sheet defaultOpen={false}>
					<SheetTitle className='hidden' />
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='mr-2 md:hidden'>
							<Menu className='h-5 w-5' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side='left'
						className='w-[300px] sm:w-[400px]'>
						<nav className='flex flex-col gap-4'>
							<Link
								href='/'
								className='text-sm font-medium transition-colors hover:text-primary'>
								Home
							</Link>
							<Link
								href='/play'
								className='text-sm font-medium transition-colors hover:text-primary'>
								Play
							</Link>
							<Link
								href='/bookings'
								className='text-sm font-medium transition-colors hover:text-primary'>
								Bookings
							</Link>
							<Link
								href='/support'
								className='text-sm font-medium transition-colors hover:text-primary'>
								Support
							</Link>
							<Link
								href='/settings'
								className='text-sm font-medium transition-colors hover:text-primary'>
								Settings
							</Link>
							<Link
								href='/install'
								className='text-sm font-medium transition-colors hover:text-primary'>
								install
							</Link>
						</nav>
					</SheetContent>
				</Sheet>
				<Link
					href='/'
					className='mr-6 flex items-center space-x-2'>
					<span className='hidden font-bold text-primary sm:inline-block'>
						Sports Addicts
					</span>
				</Link>
				<nav className='hidden md:flex md:flex-1 md:items-center md:gap-6'>
					<Link
						href='/'
						className='text-sm font-medium transition-colors hover:text-primary'>
						Home
					</Link>
					<Link
						href='/play'
						className='text-sm font-medium transition-colors hover:text-primary'>
						Play
					</Link>
					<Link
						href='/bookings'
						className='text-sm font-medium transition-colors hover:text-primary'>
						Bookings
					</Link>
					<Link
						href='/support'
						className='text-sm font-medium transition-colors hover:text-primary'>
						Support
					</Link>
				</nav>
				<div className='flex flex-1 items-center justify-end gap-2'>
					<form className='hidden w-full max-w-sm lg:flex'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search for lobbies...'
								className='w-full appearance-none bg-background pl-8 shadow-none md:w-[300px]'
							/>
						</div>
					</form>
					{/* theme switch */}
					<ThemeSwitch />
					<UserClerkMenu />
				</div>
			</div>
		</header>
	);
}
