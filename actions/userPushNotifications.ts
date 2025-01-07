'use server';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { STATUS_CODES } from '@/lib/statusCodes';
import { NotificationSubscriptionObject } from '@/lib/types';
import {
	convertCustomSubObjectToVapidSub,
	convex,
} from '@/lib/utils';

const webpush = require('web-push');

webpush.setVapidDetails(
	'mailto:shafiq.belaroussi@gmail.com',
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
	process.env.VAPID_PRIVATE_KEY!
);

let subscription: NotificationSubscriptionObject | null = null;

export async function subscribeUser(
	sub: NotificationSubscriptionObject,
	user_id: Id<'users'> | undefined,
	sub_Keys_auth: string
) {
	if (!user_id)
		return {
			message: 'User not found',
			data: null,
			status: STATUS_CODES.NOT_FOUND,
		};
	subscription = sub;
	subscription[sub_Keys_auth].endpoint;

	const registerPushNotificationSubscription = await convex.mutation(
		api.users.registerNotificationSubscription,
		{
			user_id,
			sub_Keys_auth,
			subscription: JSON.stringify(subscription),
		}
	);
	return {
		message: registerPushNotificationSubscription.message,
		data: subscription,
		status: STATUS_CODES.OK,
	};
}

export async function unsubscribeUser(
	user_id: Id<'users'> | undefined,
	sub_Keys_auth: string
) {
	if (!user_id)
		return {
			message: 'User not found',
			data: null,
			status: STATUS_CODES.NOT_FOUND,
		};
	subscription = null;
	const unsubscribeUserDevice = await convex.mutation(
		api.users.unregisterNotificationSubscription,
		{ user_id, sub_Keys_auth }
	);
	return unsubscribeUserDevice;
}

export async function sendNotification(
	user_id: Id<'users'>,
	data: string
) {
	const response = await convex.query(
		api.users.getNotificationSubSettings,
		{
			user_id,
		}
	);
	const allUserSubscriptions = response.data;
	if (!allUserSubscriptions)
		return {
			message: 'No subscription found',
			data: null,
			status: STATUS_CODES.NOT_FOUND,
		};
	const customSubObjects = allUserSubscriptions.map((sub) =>
		JSON.parse(sub)
	);
	const vapidSubObjects = customSubObjects.map((customSub) =>
		convertCustomSubObjectToVapidSub(customSub)
	);

	try {
		await Promise.all(
			vapidSubObjects.map((sub) =>
				webpush.sendNotification(sub, data)
			)
		);
		return {
			message: 'Notification sent successfully',
			data: vapidSubObjects,
			status: STATUS_CODES.OK,
		};
	} catch (error) {
		console.error('Error sending push notification:', error);
		return {
			message: 'Error sending push notification',
			data: null,
			status: STATUS_CODES.INTERNAL_SERVER_ERROR,
		};
	}
}
