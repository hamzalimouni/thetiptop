import { Suspense, useEffect, lazy } from 'react';
import { createBrowserRouter, Outlet, Navigate, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Layout as LayoutAntd } from 'antd';
import { jwtDecode } from 'jwt-decode';
import { useAppDispatch, useAppSelector } from './redux/hooks/hooks';
import { refreshToken } from './redux/reducers/authSlice';
import { publicRequest, userRequest } from './makeRequest';
import { setConfigs } from './redux/reducers/configSlice';
import './styles/global.scss';
import { loginGoogle } from './redux/apiCalls/authCalls';
import AntdHeader from './components/AntdHeader';

const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const Banners = lazy(() => import('./components/Banners'));
const Sidebar = lazy(() => import('./components/Sidebar'));
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Contact = lazy(() => import('./pages/Contact'));
const Faq = lazy(() => import('./pages/Faq'));
const Login = lazy(() => import('./pages/Login'));
const Newsletters = lazy(() => import('./pages/admin/Newsletters'));
const Blogs = lazy(() => import('./pages/admin/Blogs'));
const Blog = lazy(() => import('./pages/Blogs'));
const Profits = lazy(() => import('./pages/admin/Profits'));
const Users = lazy(() => import('./pages/admin/Users'));
const Tickets = lazy(() => import('./pages/admin/Tickets'));
const Roulette = lazy(() => import('./pages/Roulette'));
const GainsHistory = lazy(() => import('./pages/GainsHistory'));
const Profile = lazy(() => import('./pages/Profile'));
const Employes = lazy(() => import('./pages/admin/Employes'));
const ForgetPassword = lazy(() => import('./pages/ForgetPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const CheckGains = lazy(() => import('./pages/employe/CheckGains'));
const GainDetails = lazy(() => import('./pages/GainDetails'));
const Game = lazy(() => import('./pages/admin/Game'));
const Cgu = lazy(() => import('./pages/Cgu'));
const About = lazy(() => import('./pages/About'));
const Confidentialite = lazy(() => import('./pages/Confidentialite'));
const Plan = lazy(() => import('./pages/Plan'));
const Mentions = lazy(() => import('./pages/Mentions'));

const { Content } = LayoutAntd;
interface ProtectedRouteProps {
    children: React.ReactNode;
}

function App() {

    const { currentUser } = useAppSelector(state => state.auth);
    const { google } = useAppSelector(state => state.itemVisible);
    const decodedToken: DecodedToken = currentUser?.token && jwtDecode(currentUser?.token as string);
    const queryClient = new QueryClient();
    const dispatch = useAppDispatch();

    const callRefreshToken = async () => {
        try {
            const res = await publicRequest.post(`${import.meta.env.VITE_REACT_APP_API_URL}auth/refresh`, { refreshToken: currentUser?.refreshToken });
            dispatch(refreshToken(res?.data));
            return res?.data;
        } catch (error) {
            console.log(error);
        }
    }
    let isRefreshed: boolean;
    userRequest.interceptors.request.use(async (config) => {
        let currentDate = new Date();
        if (decodedToken.exp * 1000 < currentDate.getTime() && !isRefreshed) {
            isRefreshed = true;
            const data = await callRefreshToken();
            config.headers['token'] = `Bearer ${data?.token}`;
        }
        return config;
    }, (err) => {
        return Promise.reject(err);
    });

    const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
        if (!currentUser?.token) {
            return <Navigate to="/login" />
        }
        return children;
    }
    const EmployeProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
        if (currentUser?.token && (decodedToken?.role === "ROLE_EMPLOYE" || decodedToken?.role === "ROLE_ADMIN")) {
            return children;
        }
        return <Navigate to="/" />
    }
    const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
        if (currentUser?.token && decodedToken?.role === "ROLE_ADMIN") {
            return children;
        }
        return <Navigate to="/" />
    }

    const Layout = () => {
        return (
            <div className={`min-h-screen bg-[url('/src/assets/img/theme.png')] bg-cover bg-center`}>
                <Banners />
                <Navbar />
                <div className="min-h-[60vh]">
                    <Outlet />
                </div>
                <Footer />
            </div>
        )
    }

    const AdminLayout = () => {
        return (
            <LayoutAntd className={`min-h-screen bg-[url('/src/assets/img/theme.png')] bg-cover bg-center`}>
                <Sidebar />
                <LayoutAntd className='!ml-0 antdLg:!ml-[200px]'>
                    <AntdHeader />
                    <Content>
                        <Outlet />
                    </Content>
                </LayoutAntd>
            </LayoutAntd>
        )
    }

    const router = createBrowserRouter([
        {
            path: "/",
            element: (<Layout />),
            children: [
                {
                    path: "/",
                    element: (<Home />)
                },
                {
                    path: 'contact',
                    element: (<Contact />),
                },
                {
                    path: 'blog',
                    element: (<Blog />),
                },
                {
                    path: 'faq',
                    element: (<Faq />),
                },
                {
                    path: 'gain/:code',
                    element: (<GainDetails />),
                },
                {
                    path: "roulette",
                    element: (<Roulette />)
                },
                {
                    path: "cgu",
                    element: (<Cgu />)
                },
                {
                    path: "about",
                    element: (<About />)
                },
                {
                    path: "politique-confidentialite",
                    element: (<Confidentialite />)
                },
                {
                    path: "plan",
                    element: (<Plan />)
                },
                {
                    path: "mentions",
                    element: (<Mentions />)
                },
            ],
        },
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "gains-history",
                    element: (<GainsHistory />)
                },
                {
                    path: "profile",
                    element: (<Profile />)
                },
            ],
        },
        {
            path: "/",
            element: (
                <EmployeProtectedRoute>
                    <Layout />
                </EmployeProtectedRoute>
            ),
            children: [
                {
                    path: "check/gains",
                    element: (<CheckGains />)
                }
            ],
        },
        {
            path: "/",
            element: (
                <AdminProtectedRoute>
                    <AdminLayout />
                </AdminProtectedRoute>
            ),
            children: [
                {
                    path: 'dashboard',
                    element: <Dashboard />,
                },
                {
                    path: 'users',
                    element: <Users />,
                },
                {
                    path: 'employes',
                    element: <Employes />,
                },
                {
                    path: 'tickets',
                    element: <Tickets />,
                },
                {
                    path: 'newsletters',
                    element: <Newsletters />,
                },
                {
                    path: 'blogs',
                    element: <Blogs />,
                },
                {
                    path: 'profits',
                    element: <Profits />,
                },
                {
                    path: 'game',
                    element: <Game />,
                },
            ]
        },
        {
            path: '/login',
            element: (!currentUser?.token ? <Login /> : <Navigate to="/" />),
        },
        {
            path: '/register',
            element: (!currentUser?.token ? <Register /> : <Navigate to="/" />),
        },
        {
            path: '/forget-password',
            element: (!currentUser?.token ? <ForgetPassword /> : <Navigate to="/" />),
        },
        {
            path: '/reset-password/:token',
            element: (!currentUser?.token ? <ResetPassword /> : <Navigate to="/" />),
        },
        {
            path: '*',
            element: <NotFound />,
        }
    ]);

    const getConfigs = async () => {
        try {
            const res = await publicRequest.get('/configs');
            dispatch(setConfigs(res?.data));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getConfigs();
        (!currentUser?.token && google) && loginGoogle(dispatch);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">
                <div role="status">
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>}>
                <RouterProvider router={router} />
            </Suspense>
        </QueryClientProvider>
    )
}

export default App
