import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
			.withIndex('byClerkId')
			.first();
		if (user) return;
		// create new user record in the database
		await ctx.db.insert('users', {
			clerk_id,
			user_email,
			user_name,
			user_profile_image_url,
		});
	},
});
