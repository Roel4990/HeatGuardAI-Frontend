'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { paths } from '@/paths';
import { useLoginMutation } from '@/hooks/mutations/login/use-login-mutation';

const schema = zod.object({
  email: zod.string().min(1, { message: '이메일을 입력해주세요.' }).email({ message: '이메일 형식을 확인해 주세요' }),
  password: zod
    .string()
    .min(10, { message: '비밀번호는 10자 이상이어야 합니다.' })
    .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' })
    .regex(/[A-Za-z]/, { message: '비밀번호는 영문을 포함해야 합니다.' })
    .regex(/\d/, { message: '비밀번호는 숫자를 포함해야 합니다.' })
    .regex(/[^A-Za-z0-9]/, { message: '비밀번호는 특수문자를 포함해야 합니다.' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '', password: '' } satisfies Values;

export function SignInForm(): React.JSX.Element {
  const { mutate, isPending } = useLoginMutation();
  const [showPassword, setShowPassword] = React.useState<boolean>();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      mutate(values, {
        onError: () => {
          setError('root', { type: 'server', message: '로그인에 실패했습니다. 아이디 비밀번호를 확인해 주세요' });
        },
      });
    },
    [mutate, setError]
  );

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <Typography variant="h4">로그인</Typography>
        <Typography color="text.secondary" variant="body2">
          아직 계정이 없으신가요?{' '}
          <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            회원가입
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>이메일</InputLabel>
                <OutlinedInput {...field} label="이메일" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>비밀번호</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  label="비밀번호"
                  type={showPassword ? 'text' : 'password'}
                />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            로그인
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
