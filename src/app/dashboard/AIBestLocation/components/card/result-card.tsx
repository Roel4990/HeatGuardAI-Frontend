'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import ThermostatOutlinedIcon from '@mui/icons-material/ThermostatOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ParkOutlinedIcon from '@mui/icons-material/ParkOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';

import type { RecoLocItem } from '@/types/AIBestLocation/reco';

const formatNumber = (n?: number | null) =>
  typeof n === 'number' ? n.toLocaleString('ko-KR') : '-';

function popuColor(level?: string) {
  switch (level) {
    case '높음':
    case '많음':
      return { bgcolor: '#ffebee', color: '#c62828' };
    case '보통':
      return { bgcolor: '#e3f2fd', color: '#1565c0' };
    case '낮음':
    case '적음':
      return { bgcolor: '#e8f5e9', color: '#2e7d32' };
    default:
      return { bgcolor: '#f5f5f5', color: '#616161' };
  }
}

function levelColor(level?: string) {
  switch (level) {
    case '높음':
      return { bgcolor: '#e8f5e9', color: '#2e7d32' };
    case '보통':
      return { bgcolor: '#e3f2fd', color: '#1565c0' };
    case '낮음':
      return { bgcolor: '#ffebee', color: '#c62828' };
    default:
      return { bgcolor: '#f5f5f5', color: '#616161' };
  }
}

function lstLevelColor(level?: string) {
  switch (level) {
    case '높음':
      return { bgcolor: '#ffebee', color: '#c62828' };
    case '보통':
      return { bgcolor: '#e3f2fd', color: '#1565c0' };
    case '낮음':
      return { bgcolor: '#e8f5e9', color: '#2e7d32' };
    default:
      return { bgcolor: '#f5f5f5', color: '#616161' };
  }
}

export default function ResultCard({
  item,
  onFocus,
  displayRank,
}: {
  item: RecoLocItem;
  onFocus?: () => void;
  displayRank: number;
}): React.JSX.Element {
  const ndviLabel = item.reco_loc_ndvi_level ?? '-';
  const ndviChipStyle = levelColor(item.reco_loc_ndvi_level);

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        borderRadius: 2,
        p: 2.5,
        background: 'linear-gradient(180deg, #f7fbff 0%, #ffffff 40%)',
        boxShadow: '0 6px 16px rgba(16, 75, 120, 0.12)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 상단 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={`${displayRank}순위`}
            icon={<ReportProblemOutlinedIcon sx={{ color: 'white' }} />}
            sx={{ bgcolor: '#4A60DD', color: 'white', fontWeight: 900, borderRadius: 1.5 }}
          />
          <Box
            sx={{
              px: 1.75,
              py: 0.5,
              borderRadius: 999,
              bgcolor: '#0f2a3a',
              color: 'white',
              fontSize: 12,
              fontWeight: 800,
              lineHeight: 1.4,
            }}
          >
            AI 추천
          </Box>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          startIcon={<MyLocationOutlinedIcon />}
          onClick={onFocus}
          disabled={!onFocus}
          sx={{ borderRadius: 999 }}
        >
          지도 위치 보기
        </Button>
      </Box>

      {/* 주소 + 종합점수 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mt: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <LocationOnOutlinedIcon sx={{ color: '#1565c0' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {item.gee_address_full ?? '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatNumber(item.lat)}, {formatNumber(item.lng)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" fontWeight={900} sx={{ color: '#0f2a3a', whiteSpace: 'nowrap' }}>
          종합점수 {formatNumber(item.reco_loc_total_score)}점
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 추천 지표 */}
      <Box
        sx={{
          mt: 0.5,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 0.5fr' },
          gap: 1.25,
          mb: 2,
        }}
      >
        <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: '#f5f7fb' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#fde8e3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
              }}
            >
              <ThermostatOutlinedIcon sx={{ fontSize: 20, color: '#d84315' }} />
            </Box>
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  체감온도
                </Typography>
                <Typography fontWeight={900} sx={{ mt: 0.25 }}>
                  {formatNumber(item.reco_loc_feel_temp)}°C
                </Typography>
              </Box>
              <Box sx={{ minWidth: 0, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  지표면온도
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  <Chip
                    label={item.reco_loc_lst_level ?? '-'}
                    size="small"
                    sx={{ ...lstLevelColor(item.reco_loc_lst_level), fontWeight: 800 }}
                  />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: '#f5f7fb' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#e8eefc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
              }}
            >
              <GroupsOutlinedIcon sx={{ fontSize: 20, color: '#546e7a' }} />
            </Box>
            <Box
              sx={{
                minWidth: 0,
                flex: 1,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  유동인구
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  <Chip
                    label={item.reco_loc_popu_level ?? '-'}
                    size="small"
                    sx={{ ...popuColor(item.reco_loc_popu_level), fontWeight: 800 }}
                  />
                </Box>
              </Box>
              <Box sx={{ minWidth: 0, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  취약계층
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  <Chip
                    label={item.reco_loc_vulnerable_level ?? '-'}
                    size="small"
                    sx={{ ...popuColor(item.reco_loc_vulnerable_level), fontWeight: 800 }}
                  />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: '#f5f7fb' }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: '#e7f5ec',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '0 0 auto',
              }}
            >
              <ParkOutlinedIcon sx={{ fontSize: 20, color: '#2e7d32' }} />
            </Box>
            <Box sx={{ minWidth: 0, textAlign: 'center', flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                자연공간
              </Typography>
              <Box sx={{ mt: 0.25 }}>
                <Chip
                  label={ndviLabel ?? '-'}
                  size="small"
                  sx={{
                    bgcolor: ndviChipStyle.bgcolor,
                    color: ndviChipStyle.color,
                    fontWeight: 800,
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* 추천 사유 */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          border: '1px solid #e6eef7',
          borderRadius: 2,
          p: 2,
          flex: 1,
          minHeight: 0,
        }}
      >
        <Typography sx={{ fontWeight: 900, color: '#1565c0', mb: 1 }}>
          AI 추천 사유
        </Typography>

        <Stack spacing={0.75}>
          {(() => {
            const base =
              item.reco_loc_desc && item.reco_loc_desc.length > 0
                ? item.reco_loc_desc
                : ['추천 사유 데이터가 없습니다'];
            const padded = [...base];
            while (padded.length < 4) padded.push('');
            return padded.slice(0, 4);
          })().map((text, idx) => (
            <Stack
              key={`${idx}-${text}`}
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{ opacity: text ? 1 : 0 }}
            >
              <CheckCircleOutlineIcon sx={{ color: '#1565c0', fontSize: 18, mt: '2px' }} />
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {text}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
