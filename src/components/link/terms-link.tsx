"use client";

import * as React from "react";
import Link from "@mui/material/Link";
import { openPopup } from "@/lib/open-popup"; // 경로 조정

const TERMS_URL = process.env.NEXT_PUBLIC_TERMS_URL ?? "";

export function TermsLink(): React.JSX.Element {
  const handleOpen = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openPopup(TERMS_URL, "terms");
  };

  return (
    <Link
      href={TERMS_URL || "#"}
      onClick={TERMS_URL ? handleOpen : undefined}
      underline="hover"
      color="text.secondary"
      variant="body2"
      sx={{ fontWeight: 600 }}
      aria-disabled={!TERMS_URL}
      tabIndex={TERMS_URL ? 0 : -1}
    >
      이용약관
    </Link>
  );
}
