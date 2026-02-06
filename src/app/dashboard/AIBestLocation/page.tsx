'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AiBestLocationHeader } from './components/ai-best-location-header';

import type { RecoApiResponse, RecoRequestBody } from '@/types/AIBestLocation/reco';
import { postReco } from './lib/api';

import LeftPanel from './components/panel/left-panel';
import RightPanel from './components/panel/right-panel';
import { Container } from "@mui/material";

export default function Page(): React.JSX.Element {
  const HEADER_HEIGHT = 64; // 상단 헤더 높이
  const MAP_HEIGHT = 500;   // 지도 높이

  const [request, setRequest] = React.useState<RecoRequestBody>({
    target_count: 3,
    target_region_gu: '',
    target_region_dong: '',
    reco_loc_type_cd: 1, // 1: 취약계층
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<RecoApiResponse | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const res = await postReco(request);
      const isEmpty =
        !res?.success ||
        !res?.data ||
        !Array.isArray(res.data.result) ||
        res.data.result.length === 0;

      if (isEmpty) {
        alert('현재 추천할 수 있는 쿨링포그 설치 지역이 없습니다.\n' +
          '조건을 변경하거나 다른 지역을 선택해 주세요.');
        return;
      }

      setData(res);
    } catch {
      alert('요청에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
		<Container maxWidth="lg" sx={{ py: 1 }}>
      <AiBestLocationHeader />
      <Stack spacing={2} sx={{ mt: 4 }}>
        <Box
          sx={{
            position: "sticky",
            top: `${HEADER_HEIGHT + 12}px`,
            alignSelf: "flex-start",
            zIndex: 10,
            width: "100%",
            flex: "0 0 auto",
          }}
        >
          <LeftPanel
            headerHeight={HEADER_HEIGHT}
            value={request}
            onChangeAction={(next) => setRequest((prev) => ({ ...prev, ...next }))}
            onSubmitAction={handleSubmit}
            isLoading={isLoading}
          />
        </Box>

        {/* RIGHT */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <RightPanel
            mapHeight={MAP_HEIGHT}
            isLoading={isLoading}
            request={request}
            data={data}
          />
        </Box>
			</Stack>
		</Container>
  );
}
