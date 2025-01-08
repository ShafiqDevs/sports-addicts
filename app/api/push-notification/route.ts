import { sendNotification } from '@/actions/userPushNotifications';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
	console.log(`🐕‍🦺 server GET REQUEST`);
	return NextResponse.json(
		{ message: 'hello', data: null },
		{ status: 200, headers: { 'Content-Type': 'application/json' } }
	);
}
export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const { user_id, title, body } = data;
		console.log(`🐕‍🦺 server GET REQUEST>>`, title);

		const response = await sendNotification(
			user_id,
			JSON.stringify({ title, body })
		);

		return NextResponse.json(
			{ message: 'push notification sent', data: null },
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
