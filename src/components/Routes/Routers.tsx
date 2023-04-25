import { IssueDetailPage } from '@src/pages/IssueDetailPage';
import { IssuesPage } from '@src/pages/IssuesPage';
import { LoginPage } from '@src/pages/LoginPage';
import {
  Link,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import { LayoutElement } from '../Layout/Layout';
import { ProtectRoutes } from './ProtectRoutes';
import { ErrorPage } from '@src/pages/ErrorPage';

export const Routers = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<LoginPage />} />
        <Route element={<ProtectRoutes />}>
          <Route
            path="/issues"
            element={<LayoutElement />}
            handle={{
              crumb: () => <Link to="/issues">Issues</Link>,
            }}
          >
            <Route index element={<IssuesPage />} />
            <Route
              path="/issues/detail/:detailId"
              element={<IssueDetailPage />}
              handle={{
                crumb: (id: number) => (
                  <Link to={`/issues/detail/${id}`} state={{ id }}>
                    Detail
                  </Link>
                ),
              }}
            />
          </Route>
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};
