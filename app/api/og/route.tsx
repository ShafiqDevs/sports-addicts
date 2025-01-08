import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const title = searchParams.get('title') || 'Sports Addicts';

	return new ImageResponse(
		(
			<div
				style={{
					height: '100%',
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: '#000',
					fontFamily: 'system-ui',
				}}>
				<div
					style={{
						marginTop: 40,
						display: 'flex',
						alignItems: 'center',
					}}>
					{/* You can replace this with your actual logo */}
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='124'
						height='124'
						viewBox='0 0 24 24'
						fill='none'
						stroke='#22C55E'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<circle
							cx='12'
							cy='12'
							r='10'
						/>
						<path d='M8 14s1.5 2 4 2 4-2 4-2' />
						<line
							x1='9'
							y1='9'
							x2='9.01'
							y2='9'
						/>
						<line
							x1='15'
							y1='9'
							x2='15.01'
							y2='9'
						/>
					</svg>
				</div>
				<div
					style={{
						marginTop: 20,
						fontSize: 60,
						fontWeight: 800,
						letterSpacing: '-0.05em',
						color: '#FFFFFF',
						lineHeight: 1.2,
						textAlign: 'center',
						padding: '0 20px',
					}}>
					{title}
				</div>
				<div
					style={{
						marginTop: 20,
						fontSize: 30,
						color: '#22C55E',
						lineHeight: 1.4,
						textAlign: 'center',
					}}>
					Book Your Perfect Football Pitch
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
