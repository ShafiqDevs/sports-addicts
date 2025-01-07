'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
	Bell,
	ChevronRight,
	User,
	Lock,
	HelpCircle,
	Moon,
	Smartphone,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { SignInButton, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Loader from '@/components/Loader';

import {
	subscribeUser,
	unsubscribeUser,
	sendNotification,
} from '@/actions/userPushNotifications';
import {
	CunstructSubscriptionCustomObject,
	urlBase64ToUint8Array,
} from '@/lib/utils';
import { NotificationSubscriptionObject } from '@/lib/types';
import { STATUS_CODES } from '@/lib/statusCodes';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
	const [isClient, setIsClient] = useState(false);
	const { user, isLoaded, isSignedIn } = useUser();
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] =
		useState<PushSubscription | null>(null);
	const [message, setMessage] = useState('');
	const { toast } = useToast();

	let currUser = useQuery(api.users.getUserByAuthId, {
		auth_id: user?.id,
	});

	const getPushNotificationSettings = useQuery(
		api.users.getNotificationSubSettings,
		{ user_id: currUser?._id }
	);

	console.log(getPushNotificationSettings?.data);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if ('serviceWorker' in navigator && 'PushManager' in window) {
			setIsSupported(true);
			registerServiceWorker();
		}
	}, []);

	async function registerServiceWorker() {
		const registration = await navigator.serviceWorker.register(
			'/sw.js',
			{
				scope: '/',
				updateViaCache: 'none',
			}
		);
		// register new subscription (new device)
		const sub = await registration.pushManager.getSubscription();
		setSubscription(sub);
	}

	async function subscribeToPush() {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
			),
		});

		const { CustomSubObj, serializedSub, vapidSubscriptionKey } =
			CunstructSubscriptionCustomObject(sub);
		const subRegisterResponse = await subscribeUser(
			CustomSubObj,
			currUser?._id,
			vapidSubscriptionKey
		);
		switch (subRegisterResponse.status) {
			case STATUS_CODES.OK:
				toast({
					className: 'bg-primary',
					duration: 4000,
					title: `Push Notification Enabled`,
					description: (
						<div className='flex flex-col gap-3 w-full'>
							<div className='flex flex-col gap-1'>
								<span></span>
							</div>
						</div>
					),
				});
				setSubscription(sub);
				break;
			case STATUS_CODES.NOT_FOUND:
				setSubscription(null);
				break;
			case STATUS_CODES.CREATED:
				setSubscription(sub);
				break;
			case STATUS_CODES.CONFLICT:
				setSubscription(null);
				break;
			case STATUS_CODES.INTERNAL_SERVER_ERROR:
				setSubscription(null);
				break;
			default:
				break;
		}
	}

	async function unsubscribeFromPush() {
		if (!subscription) return;
		const { CustomSubObj, serializedSub, vapidSubscriptionKey } =
			CunstructSubscriptionCustomObject(subscription);
		try {
			const response = await unsubscribeUser(
				currUser?._id,
				vapidSubscriptionKey
			);
			// await subscription?.unsubscribe();
			// setSubscription(null);
			switch (response.status) {
				case STATUS_CODES.OK:
					await subscription?.unsubscribe();
					toast({
						duration: 4000,
						variant: 'destructive',
						title: `Push Notification Disabled`,
						description: (
							<div className='flex flex-col gap-3 w-full'>
								<div className='flex flex-col gap-1'>
									<span></span>
								</div>
							</div>
						),
					});
					setSubscription(null);
					break;
				case STATUS_CODES.NOT_FOUND:
					toast({
						duration: 4000,
						variant: 'destructive',
						title: `Push Notification Disabled`,
						description: (
							<div className='flex flex-col gap-3 w-full'>
								<div className='flex flex-col gap-1'>
									<span></span>
								</div>
							</div>
						),
					});
					setSubscription(null);
					break;
				case STATUS_CODES.INTERNAL_SERVER_ERROR:
					toast({
						duration: 4000,
						variant: 'destructive',
						title: `Push Notification Disabled`,
						description: (
							<div className='flex flex-col gap-3 w-full'>
								<div className='flex flex-col gap-1'>
									<span></span>
								</div>
							</div>
						),
					});
					setSubscription(null);
					break;

				default:
					break;
			}
		} catch (error) {
			console.log(error);
			toast({
				duration: 4000,
				variant: 'destructive',
				title: `Push Notification Disabled`,
				description: (
					<div className='flex flex-col gap-3 w-full'>
						<div className='flex flex-col gap-1'>
							<span></span>
						</div>
					</div>
				),
			});
			setSubscription(null);
		}
	}

	async function sendTestNotification() {
		if (currUser) {
			await sendNotification(
				currUser?._id,
				JSON.stringify({
					title: 'Test Notification',
					body: 'This is a test notification',
					icon: '/favicon.ico',
				})
			);
			setMessage('');
		}
	}

	if (!isClient || !getPushNotificationSettings?.data) {
		// if (!isSignedIn) return <SignInButton />;
		return <Loader />;
	}

	return (
		<div className='container mx-auto px-4 py-8 max-w-2xl'>
			<h1 className='text-3xl font-bold mb-6'>Settings</h1>

			{isSupported && (
				<Card className='mb-6'>
					<CardContent className='p-0'>
						<div className='p-4 flex items-center justify-between'>
							<div className='flex items-center space-x-4'>
								<Bell className='h-5 w-5 text-primary' />
								<Label htmlFor='notifications'>Notifications</Label>
							</div>
							<Switch
								id='dark-mode'
								checked={!!subscription}
								onCheckedChange={(checked) =>
									checked ? subscribeToPush() : unsubscribeFromPush()
								}
							/>
						</div>
					</CardContent>
				</Card>
			)}

			<Card className='mb-6'>
				<CardContent className='p-0'>
					<div className='p-4 flex items-center justify-between'>
						<div className='flex items-center space-x-4'>
							<Moon className='h-5 w-5 text-primary' />
							<Label htmlFor='dark-mode'>Dark Mode</Label>
						</div>

						<Switch id='notifications' />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
