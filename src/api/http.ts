import type { BaseResponse } from '@/common/api/base-response';
import { getFrontendMessage } from '@/i18n/frontend-messages';

interface ApiErrorPayload {
  message?: string;
}

const getDefaultRequestErrorMessage = (): string =>
  getFrontendMessage('requestFailed');

const requestJson = async <TResponse>(
  url: string,
  init?: RequestInit,
): Promise<TResponse | null> => {
  try {
    const response = await window.fetch(url, init);
    const payload = (await response.json().catch(() => null)) as
      | ApiErrorPayload
      | TResponse
      | null;

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string' &&
        payload.message.trim().length > 0
          ? payload.message
          : getDefaultRequestErrorMessage();
      throw new Error(message);
    }

    return payload as TResponse;
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError') {
      return null;
    }

    throw error;
  }
};

export const getJson = <TResponse>(url: string): Promise<TResponse | null> =>
  requestJson<TResponse>(url);

export const postJson = <TResponse>(
  url: string,
  body: unknown,
): Promise<TResponse | null> =>
  requestJson<TResponse>(url, {
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

export const getRequiredJson = async <TResponse>(url: string): Promise<TResponse> => {
  try {
    const response = await window.fetch(url);
    const payload = (await response.json().catch(() => null)) as
      | BaseResponse<unknown>
      | TResponse
      | null;

    if (!response.ok) {
      const message = payload
        && typeof payload === 'object'
        && 'err_message' in payload
        && payload.err_message
        && typeof payload.err_message.message === 'string'
        && payload.err_message.message.trim().length > 0
        ? payload.err_message.message
        : getDefaultRequestErrorMessage();
      throw new Error(message);
    }

    if (payload === null) {
      throw new Error(getDefaultRequestErrorMessage());
    }

    return payload as TResponse;
  } catch (error) {
    if (error instanceof Error && error.name !== 'TypeError') {
      throw error;
    }

    throw new Error(getDefaultRequestErrorMessage(), { cause: error });
  }
};

export const unwrapApiResponse = <TData>(response: BaseResponse<TData>): TData => {
  if (response.status !== 200) {
    const backendMessage = response.err_message?.message;
    throw new Error(
      backendMessage?.trim() ? backendMessage : getDefaultRequestErrorMessage(),
    );
  }

  if (response.data === undefined || response.data === null) {
    throw new Error(getDefaultRequestErrorMessage());
  }

  return response.data;
};
