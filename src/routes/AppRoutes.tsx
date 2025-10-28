import { useSelector } from 'react-redux';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { RootState } from '../app/store';
import LandingPage from '../pages/LandingPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import { Dashboard } from '@mui/icons-material';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to='/signin' />;
};
const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path='/signin' element={<SignIn />} />
    <Route path='/signup' element={<SignUp />} />
    <Route element={<ProtectedRoute />}>
      <Route path='/dashboard' element={<Dashboard />} />
    </Route>
    <Route path='*' element={<Navigate to='/' />} />
  </Routes>
);

export default AppRoutes;
