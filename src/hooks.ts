import { useUpdatePassword } from './firebase/firebaseAuthContextHooks';
import { useState } from 'react';
import { getFirebaseErrorMessage } from '$/firebase/errors';
import {
  useConfirmPasswordReset,
  useCreateUserWithEmailAndPassword,
  useSendEmailVerification,
  useSendPasswordResetEmail,
  useSignInWithEmailAndPassword,
  useVerifyPasswordResetCode,
} from '$/firebase/firebaseAuthContextHooks';

export type EmailVerificationFormState = {
  error: string | undefined;
  inProgress: boolean;
  isComplete: boolean;
  submit: () => Promise<void>;
};

export const useEmailVerificationForm = (): EmailVerificationFormState => {
  const sendEmailVerification = useSendEmailVerification();
  const [inProgress, setInProgress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const submit = async () => {
    setInProgress(true);
    setIsComplete(false);
    setError(undefined);
    try {
      await sendEmailVerification();
      setIsComplete(true);
    } catch (e) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setInProgress(false);
    }
  };

  return { error, inProgress, isComplete, submit };
};

export interface ForgotPasswordFormData {
  email: string;
}

export type ForgotPasswordFormState = {
  error: string | undefined;
  inProgress: boolean;
  isComplete: boolean;
  submit: (formData: ForgotPasswordFormData) => Promise<void>;
};

export const useForgotPasswordForm = (): ForgotPasswordFormState => {
  const sendPasswordResetEmail = useSendPasswordResetEmail();
  const [inProgress, setInProgress] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const submit = async ({ email }: ForgotPasswordFormData) => {
    setInProgress(true);
    setIsComplete(false);
    setError(undefined);
    try {
      await sendPasswordResetEmail(email);
      setIsComplete(true);
    } catch (e) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setInProgress(false);
    }
  };

  return { error, inProgress, isComplete, submit };
};

export interface PasswordLoginFormData {
  email: string;
  password: string;
}

export type PasswordLoginFormState = {
  error: string | undefined;
  inProgress: boolean;
  submit: (formData: PasswordLoginFormData) => Promise<void>;
};

export const usePasswordLoginForm = (): PasswordLoginFormState => {
  const signInWithEmailAndPassword = useSignInWithEmailAndPassword();
  const [inProgress, setInProgress] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const submit = async ({ email, password }: PasswordLoginFormData) => {
    setInProgress(true);
    setError(undefined);
    try {
      await signInWithEmailAndPassword(email, password);
    } catch (e) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setInProgress(false);
    }
  };

  return { error, inProgress, submit };
};

export interface PasswordRegistrationFormData {
  email: string;
  password: string;
  passwordConfirm: string;
}

export type PasswordRegistrationFormState = {
  error: string | undefined;
  inProgress: boolean;
  submit: (formData: PasswordRegistrationFormData) => Promise<void>;
};

export const usePasswordRegistrationForm = (): PasswordRegistrationFormState => {
  const createUserWithEmailAndPassword = useCreateUserWithEmailAndPassword();
  const [inProgress, setInProgress] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const submit = async ({ email, password, passwordConfirm }: PasswordRegistrationFormData) => {
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setInProgress(true);
    setError(undefined);
    try {
      await createUserWithEmailAndPassword(email, password);
    } catch (e) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setInProgress(false);
    }
  };

  return { error, inProgress, submit };
};

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export type ChangePasswordFormState = {
  error: string | undefined;
  inProgress: boolean;
  submit: (formData: ChangePasswordFormData) => Promise<void>;
};

export const useChangePasswordForm = (): ChangePasswordFormState => {
  const updatePassword = useUpdatePassword();
  const [inProgress, setInProgress] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const submit = async ({
    currentPassword,
    newPassword,
    newPasswordConfirm,
  }: ChangePasswordFormData) => {
    if (newPassword !== newPasswordConfirm) {
      setError('New passwords do not match');
      return;
    }

    setInProgress(true);
    setError(undefined);
    try {
      await updatePassword(currentPassword, newPassword);
    } catch (e) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setInProgress(false);
    }
  };

  return { error, inProgress, submit };
};

export interface PasswordResetFormData {
  password: string;
  passwordConfirm: string;
}

export type PasswordResetFormState = {
  error: string | undefined;
  inProgress: boolean;
  submit: (formData: PasswordResetFormData) => Promise<void>;
};

export const usePasswordResetForm = (oobCode: string): PasswordResetFormState => {
  const confirmPasswordReset = useConfirmPasswordReset();
  const signInWithEmailAndPassword = useSignInWithEmailAndPassword();
  const verifyPasswordResetCode = useVerifyPasswordResetCode();
  const [inProgress, setInProgress] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const submit = async ({ password, passwordConfirm }: PasswordResetFormData) => {
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setInProgress(true);
    setError(undefined);
    try {
      const email = await verifyPasswordResetCode(oobCode);
      await confirmPasswordReset(oobCode, password);
      await signInWithEmailAndPassword(email, password);
    } catch (e) {
      setError(getFirebaseErrorMessage(e));
    } finally {
      setInProgress(false);
    }
  };

  return { error, inProgress, submit };
};
