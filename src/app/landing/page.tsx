'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Header } from './components/Header';
import { FeatureCard } from './components/FeatureCard';
import { paths } from '@/paths';
import { HouseSimpleIcon } from '@phosphor-icons/react/dist/ssr/HouseSimple';
import { AirTrafficControlIcon } from '@phosphor-icons/react/dist/ssr/AirTrafficControl';
import { BrainIcon } from '@phosphor-icons/react/dist/ssr/Brain';
import { CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';

import { MainFooter } from '@/components/dashboard/layout/main-footer';
import { useUser } from '@/hooks/use-user';

export default function Landing(): React.JSX.Element {
	const router = useRouter();
	const { checkSession } = useUser();

	const features = [
		{ icon: HouseSimpleIcon, title: '대시보드', description: '지역별 폭염 위험·취약도 지표를 한 화면에서 제공합니다.' },
		{ icon: AirTrafficControlIcon, title: '실시간 관제', description: '쿨링포그 운영 현황을 실시간으로 수집·관리합니다.' },
		{ icon: BrainIcon, title: 'AI 최적 위치', description: '효과·형평성을 고려한 설치 우선지역을 도출합니다.' },
		{ icon: CurrencyDollarIcon, title: '예산 시뮬레이션', description: '예산 시나리오를 분석해 최적의 투자 결정을 돕습니다.' },
	];

	const handleLogin = (): void => {
		router.push(paths.auth.signIn);
	};

	const handleTest = async (): Promise<void> => {
		const res = await fetch('/api/autoLogin', { method: 'POST' });
		const data = await res.json();
		console.log('autoLogin response', data);

		if (!data?.success || !data?.data?.access_token) {
			alert(data?.error ?? '자동 로그인 실패');
			return;
		}

		localStorage.setItem('access_token', data.data.access_token);
		localStorage.setItem('user_auth', data.data.user_auth);
		localStorage.setItem('user_nm', data.data.user_nm);
		localStorage.setItem('user_email', data.data.user_email);
		localStorage.setItem('user_cd', data.data.user_cd);

		await checkSession?.();
		router.push('/dashboard');
	};

	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			<Header onLoginClick={handleLogin} onTestClick={handleTest} />

			<Box component="section" sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 8, md: 14 }, pb: { xs: 12, md: 18 } }}>
				<Box
					sx={{
						position: 'absolute',
						inset: 0,
						zIndex: 0,
						'&::before': {
							content: '""',
							position: 'absolute',
							top: -80,
							right: -40,
							width: 360,
							height: 360,
							background: '#DBEAFE',
							borderRadius: '50%',
							filter: 'blur(48px)',
							opacity: 0.6,
						},
						'&::after': {
							content: '""',
							position: 'absolute',
							bottom: -80,
							left: -40,
							width: 360,
							height: 360,
							background: '#EFF6FF',
							borderRadius: '50%',
							filter: 'blur(48px)',
							opacity: 0.6,
						},
					}}
				/>
				<Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
					<Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
						<Stack spacing={3} sx={{ flex: 1 }}>
							<Typography variant="h1" fontWeight={800} color="text.primary" >
								HeatGuard
							</Typography>
							<Typography variant="body1" color="text.secondary" sx={{ fontSize: 25, lineHeight: 1.8 }}>
								데이터로 위험을 찾고, AI로 도시 대응을 준비하세요.
							</Typography>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
								<Button
									onClick={handleLogin}
									variant="outlined"
									sx={{
										height: 48,
										px: 4,
										textTransform: 'none',
										color: '#4A60DD',
										borderColor: 'primary.light',
										'&:hover': { borderColor: 'primary.main', color: 'primary.main' },
									}}
								>
									로그인
								</Button>
								<Button
									onClick={handleTest}
									variant="outlined"
									sx={{
										height: 48,
										px: 4,
										textTransform: 'none',
										borderWidth: 2,
										color: '#fff',
										background: 'linear-gradient(90deg, #4A60DD)',
										'&:hover': { background: 'linear-gradient(90deg, #050FCD)' },
									}}
								>
									테스트
								</Button>
							</Stack>
						</Stack>

						<Box sx={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
							<Box
								sx={{
									position: 'relative',
									width: '100%',
									maxWidth: 800,
									borderRadius: 4,
									bgcolor: 'rgba(255,255,255,0.65)',
									boxShadow: `0 40px 90px rgba(15, 23, 42, 0.25), 0 20px 40px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(74, 96, 221, 0.08)`,
									overflow: 'hidden',
									p: 2,
								}}
							>
								<Box
									component="img"
									src="/assets/AIBestLocation.png"
									alt="AI 최적 위치"
									sx={{
										display: 'block',
										width: '100%',
										height: 'auto',
									}}
								/>
							</Box>
						</Box>
					</Stack>
				</Container>
			</Box>

			<Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(239, 246, 255, 0.4)' }}>
				<Container maxWidth="lg">
					<Stack spacing={2} alignItems="center" sx={{ mb: 6 }}>
						<Typography variant="h2" fontWeight={800}>
							핵심 기능
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ fontSize: 25 }}>
							HeatGuard의 주요 기능을 확인하세요
						</Typography>
					</Stack>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
							gap: 3,
							maxWidth: 1200,
							mx: 'auto',
						}}
					>
						{features.map((feature, index) => (
							<FeatureCard key={feature.title} {...feature} index={index} />
						))}
					</Box>
				</Container>
			</Box>

			<Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
				<Container maxWidth="lg">
					<Box
						sx={{
							p: { xs: 4, md: 6 },
							borderRadius: 4,
							textAlign: 'center',
							color: '#fff',
							background: 'linear-gradient(90deg, #526CFF)',
							boxShadow: '0 18px 40px rgba(37, 99, 235, 0.2)',
						}}
					>
						<Stack spacing={2}>
							<Typography variant="h4" fontWeight={800}>
								지금 시작하세요
							</Typography>
							<Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
								데이터 기반 쿨링포그 최적 위치 추천을 바로 경험해보세요
							</Typography>
							<Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
								<Button
									onClick={handleLogin}
									sx={{
										height: 48,
										px: 4,
										textTransform: 'none',
										bgcolor: '#fff',
										color: '#4A60DD',
										'&:hover': { bgcolor: '#EFF6FF' },
									}}
								>
									로그인
								</Button>
								<Button
									onClick={handleTest}
									sx={{
										height: 48,
										px: 4,
										textTransform: 'none',
										bgcolor: '#4A60DD',
										color: '#fff',
										'&:hover': { bgcolor: '#050FCD' },
									}}
								>
									테스트
								</Button>
							</Stack>
						</Stack>
					</Box>
				</Container>
			</Box>
			<MainFooter fullWidth />
		</Box>
	);
}
