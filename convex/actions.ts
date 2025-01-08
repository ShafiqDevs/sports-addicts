'use node';
import { v } from 'convex/values';
import { action } from './_generated/server';
import { internal } from './_generated/api';
import axios from 'axios';
import {
	internalCall_sendNotification,
	sendNotification,
} from '@/actions/userPushNotifications';
import { ROUTES } from '@/lib/routes';

export const sendNotificationFromConvex = action({
	args: {
		user_id: v.id('users'),
		notification: v.object({ title: v.string(), body: v.string() }),
	},
	handler: async (ctx, { user_id, notification }) => {
		try {
			const response = await axios.post(
				`https://sports-addicts.vercel.app/api/push-notification`,
				{
					user_id: user_id,
					title: notification.title,
					body: notification.body,
				}
			);
			console.log('Notification sent successfully:', response.data);
			return {
				message: 'Notification sent successfully',
				data: response.data,
				status: 200,
			};
		} catch (error) {
			console.error('Error sending notification:', error);
			return {
				message: 'Error sending notification',
				data: null,
				status: 500,
			};
		}

		// const response = await internalCall_sendNotification(
		// 	user_id,
		// 	JSON.stringify({
		// 		title: notification.title,
		// 		message: notification.body,
		// 		icon: '/favicon.ico',
		// 	})
		// );
	},
});
