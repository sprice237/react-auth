import {
  Auth,
  User,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  linkWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  unlink,
  verifyPasswordResetCode,
  AuthCredential,
  UserCredential,
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
  const { user } = useFirebaseAuthContext();

  return useCallback(
    (credential: AuthCredential) => {
      if (!user) {
        throw new Error('User is not valid');
      }
      return linkWithCredential(user, credential);
    },
    [user]
  );
};

export const useSendEmailVerification = (): (() => Promise<void>) => {
  const { user } = useFirebaseAuthContext();

  return useCallback(() => {
    if (!user) {
      throw new Error('User is not valid');
    }
    return sendEmailVerification(user);
  }, [user]);
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

export const useUnlink = (): ((providerId: string) => Promise<User>) => {
  const { user } = useFirebaseAuthContext();

  return useCallback(
    (providerId: string) => {
      if (!user) {
        throw new Error('User is not valid');
      }
      return unlink(user, providerId);
    },
    [user]
  );
};

export const useVerifyPasswordResetCode = (): OmitFirstArg<typeof verifyPasswordResetCode> =>
  useWrappedFirebaseAuthFunction(verifyPasswordResetCode);
