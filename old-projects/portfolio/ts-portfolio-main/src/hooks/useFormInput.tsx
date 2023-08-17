import { useState } from 'react';

export function useFormInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  interface HandleChange {
    (e: React.ChangeEvent<HTMLInputElement>): void;
  }
  const handleChange: HandleChange = event => {
    setValue(event.target.value);
    setIsDirty(true);

    // Resolve errors as soon as input becomes valid
    if (error && event.target.checkValidity()) {
      setError(null);
    }
  };

  interface HandleInvalid {
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  }
  const handleInvalid: HandleInvalid = event => {
    // Prevent native errors appearing
    event.preventDefault();
    setError((event.target as HTMLInputElement | HTMLTextAreaElement).validationMessage);
  };

  interface HandleBlur {
    (e: React.FocusEvent<HTMLInputElement>): void;
  }
  const handleBlur: HandleBlur = event => {
    // Only validate when the user has made a change
    if (isDirty) {
      event.target.checkValidity();
    }
  };

  return {
    value,
    error,
    onChange: handleChange,
    onBlur: handleBlur,
    onInvalid: handleInvalid,
  };
}
