interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
      {message}
    </div>
  );
}

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
      {message}
    </div>
  );
}
