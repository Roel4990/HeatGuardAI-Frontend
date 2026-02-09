"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { PrivacyLink } from "../../link/privacy-link";
import { TermsLink } from "../../link/terms-link";

export interface MainFooterProps {
  fullWidth?: boolean;
}

export function MainFooter({ fullWidth = false }: MainFooterProps): React.JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid var(--mui-palette-divider)",
        bgcolor: "var(--mui-palette-background-paper)",
        mt: "auto",
      }}
    >
      <Container maxWidth={fullWidth ? false : "xl"} sx={{ py: 2.5, px: fullWidth ? 3 : undefined }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 1, md: 2 }}
          sx={{ alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between" }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2026 NoMoreChaos. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 0.5 }}>
            <TermsLink />
            <Typography component="span" variant="body2" color="text.secondary">
              |
            </Typography>
            <PrivacyLink />
            <Typography component="span" variant="body2" color="text.secondary">
              |
            </Typography>
            <Typography component="span" variant="body2" color="text.secondary">
              문의: nomoreteam0408@gmail.com
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
