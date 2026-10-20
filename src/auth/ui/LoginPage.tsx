import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import type { ReactElement } from 'react';
import { z } from 'zod';

import { authRoutes, navigateTo } from '@/app/router/app-router';
import { useLoginMutation } from '@/auth/hooks/useLoginMutation';
import type { AuthLanguage } from '@/auth/model/auth.types';
import { AuthLayout } from '@/auth/ui/AuthLayout';
import { ProjectLogo } from '@/auth/ui/ProjectLogo';
import { authCopy } from '@/auth/ui/auth.copy';

const schema = z.object({
  identifier: z.string().trim().min(2, 'Vui lòng nhập tài khoản hợp lệ.'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),
});

type LoginFormValues = z.infer<typeof schema>;

interface LoginPageProps {
  language: AuthLanguage;
  onChangeLanguage: (language: AuthLanguage) => void;
}

export const LoginPage = ({ language, onChangeLanguage }: LoginPageProps): ReactElement => {
  const copy = authCopy[language];
  const mutation = useLoginMutation();
  const query = new URLSearchParams(window.location.search);
  const form = useForm<LoginFormValues>({
    defaultValues: { identifier: query.get('identifier') ?? '', password: '' },
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  return (
    <AuthLayout language={language} languageLabel={copy.languageLabel} onLanguageChange={onChangeLanguage}>
      <ProjectLogo />
      <Typography component="h1" sx={{ textAlign: 'center' }} variant="h1">{copy.loginTitle}</Typography>
      {query.get('reset') === 'success' ? <Alert severity="success">{copy.passwordResetSuccess}</Alert> : null}
      {mutation.isError ? <Alert severity="error">{mutation.error.message}</Alert> : null}
      <Box
        component="form"
        noValidate
        onSubmit={form.handleSubmit((values) => mutation.mutateAsync({ password: values.password, username: values.identifier }))}
        sx={{ display: 'grid', gap: 2 }}
      >
        <Controller
          control={form.control}
          name="identifier"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              autoComplete="username"
              error={Boolean(fieldState.error)}
              fullWidth
              helperText={fieldState.error?.message}
              label={copy.identifierLabel}
              required
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              autoComplete="current-password"
              error={Boolean(fieldState.error)}
              fullWidth
              helperText={fieldState.error?.message}
              label={copy.passwordLabel}
              required
              type="password"
            />
          )}
        />
        <Button onClick={() => navigateTo(authRoutes.forgotPassword)} sx={{ justifySelf: 'end' }}>
          {copy.forgotPasswordAction}
        </Button>
        <Button disabled={mutation.isPending} size="large" type="submit" variant="contained">
          {mutation.isPending ? <CircularProgress color="inherit" size={20} /> : copy.loginButton}
        </Button>
      </Box>
    </AuthLayout>
  );
};
