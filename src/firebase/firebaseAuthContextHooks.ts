import {
  Auth,
  User,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  linkWithCredential,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  unlink,
  updatePassword,
  verifyPasswordResetCode,
  AuthCredential,
  UserCredential,
  EmailAuthProvider,
  ActionCodeSettings,
} from 'firebase/auth';
import { useCallback } from 'react';
import { useFirebaseAuthContext } from './firebaseAuthContext';

type OmitFirstArg<F> = F extends (x: never, ...args: infer P) => infer R
  ? (...args: P) => R
  : never;

const wrapFirebaseAuthFunction = <F extends (firebaseAuth: Auth, ...args: never[]) => unknown>(
  firebaseAuth: Auth,
  func: F
): OmitFirstArg<F> => {
  const x = ((...args) => func(firebaseAuth, ...args)) as OmitFirstArg<F>;
  return x;
};

const useWrappedFirebaseAuthFunction = <
  F extends (firebaseAuth: Auth, ...args: never[]) => unknown
>(
  func: F
): OmitFirstArg<F> => {
  const { firebaseAuth } = useFirebaseAuthContext();
  return wrapFirebaseAuthFunction(firebaseAuth, func);
};

export const useApplyActionCode = (): OmitFirstArg<typeof applyActionCode> =>
  useWrappedFirebaseAuthFunction(applyActionCode);

export const useConfirmPasswordReset = (): OmitFirstArg<typeof confirmPasswordReset> =>
  useWrappedFirebaseAuthFunction(confirmPasswordReset);

export const useCreateUserWithEmailAndPassword = (): OmitFirstArg<
  typeof createUserWithEmailAndPassword
> => useWrappedFirebaseAuthFunction(createUserWithEmailAndPassword);

export const useLinkWithCredential = (): ((
  credential: AuthCredential
) => Promise<UserCredential>) => {
  const { rawUser } = useFirebaseAuthContext();

  return useCallback(
    (credential: AuthCredential) => {
      if (!rawUser) {
        throw new Error('User is not valid');
      }
      return linkWithCredential(rawUser, credential);
    },
    [rawUser]
  );
};

export const useSendEmailVerification = (): ((
  actionCodeSettings?: ActionCodeSettings | null
) => Promise<void>) => {
  const { rawUser } = useFirebaseAuthContext();

  return useCallback(
    (actionCodeSettings?: ActionCodeSettings | null) => {
      if (!rawUser) {
        throw new Error('User is not valid');
      }
      return sendEmailVerification(rawUser, actionCodeSettings);
    },
    [rawUser]
  );
};

export const useSendPasswordResetEmail = (): OmitFirstArg<typeof sendPasswordResetEmail> =>
  useWrappedFirebaseAuthFunction(sendPasswordResetEmail);

export const useSignInWithEmailAndPassword = (): OmitFirstArg<typeof signInWithEmailAndPassword> =>
  useWrappedFirebaseAuthFunction(signInWithEmailAndPassword);

export const useSignInWithPopup = (): OmitFirstArg<typeof signInWithPopup> =>
  useWrappedFirebaseAuthFunction(signInWithPopup);

export const useSignInWithRedirect = (): OmitFirstArg<typeof signInWithRedirect> =>
  useWrappedFirebaseAuthFunction(signInWithRedirect);

export const useSignOut = (): OmitFirstArg<typeof signOut> =>
  useWrappedFirebaseAuthFunction(signOut);

export const useUpdatePassword = (): ((
  currentPassword: string,
  newPassword: string
) => Promise<void>) => {
  const { rawUser } = useFirebaseAuthContext();

  return useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!rawUser) {
        throw new Error('User is not valid');
      }

      if (!rawUser.email) {
        throw new Error('User does not have an email address');
      }

      const credential = EmailAuthProvider.credential(rawUser.email, currentPassword);
      await reauthenticateWithCredential(rawUser, credential);
      return updatePassword(rawUser, newPassword);
    },
    [rawUser]
  );
};

export const useUnlink = (): ((providerId: string) => Promise<User>) => {
  const { rawUser } = useFirebaseAuthContext();

  return useCallback(
    (providerId: string) => {
      if (!rawUser) {
        throw new Error('User is not valid');
      }
      return unlink(rawUser, providerId);
    },
    [rawUser]
  );
};

export const useVerifyPasswordResetCode = (): OmitFirstArg<typeof verifyPasswordResetCode> =>
  useWrappedFirebaseAuthFunction(verifyPasswordResetCode);
