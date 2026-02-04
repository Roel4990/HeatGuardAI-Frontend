'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import type { RecoApiResponse, RecoRequestBody } from '../../types/reco';

import IdleState from '../states/idle-state';
import LoadingOverlay from '../states/loading-overlay';
import ResultView from '../states/result-view';

export default function RightPanel({
                                     mapHeight,
                                     isLoading,
                                     request,
                                     data,
                                   }: {
  mapHeight: number;
  isLoading: boolean;
  request: RecoRequestBody;
  data: RecoApiResponse | null;
}) {
  const hasResult =
    !!data?.success &&
    !!data.data &&
    Array.isArray(data.data.result) &&
    data.data.result.length > 0;

  return (
    <Box sx={{ flex: 7.3, minWidth: 0 }}>
      <Paper elevation={4} sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 2, p: 3 }}>
          {/* ✅ 처음(또는 새로고침)에는 Idle, 검색 후에는 Result */}
          {hasResult ? (
            <ResultView mapHeight={mapHeight} request={request} data={data!} />
          ) : (
            <IdleState />
          )}
          {/* ✅ 로딩은 overlay로 */}
          {isLoading && <LoadingOverlay />}
      </Paper>
    </Box>
  );
}
