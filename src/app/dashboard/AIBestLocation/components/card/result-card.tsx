'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import type { RecoLocItem } from '../../../../../types/AIBestLocation/reco';

const formatNumber = (n: number) => n.toLocaleString('ko-KR');

export default function ResultCard({ item }: { item: RecoLocItem }): React.JSX.Element {
  return (
    <Card sx={{ borderRadius: 2, border: '1px solid #eee', overflow: 'hidden' }}>
      <CardContent sx={{ p: 2.5 }}>
        {/* 상단 헤더 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={`${item.reco_loc_rank}위`}
              sx={{ bgcolor: '#f57c00', color: 'white', fontWeight: 900, borderRadius: 1.5 }}
            />
            <Chip
              label="AI 추천"
              variant="outlined"
              sx={{ borderColor: '#90caf9', color: '#1e88e5', fontWeight: 800 }}
            />
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              일 유동인구
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 900 }}>
              {formatNumber(item.float_popu)}명
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              취약성 지수
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 900 }}>
              {formatNumber(item.reco_loc_risk)}점
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 추천 사유 */}
        <Box sx={{ bgcolor: '#f7fbff', border: '1px solid #d6e9ff', borderRadius: 2, p: 2 }}>
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
      </CardContent>
    </Card>
  );
}
