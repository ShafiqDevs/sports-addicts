import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export function DesktopPrompt() {
	const appUrl = ROUTES.appUrl;

	return (
		<div className='container mx-auto px-4 py-16 max-w-2xl text-center'>
			<h1 className='text-4xl font-bold mb-6'>
				Install Sports Addicts on your device
			</h1>
			<Card className='bg-gradient-to-br from-primary/10 to-primary/5'>
				<CardContent className='pt-6'>
					<div className='mb-6'>
						<Smartphone className='w-16 h-16 mx-auto text-primary' />
					</div>
					<p className='text-xl mb-8'>
						To view the installation guide, please open this page on
						your mobile device.
					</p>
					<div className='flex justify-center mb-8'>
						<QRCodeSVG
							value={appUrl}
							size={200}
						/>
					</div>
					<p className='text-sm text-muted-foreground mb-4'>
						Scan this QR code with your device's camera to open the
						app
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
