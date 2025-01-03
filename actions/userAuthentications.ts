'use server';

import { api } from '@/convex/_generated/api';
import { STATUS_CODES } from '@/lib/statusCodes';
import { convex } from '@/lib/utils';

export async function registerUser(
	clerk_id: string,
	user_name: string,
	user_email: string,
	user_profile_image_url: string
) {
	console.log(`regestering>>> ${clerk_id}`);
	const response = await convex.mutation(api.users.RegisterNewUser, {
		clerk_id,
		user_email,
		user_name,
		user_profile_image_url,
	});
	if (response.status === STATUS_CODES.CREATED) {
		console.log('✅ User registered successfully');
		console.log(response.message);
	} else {
		console.log('❌ User not registered');
		console.log(response.message);
	}
}
