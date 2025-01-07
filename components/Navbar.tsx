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
import { ROUTES } from '@/lib/routes';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignOutButton,
} from '@clerk/nextjs';

export function Navbar() {
	return (
		<header className='sticky top-0 z-50 w-full layoutXPadding border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='w-full flex h-16 items-center'>
				<Sheet defaultOpen={false}>
					<SheetTitle></SheetTitle>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='mr-2 md:hidden'>
							<Menu className='h-6 w-6' />
							<span className='sr-only'>Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent
						side='left'
						className='w-[300px] sm:w-[400px] p-0'>
						<nav className='flex flex-col h-full bg-background'>
							<div className='px-6 py-4 border-b'>
								<h2 className='text-lg font-semibold'>Menu</h2>
							</div>
							<div className='flex-1 overflow-y-auto'>
								<div className='py-2'>
									<h3 className='px-6 py-2 text-sm font-semibold text-muted-foreground'>
										Main
									</h3>
									<Link
										href={ROUTES.home}
										className='flex items-center px-6 py-4 text-base font-medium transition-colors hover:bg-muted'>
										Home
									</Link>
									<Link
										href={ROUTES.play}
										className='flex items-center px-6 py-4 text-base font-medium transition-colors hover:bg-muted'>
										Play
									</Link>
									<Link
										href={ROUTES.bookings}
										className='flex items-center px-6 py-4 text-base font-medium transition-colors hover:bg-muted'>
										Bookings
									</Link>
								</div>
								<div className='py-2 border-t'>
									<h3 className='px-6 py-2 text-sm font-semibold text-muted-foreground'>
										Help
									</h3>
									<Link
										href={ROUTES.support}
										className='flex items-center px-6 py-4 text-base font-medium transition-colors hover:bg-muted'>
										Support
									</Link>
								</div>
								<div className='py-2 border-t'>
									<h3 className='px-6 py-2 text-sm font-semibold text-muted-foreground'>
										Other
									</h3>
									<Link
										href={ROUTES.settings}
										className='flex items-center px-6 py-4 text-base font-medium transition-colors hover:bg-muted'>
										Settings
									</Link>
									<Link
										href={ROUTES.install}
										className='flex items-center px-6 py-4 text-base font-medium transition-colors hover:bg-muted'>
										Install app
									</Link>
								</div>
							</div>
							<div className='px-6 py-4 border-t'>
								<SignedIn>
									<SignOutButton>
										<Button
											className='w-full'
											variant='outline'>
											Log out
										</Button>
									</SignOutButton>
								</SignedIn>
								<SignedOut>
									<SignInButton>
										<Button
											className='w-full'
											variant='outline'>
											Sign in
										</Button>
									</SignInButton>
								</SignedOut>
							</div>
						</nav>
					</SheetContent>
				</Sheet>
				<Link
					href={ROUTES.home}
					className='mr-6 flex items-center space-x-2'>
					<span className='hidden font-bold text-primary sm:inline-block'>
						Sports Addicts
					</span>
				</Link>
				<nav className='hidden md:flex md:flex-1 md:items-center md:gap-6'>
					<Link
						href={ROUTES.home}
						className='text-sm font-medium transition-colors hover:text-primary'>
						Home
					</Link>
					<Link
						href={ROUTES.play}
						className='text-sm font-medium transition-colors hover:text-primary'>
						Play
					</Link>
					<Link
						href={ROUTES.bookings}
						className='text-sm font-medium transition-colors hover:text-primary'>
						Bookings
					</Link>
					<Link
						href={ROUTES.settings}
						className='text-sm font-medium transition-colors hover:text-primary'>
						Settings
					</Link>
					<Link
						href={ROUTES.support}
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
