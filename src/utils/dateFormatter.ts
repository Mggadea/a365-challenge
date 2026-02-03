/**
 * Formats a date string to a readable Spanish format
 * @param dateString - Date string in ISO format (e.g., "2026-02-15" or "2026-02-15T10:30:00")
 * @returns Formatted date string in Spanish (e.g., "15 de febrero de 2026")
 */
export const formatDateToSpanish = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString('es-ES', options);
};

/**
 * Formats a date string to a short Spanish format
 * @param dateString - Date string in ISO format
 * @returns Formatted date string (e.g., "15 feb 2026")
 */
export const formatDateToSpanishShort = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleDateString('es-ES', options);
};

/**
 * Formats a date string to include day of week in Spanish
 * @param dateString - Date string in ISO format
 * @returns Formatted date string (e.g., "lunes, 15 de febrero de 2026")
 */
export const formatDateToSpanishWithDay = (dateString: string): string => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return date.toLocaleDateString('es-ES', options);
};
