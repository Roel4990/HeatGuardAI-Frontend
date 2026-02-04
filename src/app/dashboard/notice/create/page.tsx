'use client';

import * as React from 'react';
import { NoticeCreateForm } from "@/app/dashboard/notice/create/components/NoticeCreateForm";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { NoticeCreateHeader } from "@/app/dashboard/notice/create/components/NoticeCreateHeader";
import { Paper } from "@mui/material";

export default function Page(): React.JSX.Element {
  return (
		<Box sx={{ minHeight: '100vh'}}>
			<Container maxWidth="lg">
				<NoticeCreateHeader />
				<Paper>
					<NoticeCreateForm />
				</Paper>
			</Container>
		</Box>
  );
}
