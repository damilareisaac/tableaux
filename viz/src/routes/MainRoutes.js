import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// sample page routing
const DataPage = Loadable(lazy(() => import('views/data-page')));
const AnalyticsPage = Loadable(lazy(() => import('views/analytics-page')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/data-load',
            element: <DataPage />
        },
        {
            path: '/analytics',
            element: <AnalyticsPage />
        }
    ]
};

export default MainRoutes;
