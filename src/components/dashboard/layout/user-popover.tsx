import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';


import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

const maskName = (name?: string) => {
	if (!name) return '-';
	if (name.length <= 2) return name[0] + '*';
	return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
};

const maskEmail = (email?: string) => {
	if (!email) return '-';
	const [id, domain] = email.split('@');
	if (!domain) return email;
	if (id.length <= 3) return '*'.repeat(id.length) + '@' + domain;
	return id.slice(0, 3) + '*'.repeat(id.length - 3) + '@' + domain;
};

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { checkSession,user } = useUser();

  const router = useRouter();

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_auth');
        localStorage.removeItem('user_nm');
        localStorage.removeItem('user_email');
				localStorage.removeItem('user_cd');
      } catch (storageError) {
        logger.error('Sign out storage error', storageError);
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();
      // After refresh, AuthGuard will handle the redirect
    } catch (error) {
      logger.error('Sign out error', error);
    }
  }, [checkSession, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
				<Typography variant="subtitle1">{maskName(user?.name)}</Typography>
				<Typography color="text.secondary" variant="body2">
					{maskEmail(user?.email)}
				</Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
