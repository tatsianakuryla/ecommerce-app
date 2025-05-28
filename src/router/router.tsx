import { NotFoundPage } from '~pages/Not-found-page.tsx';
import { AboutPage } from '~pages/About-page.tsx';
import { LoginPage } from '~pages/Login-page.tsx';
import { MainPage } from '~pages/Main-page.tsx';
import { RegisterPage } from '~pages/Register-page.tsx';
import { ProfilePage } from '~pages/Profile-page.tsx';
import { RootLayout } from '~/layouts/RootLayout';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { RedirectIfAuth } from '~components/Protected-route/Protected-route.tsx';
import { RequireAuth } from '~components/Protected-route/RequireAuth.tsx';

export const routes = createRoutesFromElements(
  <Route path='/' element={<RootLayout />}>
    <Route index element={<MainPage />} />
    <Route path='about' element={<AboutPage />} />
    <Route element={<RequireAuth />}>
      <Route path='profile' element={<ProfilePage />} />
    </Route>
    <Route element={<RedirectIfAuth />}>
      <Route path='login' element={<LoginPage />} />
      <Route path='register' element={<RegisterPage />} />
    </Route>
    <Route path='*' element={<NotFoundPage />} />
  </Route>,
);

export const router = createBrowserRouter(routes);
