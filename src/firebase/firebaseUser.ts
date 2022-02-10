import { User } from '@firebase/auth';

export type FirebaseUser = {
  uid: User['uid'];
  email: User['email'];
  emailVerified: User['emailVerified'];
  displayName: User['displayName'];
  isAnonymous: User['isAnonymous'];
  photoURL: User['photoURL'];
  phoneNumber: User['phoneNumber'];
  tenantId: User['tenantId'];
  providerData: User['providerData'];
  metadata: {
    createdAt: User['metadata']['creationTime'];
    lastLoginAt: User['metadata']['lastSignInTime'];
  };
};
