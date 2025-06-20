import { NotFoundPage } from '~pages/NotFoundPage';
import { AboutPage } from '~pages/AboutPage';
import { LoginPage } from '~pages/LoginPage';
import { RegisterPage } from '~pages/RegisterPage';
import { ProfilePage } from '~pages/ProfilePage';
import { RootLayout } from '~/layouts/RootLayout';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { RedirectIfAuth } from '~router/ProtectedRoute/ProtectedRoute.tsx';
import { RequireAuth } from '~router/ProtectedRoute/RequireAuth';
import { CatalogPage } from '~pages/CatalogPage';
import { ProductPage } from '~pages/ProductPage';
import { CategoryPage } from '~pages/CategoryPage';
import { BasketPage } from '~pages/BasketPage/BasketPage.tsx';

export const routes = createRoutesFromElements(
  <Route path='/' element={<RootLayout />}>
    <Route index element={<CatalogPage />} />
    <Route path='catalog/category/:categoryId' element={<CategoryPage />} />
    <Route path='about' element={<AboutPage />} />
    <Route path='basket' element={<BasketPage />} />
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
