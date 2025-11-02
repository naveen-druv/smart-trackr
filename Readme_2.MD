# Enterprise Firebase Authentication (React + Redux Toolkit + TypeScript)

This single-file project blueprint contains an **enterprise-ready** authentication setup using Firebase Auth, Firestore (user profiles), React, Redux Toolkit, and custom hooks. It includes sign-up, sign-in, Google sign-in, logout, email verification, password reset, protected routes, role-based access scaffolding, and token attachment for backend API calls.

> Files are shown below with path markers. Copy each file into your React/TypeScript project (created with `create-react-app my-app --template typescript` or Vite). Replace the `firebaseConfig` values with your project's values.

---

## README — Quick Setup

1. Create Firebase project and enable providers (Email/Password, Google). Create Firestore database.
2. Add a Web app in Firebase console and copy the config.
3. Install packages:

```bash
npm install firebase @reduxjs/toolkit react-redux axios redux-persist react-router-dom@6
# optional dev
npm install -D @types/react-router-dom
```

4. Create `.env` entries (or set directly):

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

5. Copy files from this document into `src/` and run `npm start`.

---

// src/firebaseConfig.ts

```ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
```

---

// src/types/auth.ts

```ts
import { User } from 'firebase/auth';

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
```

---

// src/store/slices/authSlice.ts

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, MinimalUser } from '../../types/auth';

const initialState: AuthState = {
  user: null,
  loading: true, // start true until we check onAuthStateChanged
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<MinimalUser | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

---

// src/store/index.ts

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

// src/services/authService.ts

```ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  User,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function signupWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  await ensureFirestoreUser(cred.user, 'email');
  return cred.user;
}

export async function loginWithEmail(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await ensureFirestoreUser(cred.user, 'email');
  return cred.user;
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  await ensureFirestoreUser(user, 'google');
  return user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function sendResetEmail(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function sendVerification(user: User) {
  return sendEmailVerification(user);
}

async function ensureFirestoreUser(user: User, provider: string) {
  if (!user?.uid) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      provider,
      createdAt: serverTimestamp(),
    });
  }
}
```

---

// src/hooks/useAuth.ts

```ts
import { useEffect } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, clearAuth } from '../store/slices/authSlice';
import type { MinimalUser } from '../types/auth';

// Hook: subscribe to Firebase auth state and push minimal user to Redux
export function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await getIdToken(user, /* forceRefresh */ false);
        const minimal: MinimalUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        // NOTE: we don't store token in Redux here — attach on request via axios interceptor
        dispatch(setUser(minimal));
      } else {
        dispatch(clearAuth());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
```

---

// src/hooks/useAuthActions.ts

```ts
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  signupWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  sendResetEmail,
} from '../services/authService';
import { setError } from '../store/slices/authSlice';

export function useAuthActions() {
  const dispatch = useDispatch();

  const signup = useCallback(
    async (email: string, password: string, displayName?: string) => {
      try {
        return await signupWithEmail(email, password, displayName);
      } catch (err: any) {
        dispatch(setError(err.message || 'Sign up failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        return await loginWithEmail(email, password);
      } catch (err: any) {
        dispatch(setError(err.message || 'Login failed'));
        throw err;
      }
    },
    [dispatch]
  );

  const google = useCallback(async () => {
    try {
      return await loginWithGoogle();
    } catch (err: any) {
      dispatch(setError(err.message || 'Google login failed'));
      throw err;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  const resetPassword = useCallback(
    async (email: string) => {
      try {
        return await sendResetEmail(email);
      } catch (err: any) {
        dispatch(setError(err.message || 'Reset password failed'));
        throw err;
      }
    },
    [dispatch]
  );

  return { signup, login, google, logout, resetPassword };
}
```

---

// src/lib/axiosClient.ts

```ts
import axios from 'axios';
import { auth } from '../firebaseConfig';
import { getIdToken } from 'firebase/auth';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || '/api',
  timeout: 15000,
});

// Attach ID token to requests
client.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await getIdToken(user, false);
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export default client;
```

---

// src/components/ProtectedRoute.tsx

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useSelector((s: RootState) => s.auth);
  if (loading) return <div>Loading auth...</div>;
  return user ? children : <Navigate to='/login' replace />;
}
```

---

// src/components/RoleRoute.tsx

```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export default function RoleRoute({
  children,
  allowed,
}: {
  children: JSX.Element;
  allowed: string[];
}) {
  const { user, loading } = useSelector((s: RootState) => s.auth);
  if (loading) return <div>Checking role...</div>;

  // NOTE: In this example we assume role is fetched from Firestore users collection and merged into Redux
  // For now we'll read from user.displayName for demo — replace with real `user.role` property
  const role = (user as any)?.role;
  if (!user) return <Navigate to='/login' replace />;
  if (!allowed.includes(role)) return <Navigate to='/not-authorized' replace />;
  return children;
}
```

---

// src/pages/LoginPage.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';

export default function LoginPage() {
  const { login, google } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const onGoogle = async () => {
    try {
      await google();
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='mx-auto w-96 p-6'>
      <h2 className='text-xl font-semibold'>Login</h2>
      <form onSubmit={onSubmit} className='flex flex-col gap-3'>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          type='password'
        />
        <button type='submit'>Login</button>
      </form>
      <button onClick={onGoogle}>Sign in with Google</button>
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
```

---

// src/pages/SignUpPage.tsx

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuthActions';

export default function SignUpPage() {
  const { signup } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password, displayName);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className='mx-auto w-96 p-6'>
      <h2 className='text-xl font-semibold'>Sign Up</h2>
      <form onSubmit={onSubmit} className='flex flex-col gap-3'>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder='Full name'
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          type='password'
        />
        <button type='submit'>Create account</button>
      </form>
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
}
```

---

// src/pages/Dashboard.tsx

```tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAuthActions } from '../hooks/useAuthActions';

export default function Dashboard() {
  const { user } = useSelector((s: RootState) => s.auth);
  const { logout } = useAuthActions();

  return (
    <div className='p-6'>
      <h1 className='text-2xl'>Welcome {user?.displayName || user?.email}</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

---

// src/App.tsx

```tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthListener } from './hooks/useAuth';

function AppContent() {
  useAuthListener();

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

---

## Notes & Enterprise Considerations

- **Security rules**: Always configure Firestore rules — ensure users can only read/write their own user doc.
- **Backend verification**: Use the `getIdToken()` on the server to verify requests from the frontend. The Axios interceptor attaches the token automatically.
- **Token refresh**: Firebase SDK automatically refreshes tokens; `getIdToken(user, forceRefresh)` can be used to force refresh.
- **Roles**: Store user roles in Firestore (`roles` array) or use a custom claims mechanism (requires Admin SDK). For enterprise, use custom claims set server-side and then read from token.
- **Redux Persist**: If you want to persist additional store slices, integrate `redux-persist` carefully — do not persist sensitive tokens.
- **Observability**: Add logging/telemetry (Sentry, Datadog) to track auth failures and suspicious behavior.
- **Testing**: Mock Firebase auth in unit tests using stubs and providers.

---

If you want, I can:

- Add `redux-persist` integration for non-sensitive data
- Add a sample backend verification snippet (Node.js / Spring Boot) to validate the Firebase ID token
- Wire role-based UI and admin panel with custom claims

Tell me which of those you want next and I’ll drop it right into this canvas.
