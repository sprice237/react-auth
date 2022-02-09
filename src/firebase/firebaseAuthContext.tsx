import { FirebaseApp, FirebaseError, FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, Auth, User, onIdTokenChanged, getRedirectResult } from 'firebase/auth';
import {
  createContext,
  FC,
  VFC,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { isFirebaseError } from '$/firebase/errors';

export type FirebaseAuthContextValue = {
  firebaseAuth: Auth;
  user: User | null;
  emailVerified: boolean | null;
  reloadUser: () => Promise<void>;
  retrieveToken: (forceRefresh?: boolean) => Promise<string | undefined>;
  redirectError: FirebaseError | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const FirebaseAuthContext = createContext<FirebaseAuthContextValue>(null!);
FirebaseAuthContext.displayName = 'FirebaseAuthContext';

export const useFirebaseAuthContext = (): FirebaseAuthContextValue =>
  useContext(FirebaseAuthContext);

export const useFirebaseAuthContextValue = (
  firebaseOptions: FirebaseOptions
): FirebaseAuthContextValue | null => {
  const [firebaseApp, setFirebaseApp] = useState<FirebaseApp>();

  // undefined means user state hasn't been retrieved yet, null means user state has been retrieved and there is no user
  const [user, setUser] = useState<User | null | undefined>();
  const [emailVerified, setEmailVerified] = useState<boolean | null | undefined>();

  const [redirectError, setRedirectError] = useState<FirebaseError>();

  const retrieveToken = useCallback(
    async (forceRefresh?: boolean) => await user?.getIdToken(forceRefresh),
    [user]
  );

  const firebaseAuth = useMemo(
    () => (firebaseApp ? getAuth(firebaseApp) : undefined),
    [firebaseApp]
  );

  const reloadUser = useCallback(async () => {
    if (!firebaseAuth) {
      setUser(undefined);
      setEmailVerified(undefined);
    } else {
      if (firebaseAuth.currentUser) {
        await firebaseAuth.currentUser.reload();
      }

      setUser(firebaseAuth.currentUser);
      setEmailVerified(firebaseAuth.currentUser?.emailVerified ?? null);
    }
  }, [user, firebaseAuth]);

  useEffect(() => {
    setFirebaseApp(initializeApp(firebaseOptions));

    return () => {
      setFirebaseApp(undefined);
    };
  }, [firebaseOptions]);

  useEffect(() => {
    if (!firebaseAuth || !getRedirectResult) {
      return;
    }

    getRedirectResult(firebaseAuth).catch((e) => {
      if (!isFirebaseError(e)) {
        throw e;
      }
      setRedirectError(e);
    });

    const unsubscriber = onIdTokenChanged(firebaseAuth, (newUser) => {
      setUser(newUser);
      setEmailVerified(newUser?.emailVerified ?? null);
    });

    return () => {
      setUser(undefined);
      setEmailVerified(undefined);
      unsubscriber();
    };
  }, [firebaseAuth]);

  if (!firebaseAuth || user === undefined || emailVerified === undefined) {
    return null;
  }

  return { firebaseAuth, user, emailVerified, reloadUser, retrieveToken, redirectError };
};

export type FirebaseAuthContextProviderProps = {
  firebaseOptions: FirebaseOptions;
  Loading?: VFC<Record<string, never>>;
};

export const FirebaseAuthContextProvider: FC<FirebaseAuthContextProviderProps> = ({
  firebaseOptions,
  children,
  Loading,
}) => {
  const contextValue = useFirebaseAuthContextValue(firebaseOptions);

  if (!contextValue) {
    if (Loading) {
      return <Loading />;
    }
    return null;
  }

  return (
    <FirebaseAuthContext.Provider value={contextValue}>{children}</FirebaseAuthContext.Provider>
  );
};
