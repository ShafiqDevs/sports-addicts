import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import {
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/ui/app-sidebar';
import SearchBar from '@/components/SearchBar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<SidebarProvider>
					<AppSidebar />
					<div className='w-full'>
						<div className='sticky top-0 grid grid-cols-3 bg-card py-4'>
							<SidebarTrigger />
							<SearchBar />
						</div>
						{children}
					</div>
				</SidebarProvider>
			</body>
		</html>
	);
}
