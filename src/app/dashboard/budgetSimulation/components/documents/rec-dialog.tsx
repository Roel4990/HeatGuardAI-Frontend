import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  onRegenerate: () => void;
  children: React.ReactNode;
};

export default function RecDialog({ open, title, onClose, onRegenerate, children }: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 900,
          bgcolor: "rgba(186,230,253,0.2)",
          color: "text.primary",
          borderBottom: "none",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={900}>{title}</Typography>
          </Box>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            <Tooltip title="닫기">
              <IconButton size="small" onClick={onClose} sx={{ color: "inherit" }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>{children}</DialogContent>

      <DialogActions sx={{ bgcolor: "rgba(186,230,253,0.2)", borderTop: "none" }}>
        <Button onClick={onRegenerate} sx={{ color: "text.primary" }}>
          AI에게 문서 재요청하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
