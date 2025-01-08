import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ConvexClientProvider } from '@/components/ConvexProviderHelper';
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
	title: 'Sports Addicts',
	description: 'Book your perfect football pitch with Sports Addicts',
	openGraph: {
		title: 'Sports Addicts',
		description:
			'Book your perfect football pitch with Sports Addicts',
		url: ROUTES.appUrl,
		siteName: 'Sports Addicts',
		images: [
			{
				url: `${ROUTES.appUrl}/api/og?title=Sports Addicts`,
				width: 1200,
				height: 630,
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Sports Addicts',
		description:
			'Book your perfect football pitch with Sports Addicts',
		images: [`${ROUTES.appUrl}/api/og?title=Sports Addicts`],
	},

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
