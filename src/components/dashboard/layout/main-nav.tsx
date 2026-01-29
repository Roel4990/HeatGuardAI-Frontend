"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DUMMY_NOTICES } from "@/app/dashboard/data/notification-data";
import { Divider, List, ListItemButton, Popover, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip"; // 이벤트
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { noticeTypeStyles } from "@/types/notice/notice";
import { usePopover } from "@/hooks/use-popover";
import { MobileNav } from "./mobile-nav";
import { UserPopover } from "./user-popover";

export function MainNav(): React.JSX.Element {
	const [openNav, setOpenNav] = React.useState<boolean>(false);
	const [noticeAnchorEl, setNoticeAnchorEl] = React.useState<null | HTMLElement>(null);
	const router = useRouter();
	const userPopover = usePopover<HTMLDivElement>();
	const openNotice = Boolean(noticeAnchorEl);

	return (
		<React.Fragment>
			<Box
				component="header"
				sx={{
					borderBottom: "1px solid var(--mui-palette-divider)",
					backgroundColor: "var(--mui-palette-background-paper)",
					position: "sticky",
					top: 0,
					zIndex: "var(--mui-zIndex-appBar)",
				}}
			>
				<Stack
					direction="row"
					spacing={2}
					sx={{ alignItems: "center", justifyContent: "space-between", minHeight: "64px", px: 2 }}
				>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						<IconButton
							onClick={(): void => {
								setOpenNav(true);
							}}
							sx={{ display: { lg: "none" } }}
						>
							<ListIcon />
						</IconButton>
					</Stack>
					<Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
						<IconButton onClick={(e) => setNoticeAnchorEl(e.currentTarget)}>
							<BellIcon />
						</IconButton>
						<Avatar
							onClick={userPopover.handleOpen}
							ref={userPopover.anchorRef}
							src="/profileImage.jpeg"
							sx={{ cursor: "pointer" }}
						/>
					</Stack>
				</Stack>
			</Box>

			<Popover
				open={openNotice}
				anchorEl={noticeAnchorEl}
				onClose={() => setNoticeAnchorEl(null)}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				PaperProps={{
					sx: {
						width: 320,
						borderRadius: 2,
						boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
					},
				}}
			>
				<Box sx={{ p: 1.5 }}>
					<Typography fontWeight={600} fontSize={14}>
						최근 공지
					</Typography>
				</Box>

				<Divider />

				<List disablePadding>
					{DUMMY_NOTICES.map((notice) => (
						<ListItemButton
							key={notice.notice_cd}
							onClick={() => {
								setNoticeAnchorEl(null);
								router.push(`/dashboard/notice/detail/${notice.notice_cd}`);
							}}
						>
							<Box
								display="flex"
								alignItems="center"
								gap={1}
								width="100%"
							>
								<Chip
									label={notice.notice_type}
									size="small"
									sx={{
										width: 65,
										flexShrink: 0,
										bgcolor: noticeTypeStyles[notice.notice_type].bg,
										color: noticeTypeStyles[notice.notice_type].fg,
										fontWeight: 600,
									}}
								/>

								<Typography
									fontWeight={600}
									noWrap
									sx={{
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
										flex: 1,
									}}
								>
									{notice.notice_title}
								</Typography>
							</Box>
						</ListItemButton>
					))}
				</List>
			</Popover>

			<UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
			<MobileNav
				onClose={() => {
					setOpenNav(false);
				}}
				open={openNav}
			/>
		</React.Fragment>
	);
}
