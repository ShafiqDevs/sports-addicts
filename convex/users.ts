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

export const GetUserById = query({
	args: { id: v.id('users') },
	handler: async (ctx, { id }) => {
		return await ctx.db
			.query('users')
			.filter((q) => q.eq(q.field('_id'), id))
			.first();
	},
});

export const getUserByAuthId = query({
	args: { auth_id: v.string() },
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
