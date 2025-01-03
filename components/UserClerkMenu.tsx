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


type Props = {};

function UserClerkMenu({}: Props) {

	return (
		<div className=' flex justify-center items-center w-fit h-fit'>
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
