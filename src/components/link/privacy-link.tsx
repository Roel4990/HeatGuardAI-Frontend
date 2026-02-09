"use client";

import * as React from "react";
import Link from "@mui/material/Link";
import { openPopup } from "@/lib/open-popup"; // 경로는 프로젝트에 맞게 조정

const PRIVACY_URL = process.env.NEXT_PUBLIC_PRIVACY_URL ?? "";

export function PrivacyLink(): React.JSX.Element {
  const handleOpen = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openPopup(PRIVACY_URL, "privacy");
  };

  return (
    <Link
      href={PRIVACY_URL || "#"}
      onClick={PRIVACY_URL ? handleOpen : undefined}
      underline="hover"
      color="text.secondary"
      variant="body2"
      sx={{ fontWeight: 600 }}
      aria-disabled={!PRIVACY_URL}
      tabIndex={PRIVACY_URL ? 0 : -1}
    >
      개인정보 처리방침
    </Link>
  );
}
