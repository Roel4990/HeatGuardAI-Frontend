'use client';

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

interface HeaderProps {
	onLoginClick: () => void;
	onTestClick: () => void;
	showAuthButtons?: boolean;
}

export function Header({ onLoginClick, onTestClick, showAuthButtons = true }: HeaderProps): React.JSX.Element {
	return (
		<AppBar
			position="sticky"
			elevation={0}
			sx={{
				borderBottom: '1px solid',
				borderColor: 'divider',
				bgcolor: 'rgba(255, 255, 255, 0.9)',
				backdropFilter: 'blur(10px)',
			}}
		>
			<Container maxWidth="lg">
				<Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between', height: 64 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
						<Box
							component="img"
							src="/assets/heatguardLogo.svg"
							alt="HeatGuard"
							sx={{ width: 48, height: 48 }}
						/>
						<Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'block' }}>
							HeatGuard
						</Typography>
					</Box>

					{showAuthButtons && (
						<Box sx={{ display: 'flex', gap: 1.5 }}>
							<Button
								variant="outlined"
								size="small"
								onClick={onLoginClick}
								sx={{
									textTransform: 'none',
									borderColor: 'primary.light',
									'&:hover': { borderColor: 'primary.main', color: 'primary.main' },
								}}
							>
								로그인
							</Button>
							<Button
								size="small"
								onClick={onTestClick}
								sx={{
									textTransform: 'none',
									color: '#fff',
									background: 'linear-gradient(90deg, #4A60DD)',
									'&:hover': { background: 'linear-gradient(90deg, #050FCD)' },
								}}
							>
								테스트
							</Button>
						</Box>
					)}
				</Toolbar>
			</Container>
		</AppBar>
	);
}
