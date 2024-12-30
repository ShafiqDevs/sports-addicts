'use server';

import { api } from '@/convex/_generated/api';
import { convex } from '@/lib/utils';

export async function registerUser(
	clerk_id: string,
	user_name: string,
	user_email: string,
	user_profile_image_url: string
) {
	console.log(`regestering>>> ${clerk_id}`);
	await convex.mutation(api.users.RegisterNewUser, {
		clerk_id,
		user_email,
		user_name,
		user_profile_image_url,
	});
}
