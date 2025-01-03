'use client';
import { registerUser } from '@/actions/userAuthentications';
import { useUser } from '@clerk/nextjs';
import React, { useEffect } from 'react';

type Props = {};

export default function SyncUserWithConvex({}: Props) {
	const { user, isSignedIn, isLoaded } = useUser();
	useEffect(() => {
		if (!user) return;

		const syncUser = async () => {
			try {
				await registerUser(
					user.id,
					user.username ||
						user.firstName ||
						user.lastName ||
						user.fullName ||
						'',
					user.primaryEmailAddress?.emailAddress ||
						user.emailAddresses[0].emailAddress,
					user.imageUrl
				);
			} catch (error) {
				console.error('Error syncing User:', error);
			}
		};
		syncUser();
	}, [user, isSignedIn, isLoaded]);

	return <></>;
}
