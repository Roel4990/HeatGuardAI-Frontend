'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function LoadingOverlay() {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(255,255,255,0.75)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        zIndex: 20,
        backdropFilter: 'blur(2px)',
        borderRadius: 2,
      }}
    >
      <CircularProgress />
      <Typography sx={{ fontWeight: 900 }}>추천 위치를 분석 중입니다…</Typography>
      <Typography variant="body2" color="text.secondary">
        기온 · 유동인구 · 취약지표를 종합해 후보지를 정렬하고 있어요
      </Typography>
    </Box>
  );
}
