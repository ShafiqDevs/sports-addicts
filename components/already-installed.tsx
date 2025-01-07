import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function AlreadyInstalled() {
	return (
		<div className='container mx-auto px-4 py-16 max-w-2xl text-center'>
			<h1 className='text-4xl font-bold mb-6'>
				Sports Addicts is Installed
			</h1>
			<Card className='bg-gradient-to-br from-green-500/10 to-green-500/5'>
				<CardContent className='pt-6'>
					<div className='mb-6'>
						<CheckCircle className='w-16 h-16 mx-auto text-green-500' />
					</div>
					<p className='text-xl mb-8'>
						Great news! Sports Addicts is already installed on your
						device.
					</p>
					<p className='text-muted-foreground mb-8'>
						You can access the app from your home screen. If you can't
						find it, try searching for "Sports Addicts" on your
						device.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
