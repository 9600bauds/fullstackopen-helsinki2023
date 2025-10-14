import axios from 'axios';

const camelCaseToTitleCase = (text: string) => {
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

interface ZodError {
  message: string;
  path: (string | number)[];
}

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;

      if (data?.error && Array.isArray(data.error)) {
        return (data.error as ZodError[])
          .map((issue) => {
            const field = issue.path[0];
            return field
              ? `${camelCaseToTitleCase(String(field))}: ${issue.message}`
              : issue.message;
          })
          .join('. ');
      }

      if (typeof data?.error === 'string') return data.error;
      if (typeof data === 'string') return data;
      return error.message;
    }
    if (error.request) {
      return 'Network error. Please check your connection.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred.';
};
