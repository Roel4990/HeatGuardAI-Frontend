"use client";

import { useMemo, useState } from "react";
import { DISTRICTS, getDongsByDistrict } from "@/app/dashboard/data/selectors";
import { Box, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";

import { DashboardSectionCard } from "./DashboardSectionCard";
import { HOTLINE_CONTACTS } from "@/app/dashboard/data/hotlineData";


export function HeatRiskHotline() {
	const [district, setDistrict] = useState("");
	const [dong, setDong] = useState("");

	const dongs = useMemo(() => getDongsByDistrict(district), [district]);

	const results = useMemo(() => {
		return HOTLINE_CONTACTS.filter((c) => {
			if (!district) return false;
			if (district && dong) {
				return c.district === district && c.dong === dong;
			}
			return c.district === district;
		});
	}, [district, dong]);

	return (
		<DashboardSectionCard title="폭염 위험 핫라인">
			<Stack spacing={2}>
				<Stack direction={{ xs: "column", md: "row" }} spacing={2}>
					<TextField
						select
						label="구 선택"
						fullWidth
						size="small"
						value={district}
						onChange={(e) => {
							setDistrict(e.target.value);
							setDong("");
						}}
					>
						{DISTRICTS.map((d) => (
							<MenuItem key={d} value={d}>
								{d}
							</MenuItem>
						))}
					</TextField>

					<TextField
						select
						label="동 선택 (선택)"
						fullWidth
						size="small"
						value={dong}
						disabled={!district}
						onChange={(e) => setDong(e.target.value)}
					>
						<MenuItem value="">전체</MenuItem>
						{dongs.map((d) => (
							<MenuItem key={d} value={d}>
								{d}
							</MenuItem>
						))}
					</TextField>
				</Stack>

				<Divider />
				{results.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						지역을 선택하면 담당자 정보가 표시됩니다.
					</Typography>
				) : (
					<Stack spacing={1.5}>
						{results.map((item, idx) => (
							<Box
								key={idx}
								sx={{
									p: 2,
									borderRadius: 2,
									border: "1px solid #e5e7eb",
									backgroundColor: "#fff",
								}}
							>
								<Typography fontWeight={600}>{item.department}</Typography>
								<Typography variant="body2">담당자: {item.officer}</Typography>
								<Typography variant="body2" color="primary">
									☎ {item.phone}
								</Typography>
							</Box>
						))}
					</Stack>
				)}
			</Stack>
		</DashboardSectionCard>
	);
}
