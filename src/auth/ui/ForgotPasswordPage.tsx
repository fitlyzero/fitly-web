import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useState, type ReactElement } from 'react';
import { z } from 'zod';

import { authRoutes, navigateTo } from '@/app/router/app-router';
import { useRequestPasswordResetMutation } from '@/auth/hooks/usePasswordReset';
import type { AuthLanguage, PasswordResetDispatch } from '@/auth/model/auth.types';
import { AuthLayout } from '@/auth/ui/AuthLayout';
import { ProjectLogo } from '@/auth/ui/ProjectLogo';
import { authCopy } from '@/auth/ui/auth.copy';

const schema = z.object({
  identifier: z.string().trim().min(2, 'Vui lòng nhập tài khoản hợp lệ.'),
});

type ForgotPasswordFormValues = z.infer<typeof schema>;

interface ForgotPasswordPageProps {
  language: AuthLanguage;
  onChangeLanguage: (language: AuthLanguage) => void;
}

export const ForgotPasswordPage = ({
  language,
  onChangeLanguage,
}: ForgotPasswordPageProps): ReactElement => {
  const copy = authCopy[language];
  const mutation = useRequestPasswordResetMutation();
  const [dispatch, setDispatch] = useState<PasswordResetDispatch | null>(null);
  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: { identifier: '' },
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  return (
    <AuthLayout language={language} languageLabel={copy.languageLabel} onLanguageChange={onChangeLanguage}>
      <ProjectLogo />
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h1">{copy.forgotPasswordTitle}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{copy.forgotPasswordHelp}</Typography>
      </Box>
      {mutation.isError ? <Alert severity="error">{mutation.error.message}</Alert> : null}
      {dispatch ? (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Alert severity="success">
            {copy.passwordResetEmailSent} {dispatch.identifier}. {copy.passwordResetEmailHint}
          </Alert>
          <TextField label={copy.resetLinkLabel} slotProps={{ input: { readOnly: true } }} value={dispatch.resetLink} />
          <Button
            onClick={() => {
              const url = new URL(dispatch.resetLink);
              navigateTo(url.pathname, url.search);
            }}
            variant="contained"
          >
            {copy.openResetLink}
          </Button>
          <Button onClick={() => { mutation.reset(); setDispatch(null); }}>{copy.sendAnotherLink}</Button>
        </Box>
      ) : (
        <Box
          component="form"
          noValidate
          onSubmit={form.handleSubmit(async (values) => setDispatch(await mutation.mutateAsync(values)))}
          sx={{ display: 'grid', gap: 2 }}
        >
          <Controller
            control={form.control}
            name="identifier"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
                label={copy.identifierLabel}
                required
              />
            )}
          />
          <Button disabled={mutation.isPending} size="large" type="submit" variant="contained">
            {mutation.isPending ? <CircularProgress color="inherit" size={20} /> : copy.sendResetLink}
          </Button>
        </Box>
      )}
      <Button onClick={() => navigateTo(authRoutes.login)}>{copy.backToLogin}</Button>
    </AuthLayout>
  );
};
