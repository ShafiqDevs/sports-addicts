'use server';

import { api } from '@/convex/_generated/api';
import { convex } from '@/lib/utils';



export async function registerUser(clerk_id: string) {
	console.log(`regestering>>> ${clerk_id}`);
	await convex.mutation(api.users.RegisterNewUser, {
		clerk_id,
	});
}
