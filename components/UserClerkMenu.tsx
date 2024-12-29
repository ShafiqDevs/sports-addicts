'use client';
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useUser,
} from '@clerk/nextjs';
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { registerUser } from '@/actions/userAuthentications';

type Props = {};

function UserClerkMenu({}: Props) {
	const { user, isSignedIn, isLoaded } = useUser();
	useEffect(() => {
		if (user && isSignedIn) {
			registerUser(user.id);
		}
	}, [user, isSignedIn, isLoaded]);

	return (
		<div>
			<SignedOut>
				<Button asChild>
					<SignInButton />
				</Button>
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
		</div>
	);
}

export default UserClerkMenu;
