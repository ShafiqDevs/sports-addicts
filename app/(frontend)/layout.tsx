import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import SearchBar from '@/components/SearchBar';

import { ClerkProvider } from '@clerk/nextjs';
import UserClerkMenu from '@/components/UserClerkMenu';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { ThemeSwitch } from '@/components/ThemeSwitch';
import { Toaster } from '@/components/ui/toaster';
import { ConvexClientProvider } from '@/components/ConvexProviderHelper';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import SyncUserWithConvex from '@/components/SyncUserWithConvex';
import Footer from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

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
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
	},
};
export const viewport: Viewport = {
	maximumScale: 1,
	userScalable: false,
};

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			className='scroll-smooth'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ConvexClientProvider>
					<ThemeProvider
						attribute={'class'}
						defaultTheme={'system'}
						enableSystem
						disableTransitionOnChange>
						<ClerkProvider dynamic>
							<Navbar />
							{children}

							<SyncUserWithConvex />
						</ClerkProvider>
					</ThemeProvider>
				</ConvexClientProvider>
				<Footer />
				<Toaster />
			</body>
		</html>
	);
}
