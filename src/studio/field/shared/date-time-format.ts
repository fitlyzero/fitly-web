interface DateTimeParts {
  day: number;
  hour: number;
  millisecond: number;
  minute: number;
  month: number;
  second: number;
  year: number;
}

const dateTimeValuePattern = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3})\d*)?)?(?:Z|[+-]\d{2}:?\d{2})?$/;
const timeInputPattern = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/;

const pad = (value: number, length = 2): string =>
  String(value).padStart(length, '0');

const parseDateTimeParts = (value: string): DateTimeParts | null => {
  const match = dateTimeValuePattern.exec(value);
  if (!match) return null;

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue, millisecondValue] = match;
  const parts: DateTimeParts = {
    day: Number(dayValue),
    hour: Number(hourValue),
    millisecond: Number((millisecondValue ?? '').padEnd(3, '0') || 0),
    minute: Number(minuteValue),
    month: Number(monthValue),
    second: Number(secondValue ?? 0),
    year: Number(yearValue),
  };
  const validationDate = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  ));

  if (
    validationDate.getUTCFullYear() !== parts.year
    || validationDate.getUTCMonth() + 1 !== parts.month
    || validationDate.getUTCDate() !== parts.day
    || validationDate.getUTCHours() !== parts.hour
    || validationDate.getUTCMinutes() !== parts.minute
    || validationDate.getUTCSeconds() !== parts.second
  ) {
    return null;
  }

  return parts;
};

export interface DateTimeInputParts {
  date: string;
  time: string;
}

export const formatDateTime = (value: string): string | null => {
  const parts = parseDateTimeParts(value);
  if (!parts) return null;

  return `${pad(parts.day)}/${pad(parts.month)}/${pad(parts.year, 4)} ${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`;
};

export const toDateTimeInputParts = (
  value: string,
): DateTimeInputParts | null => {
  const parts = parseDateTimeParts(value);
  if (!parts) return null;

  return {
    date: `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`,
    time: `${pad(parts.hour)}:${pad(parts.minute)}:${pad(parts.second)}`,
  };
};

export const normalizeTimeInputValue = (time: string): string | null => {
  const match = timeInputPattern.exec(time);
  if (!match) return null;

  const [, hour, minute, second = '00'] = match;
  return `${hour}:${minute}:${second}`;
};

export const combineDateTimeInputParts = (
  date: string,
  time: string,
): string | null => {
  if (!date || !time) return null;

  const normalizedTime = normalizeTimeInputValue(time);
  if (!normalizedTime) return null;
  const value = `${date}T${normalizedTime}`;

  return parseDateTimeParts(value) ? value : null;
};
