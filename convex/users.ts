import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { STATUS_CODES } from '@/lib/statusCodes';
import { NotificationSubscriptionObject } from '@/lib/types';

export const RegisterNewUser = mutation({
	args: {
		clerk_id: v.string(),
		user_name: v.string(),
		user_email: v.string(),
		user_profile_image_url: v.string(),
	},
	handler: async (
		ctx,
		{ clerk_id, user_email, user_profile_image_url, user_name }
	) => {
		// check if user already exists
		const user = await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('clerk_id'), clerk_id))
			.first();
		if (user)
			return {
				message: 'User already exists',
				data: null,
				status: STATUS_CODES.CONFLICT,
			};
		// create new user record in the database
		const user_id = await ctx.db.insert('users', {
			clerk_id,
			user_email,
			user_name,
			user_profile_image_url,
			push_notification_subscriptions: [],
		});
		if (user_id)
			return {
				message: 'User registered successfully',
				data: user_id,
				status: STATUS_CODES.CREATED,
			};
		else {
			return {
				message: 'User not registered',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const GetUserById = query({
	args: { id: v.id('users') },
	handler: async (ctx, { id }) => {
		return await ctx.db.get(id);
	},
});

export const getUserByAuthId = query({
	args: { auth_id: v.optional(v.string()) },
	handler: async (ctx, { auth_id }) => {
		return await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('clerk_id'), auth_id))
			.first();
	},
});

export const getUsersById = query({
	args: { ids: v.array(v.id('users')) },
	handler: async (ctx, { ids }) => {
		const users = await Promise.all(ids.map((id) => ctx.db.get(id)));
		return users ? users : null;
	},
});

export const getNotificationSubSettings = query({
	args: {
		user_id: v.optional(v.id('users')),
	},
	handler: async (ctx, { user_id }) => {
		if (!user_id) {
			return {
				message: 'User not found',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}
		const user = await ctx.db.get(user_id);
		if (!user) {
			return {
				message: 'User not found',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}

		// [
		// 	{
		// 		FDMmKZiN5X3wwuKdwhMjVg:
		// 			'{"endpoint":"https://fcm.googleapis.com/fcm/send/fntvMk9u3Ww:APA91bG8IvljFG0SpPgiYCXDCngJxs7xEt2vufs-it_1ZjYdShYHTci6zXRQxr0bBdeClTBAM3pLEDPPyu4iWLXieLmOdW6wgcZAPAn_jLK1Djms4Pr-RzMsaBADcR_FL8Fpu4NS2s4Q","expirationTime":null,"keys":{"p256dh":"BFKZDfj_VHzyBJMjUmbxGY1yo-pqhD8m-Ts1SbjQQfH1imNiAuXOawsauO8hUQ_4Zr27AsYYJSRJ8yO8jIw6EgI","auth":"FDMmKZiN5X3wwuKdwhMjVg"}}',
		// 	},
		// ];

		const subscriptions_stringFormat =
			user.push_notification_subscriptions;

		return {
			message: 'Subscription fetched successfully',
			data: subscriptions_stringFormat,
			status: STATUS_CODES.OK,
		};
	},
});

export const registerNotificationSubscription = mutation({
	args: {
		user_id: v.id('users'),
		subscription: v.string(),
		sub_Keys_auth: v.string(),
	},
	handler: async (ctx, { user_id, subscription, sub_Keys_auth }) => {
		const user = await ctx.db.get(user_id);
		if (!user) {
			return {
				message: 'User not found',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}
		// we get this from db
		const subscriptions_stringFormat =
			user.push_notification_subscriptions;
		// we convert to object format
		const subscriptions_ObjFormat: NotificationSubscriptionObject[] =
			subscriptions_stringFormat.map((item) => JSON.parse(item));
		// check if subscription already exists
		const newSubscription = subscriptions_ObjFormat.find(
			(item) => item[sub_Keys_auth]
		);
		if (newSubscription) {
			return {
				message: 'Subscription already registered',
				data: null,
				status: STATUS_CODES.CONFLICT,
			};
		}
		// add new subscription to the list
		subscriptions_stringFormat.push(subscription);

		try {
			await ctx.db.patch(user_id, {
				push_notification_subscriptions: subscriptions_stringFormat,
			});
			return {
				message: 'Subscription registered successfully',
				data: null,
				status: STATUS_CODES.CREATED,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Subscription not registered',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

export const unregisterNotificationSubscription = mutation({
	args: { user_id: v.id('users'), sub_Keys_auth: v.string() },
	handler: async (ctx, { user_id, sub_Keys_auth }) => {
		const user = await ctx.db.get(user_id);
		if (!user) {
			return {
				message: 'User not found',
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}

		[
			'{"DYvXuAUKiSi-YIrnaScL4w":{"endpoint":"https://fcm.googleapis.com/fcm/send/dDEWDkbh22w:APA91bGse8r8WVH053HOxg-oFscA_sxmW_yta5O_qXKhBrJWHSwEX30_WU8AEMTfWFFq_6CFh4opHpnQp9vslIi_uyJdLgbfXHdML1a6P-UzbHIoru24eEZA30azsKv8jUHb0I7XQDsQ","expirationTime":null,"keys":{"p256dh":"BPdU8hvr9zz8rf0AOqUCQuO342udugriv0UQAAGIdrT4Xd8rgVK-Gr0hiPWG3Lc6zQEdXnUQ1VtQgnW7MFYrMNY","auth":"DYvXuAUKiSi-YIrnaScL4w"}}}',

			'{"UoUbNMtNHMVx-SVhUuF1Nw":{"endpoint":"https://web.push.apple.com/QIbeS49CEFtTO4vRw6nGZML5DGqtAGYX2WeZ2uP0aTlP52FvJVRwyp_PlrjXMoVGx0Rr4DwNbwCWdZw9dtZoO9GDfJ5e3-bEQ6BqS1DeekwtXLKtD8Bs3PeWFizKn6OfPbGCrezJ391ACtV9Ufa-OMBhnxIZpLVevo67xwyCPcs","keys":{"p256dh":"BC26RUE_g6xTVcmphw-GHAbMU1hRBVzwqtO7z33CE_pCc5fzRGzq3sa0vRWKxp8woSR3x0GlggYW0o420_H4GmA","auth":"UoUbNMtNHMVx-SVhUuF1Nw"}}}',
		];

		// we get this from db
		const subscriptions_stringFormat =
			user.push_notification_subscriptions;
		// we convert to object format
		const subscriptions_ObjFormat: NotificationSubscriptionObject[] =
			subscriptions_stringFormat.map((item) => JSON.parse(item));
		// check if subscription already exists
		const existingSubscription = subscriptions_ObjFormat.find(
			(sub) => sub[sub_Keys_auth]
		);

		if (!existingSubscription) {
			return {
				message: `Subscription with ${sub_Keys_auth} not found`,
				data: null,
				status: STATUS_CODES.NOT_FOUND,
			};
		}

		try {
			const newSubscriptionsList = subscriptions_ObjFormat.filter(
				(sub) =>
					sub[sub_Keys_auth] !== existingSubscription[sub_Keys_auth]
			);
			await ctx.db.patch(user_id, {
				push_notification_subscriptions: newSubscriptionsList.map(
					(sub) => JSON.stringify(sub)
				),
			});
			return {
				message: 'Subscription unregistered successfully',
				data: null,
				status: STATUS_CODES.OK,
			};
		} catch (error) {
			console.log(error);
			return {
				message: 'Subscription not unregistered',
				data: null,
				status: STATUS_CODES.INTERNAL_SERVER_ERROR,
			};
		}
	},
});

// [
// 	{
// 		"FDMmKZiN5X3wwuKdwhMjVg": {
// 			endpoint: "https://fcm.googleapis.com/fcm/send/fntvMk9u3Ww:APA91bG8IvljFG0SpPgiYCXDCngJxs7xEt2vufs-it_1ZjYdShYHTci6zXRQxr0bBdeClTBAM3pLEDPPyu4iWLXieLmOdW6wgcZAPAn_jLK1Djms4Pr-RzMsaBADcR_FL8Fpu4NS2s4Q",
// 			expirationTime: null,
// 			keys: {
// 				p256dh: "BFKZDfj_VHzyBJMjUmbxGY1yo-pqhD8m-Ts1SbjQQfH1imNiAuXOawsauO8hUQ_4Zr27AsYYJSRJ8yO8jIw6EgI",
// 				auth: "FDMmKZiN5X3wwuKdwhMjVg"
// 			}
// 		}
// 	}
// ];
