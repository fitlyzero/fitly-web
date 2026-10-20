import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { ReactElement } from 'react';
import { z } from 'zod';

import { authRoutes, navigateTo } from '@/app/router/app-router';
import {
  usePasswordResetTokenQuery,
  useResetPasswordMutation,
} from '@/auth/hooks/usePasswordReset';
import type { AuthLanguage } from '@/auth/model/auth.types';
import { AuthLayout } from '@/auth/ui/AuthLayout';
import { ProjectLogo } from '@/auth/ui/ProjectLogo';
import { authCopy } from '@/auth/ui/auth.copy';

const schema = z
  .object({
    confirmPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp.',
    path: ['confirmPassword'],
  });

type ResetPasswordFormValues = z.infer<typeof schema>;

interface ResetPasswordPageProps {
  language: AuthLanguage;
  onChangeLanguage: (language: AuthLanguage) => void;
}

export const ResetPasswordPage = ({
  language,
  onChangeLanguage,
}: ResetPasswordPageProps): ReactElement => {
  const copy = authCopy[language];
  const token = new URLSearchParams(window.location.search).get('token');
  const tokenQuery = usePasswordResetTokenQuery(token);
  const mutation = useResetPasswordMutation();
  const form = useForm<ResetPasswordFormValues>({
    defaultValues: { confirmPassword: '', password: '' },
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  return (
    <AuthLayout language={language} languageLabel={copy.languageLabel} onLanguageChange={onChangeLanguage}>
      <ProjectLogo />
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h1">{copy.resetPasswordTitle}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{copy.resetPasswordHelp}</Typography>
      </Box>
      {tokenQuery.isPending ? <Alert severity="info">{copy.loadingResetLink}</Alert> : null}
      {tokenQuery.isError ? <Alert severity="error">{tokenQuery.error.message}</Alert> : null}
      {mutation.isError ? <Alert severity="error">{mutation.error.message}</Alert> : null}
      {tokenQuery.data ? (
        <Alert severity="info">{copy.resetPasswordForLabel}: {tokenQuery.data.identifier}</Alert>
      ) : null}
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          if (!token) return;
          const result = await mutation.mutateAsync({ password: values.password, token });
          navigateTo(
            authRoutes.login,
            `?reset=success&identifier=${encodeURIComponent(result.identifier)}`,
          );
        })}
        sx={{ display: 'grid', gap: 2 }}
      >
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} label={copy.passwordLabel} required type="password" />
          )}
        />
        <Controller
          control={form.control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <TextField {...field} error={Boolean(fieldState.error)} helperText={fieldState.error?.message} label={copy.confirmPasswordLabel} required type="password" />
          )}
        />
        <Button disabled={!tokenQuery.data || mutation.isPending} size="large" type="submit" variant="contained">
          {mutation.isPending ? <CircularProgress color="inherit" size={20} /> : copy.resetPasswordButton}
        </Button>
      </Box>
      <Button onClick={() => navigateTo(authRoutes.login)}>{copy.backToLogin}</Button>
    </AuthLayout>
  );
};
