'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import type { RecoLocItem } from '@/types/AIBestLocation/reco';

const formatNumber = (n: number) => n.toLocaleString('ko-KR');

export default function ResultCard({ item }: { item: RecoLocItem }): React.JSX.Element {
  return (
    <Paper variant="outlined" sx={{
      width: '420px',
      height: '100%',
      borderRadius: 2,
      p: 2.5,
      background: 'linear-gradient(90deg, #27C1C3 0%, #4ED6B8 100%)',
      boxShadow: '0 4px 12px rgba(39, 193, 195, 0.35)', }}>
        {/* 상단 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${item.reco_loc_rank}위`}
              sx={{ bgcolor: '#4A60DD', color: 'white', fontWeight: 900, borderRadius: 1.5 }}
            />
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 1,
                background: 'linear-gradient(90deg, #0B1220 0%, #0F2A3A 15%, #123B4D 100%)',
                color: "white",
                fontWeight: 450,
                borderRadius: 3, // ✅ 모서리
                lineHeight: 1,
              }}
            >
              AI 추천
            </Box>
          </Box>

          {item.reco_loc_tag ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
              {item.reco_loc_tag}
            </Typography>
          ) : null}
        </Box>

        {/* 타이틀 */}
        <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 900 }}>
          {item.gee_loc_adress}
        </Typography>

        {/* 요약 지표 (Grid 대신 CSS Grid) */}
        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 1.5,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary" fontWeight={700}>일 유동인구</Typography>
            <Typography fontWeight={900}>{formatNumber(item.float_popu)}명</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary" fontWeight={700}>취약성 지수</Typography>
            <Typography fontWeight={900}>{formatNumber(item.reco_loc_risk)}점</Typography>
          </Stack>

        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 추천 사유 */}
        <Box sx={{ bgcolor: '#f7fbff', border: '1px solid #d6e9ff', borderRadius: 2, p: 2, height: '57%' }}>
          <Typography sx={{ fontWeight: 900, color: '#1565c0', mb: 1 }}>
            AI 추천 사유
          </Typography>

          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {(item.reco_loc_desc && item.reco_loc_desc.length > 0
              ? item.reco_loc_desc
              : ['추천 사유 데이터가 없습니다']
            ).map((text) => (
              <Typography
                key={text}
                component="li"
                variant="body2"
                sx={{ mb: 0.5, color: 'text.primary', fontWeight: 600 }}
              >
                {text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Paper>
  );
}
