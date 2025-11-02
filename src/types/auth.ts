// import { User } from 'firebase/auth';

export type MinimalUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified?: boolean;
  providerId?: string;
};

export interface AuthState {
  user: MinimalUser | null;
  loading: boolean;
  error?: string | null;
}
