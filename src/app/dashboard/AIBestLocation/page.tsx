'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AiBestLocationHeader } from './components/ai-best-location-header';

import type { RecoApiResponse, RecoRequestBody } from '@/types/AIBestLocation/reco';
import axios from "axios";
import { useAppAlert } from '@/components/core/alert-provider';

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
    reco_loc_type_cd: 0, // 0: 전체
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<RecoApiResponse | null>(null);
  const [submittedRequest, setSubmittedRequest] = React.useState<RecoRequestBody | null>(null);
  const [resultKey, setResultKey] = React.useState(0);
  const { showAlert } = useAppAlert();

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const res = await axios.post<RecoApiResponse>("/api/AIBestLocation/AILocation", request, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const payload = res.data;
      const isEmpty =
        !payload?.success ||
        !payload?.data ||
        !Array.isArray(payload.data.result) ||
        payload.data.result.length === 0;

      if (isEmpty) {
        showAlert({
          severity: 'warning',
          message: '현재 추천할 수 있는 쿨링포그 설치 지역이 없습니다. 조건을 변경하거나 다른 지역을 선택해 주세요.',
        });
        return;
      }

      setData(payload);
      setSubmittedRequest(request);
      setResultKey((k) => k + 1);
    } catch {
      showAlert({ severity: 'error', message: '요청에 실패했습니다.' });
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
            submittedRequest={submittedRequest}
            data={data}
            resultKey={resultKey}
          />
        </Box>
			</Stack>
		</Container>
  );
}
