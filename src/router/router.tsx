import { NotFoundPage } from '~pages/Not-found-page';
import { AboutPage } from '~pages/About-page';
import { LoginPage } from '~pages/Login-page';
import { RegisterPage } from '~pages/Register-page';
import { ProfilePage } from '~pages/Profile-page';
import { RootLayout } from '~/layouts/RootLayout';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { RedirectIfAuth } from '~components/Protected-route/Protected-route';
import { RequireAuth } from '~components/Protected-route/RequireAuth';
import { CatalogPage } from '~pages/Catalog-page';
import { ProductPage } from '~pages/Product-page';
import { CategoryPage } from '~pages/Category-page.tsx';

export const routes = createRoutesFromElements(
  <Route path='/' element={<RootLayout />}>
    <Route index element={<CatalogPage />} />
    <Route path='catalog/category/:categoryId' element={<CategoryPage />} />
    <Route path='about' element={<AboutPage />} />
    <Route path='catalog/:productId' element={<ProductPage />} />
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
