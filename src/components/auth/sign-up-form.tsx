'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { useUser } from '@/hooks/use-user';
import { useEmailCheckMutation } from '@/hooks/mutations/email-check/use-email-check-mutation';
import { useSignUpMutation } from '@/hooks/mutations/sign-up/use-sign-up-mutation';

const baseSchema = zod.object({
  name: zod.string().min(1, { message: '이름을 입력해 주세요.' }),
  email: zod.string().min(1, { message: '이메일을 입력해 주세요' }).email({ message: '이메일 형식을 확인해 주세요' }),
  password: zod
    .string()
    .min(10, { message: '비밀번호는 10자 이상이어야 합니다.' })
    .max(20, { message: '비밀번호는 20자 이하이어야 합니다.' })
    .regex(/[A-Za-z]/, { message: '비밀번호는 영문을 포함해야 합니다.' })
    .regex(/\d/, { message: '비밀번호는 숫자를 포함해야 합니다.' })
    .regex(/[^A-Za-z0-9]/, { message: '비밀번호는 특수문자를 포함해야 합니다.' }),
  terms: zod.boolean().refine((value) => value, '개인정보 처리방침을 확인해 주세요.'),
});

const schema = baseSchema
  .extend({ confirmPassword: zod.string().min(1, { message: '비밀번호 확인을 입력해 주세요.' }) })
  .refine((values) => values.password === values.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type Values = zod.infer<typeof schema>;

const defaultValues = { name: '', email: '', password: '', confirmPassword: '', terms: false } satisfies Values;

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();

  const { checkSession } = useUser();

  const [isPending, setIsPending] = React.useState<boolean>(false);
  const [emailCheckMessage, setEmailCheckMessage] = React.useState<string | null>(null);
  const [emailCheckError, setEmailCheckError] = React.useState<boolean>(false);
  const { mutateAsync: checkEmail } = useEmailCheckMutation();
  const { mutateAsync: signUp } = useSignUpMutation();

  const PRIVACY_POLICY_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL;

  const {
    control,
    handleSubmit,
    setError,
    trigger,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);

      const { confirmPassword, ...payload } = values;
      try {
        const result = await signUp({
          user_nm: payload.name,
          user_id: payload.email,
          user_pw: payload.password,
        });

        if (!result.success || !result.data) {
          setError('root', { type: 'server', message: result.error ?? '회원가입에 실패했습니다.' });
          setIsPending(false);
          return;
        }

        try {
          localStorage.setItem('access_token', result.data.access_token);
          localStorage.setItem('user_auth', result.data.user_auth);
          localStorage.setItem('user_nm', result.data.user_nm);
          localStorage.setItem('user_email', result.data.user_email);
					localStorage.setItem('user_cd', result.data.user_cd);
        } catch (storageError) {
          // noop
        }

        // Refresh the auth state
        await checkSession?.();

        // UserProvider, for this case, will not refresh the router
        // After refresh, GuestGuard will handle the redirect
        router.refresh();
      } catch (error) {
        const message =
          (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
          '회원가입에 실패했습니다.';
        setError('root', { type: 'server', message });
      } finally {
        setIsPending(false);
      }
    },
    [checkSession, router, setError, signUp]
  );

  const handleEmailCheck = React.useCallback(
    async (email: string): Promise<void> => {
      if (!email) {
        setEmailCheckMessage('이메일을 입력해 주세요.');
        setEmailCheckError(true);
        return;
      }
      // 이메일 유효성 검사 먼저
      const isValid = await trigger('email');

      if (!isValid) {
        // zod 에러 메시지는 errors.email로 자동 표시됨
        setEmailCheckMessage(null);
        setEmailCheckError(false);
        return;
      }

      try {
        const result = await checkEmail({ user_id: email });

        if (result.success) {
          setEmailCheckMessage('사용 가능한 이메일입니다.');
          setEmailCheckError(false);
          return;
        }

        setEmailCheckMessage(result.error ?? '이메일 중복 확인에 실패했습니다.');
        setEmailCheckError(true);
      } catch (error) {
        const message =
          (error as { response?: { data?: { error?: string } } }).response?.data?.error ??
          '이메일 중복 확인에 실패했습니다.';
        setEmailCheckMessage(message);
        setEmailCheckError(true);
      }
    },
    [checkEmail, trigger]
  );

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4">회원가입</Typography>
        <Typography color="text.secondary" variant="body2">
          이미 계정이 있으신가요?
          <Link component={RouterLink} href={paths.auth.signIn} underline="hover" variant="subtitle2">
            로그인
          </Link>
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <FormControl error={Boolean(errors.name)}>
                <InputLabel>이름</InputLabel>
                <OutlinedInput {...field} label="이름" />
                {errors.name && <FormHelperText>{errors.name.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>이메일 주소</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Email address"
                  type="email"
                  endAdornment={
                    <InputAdornment position="end">
                      <Button type="button" size="small" variant="outlined" onClick={() => handleEmailCheck(field.value)}>
                        중복확인
                      </Button>
                    </InputAdornment>
                  }
                />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                {emailCheckMessage ? <FormHelperText error={emailCheckError}>{emailCheckMessage}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>비밀번호</InputLabel>
                <OutlinedInput {...field} label="Password" type="password" />
                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormControl error={Boolean(errors.confirmPassword)}>
                <InputLabel>비밀번호 확인</InputLabel>
                <OutlinedInput
                  {...field}
                  label="Confirm password"
                  type="password"
                  onBlur={async (event) => {
                    field.onBlur();
                    await trigger('confirmPassword');
                  }}
                />
                {errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="terms"
            render={({ field }) => (
              <div>
                <FormControlLabel
                  control={<Checkbox {...field} />}
                  label={
                    <React.Fragment>
                      <Link component="a" href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
                        개인정보 처리방침
                      </Link>
                      에 동의합니다.
                    </React.Fragment>
                  }
                />
                {errors.terms ? <FormHelperText error>{errors.terms.message}</FormHelperText> : null}
              </div>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained">
            가입하기
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
