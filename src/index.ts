export * from './firebase';
export * from './hooks';

export type { User as FirebaseUser, AuthCredential, UserCredential } from 'firebase/auth';
export { EmailAuthProvider, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
export type { FirebaseError } from 'firebase/app';
