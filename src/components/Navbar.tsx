import { useEffect, useRef, useState } from 'react'
import Logo from '../assets/img/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { publicRequest } from '../makeRequest'
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks'
import { logout } from '../redux/reducers/authSlice'
import { jwtDecode } from 'jwt-decode'
import { resetAppAction } from '../redux/reducers/rootReducer'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const Navbar = () => {

    const [state, setState] = useState<boolean>(false);
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const { currentUser } = useAppSelector(state => state.auth);
    const decodedToken: DecodedToken = currentUser?.token && jwtDecode(currentUser?.token as string);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const navigation = [
        { title: "Accueil", path: "/" },
        { title: "Participer", path: "/roulette" },
        { title: "Blog", path: "/blog" },
        { title: "Contact", path: "/contact" },
        { title: "Faq", path: "/faq" },
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            dispatch(logout());
            dispatch(resetAppAction());
            const res = await publicRequest.get(`auth/logout`, { withCredentials: true });

            if (res.data?.success) {
                navigate(0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav className={`py-4 md:text-sm ${state ? "shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" : ""}`}>
            <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
                <div className="flex items-center justify-between md:block">
                    <Link to="/">
                        <img
                            src={Logo}
                            width={100}
                            height={50}
                            alt="Thé tip top logo"
                        />
                    </Link>
                    <div className="md:hidden">
                        <button className="menu-btn text-gray-500 hover:text-gray-800"
                            onClick={() => setState(!state)}
                        >
                            {
                                state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )
                            }
                        </button>
                    </div>
                </div>
                <div className={`flex-1 items-center mt-5 md:mt-0 md:flex ${state ? 'block' : 'hidden'} `}>
                    <ul className="justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                        {
                            navigation.map((item, idx) => 
                                <li key={idx} className="text-gray-700 hover:text-gray-900">
                                    <Link onClick={() => setState(false)} to={item.path} className="block font-medium hover:font-semibold">
                                        {item.title}
                                    </Link>
                                </li>
                            )
                        }
                    </ul>
                    <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
                        {!currentUser?.token ?
                            <>
                                <Link to="/register" className="block text-gray-700 hover:text-gray-900 font-medium">
                                    S'inscrire
                                </Link>
                                <Link to="/login" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-700 hover:bg-green-800 rounded-full md:inline-flex">
                                    Se connecter
                                </Link>
                            </>
                            :
                            <>
                                {currentUser?.token &&
                                    <Link
                                        to={
                                            decodedToken?.role === "ROLE_ADMIN" ? "/dashboard" :
                                                decodedToken?.role === "ROLE_EMPLOYE" ? "/check/gains" :
                                                    "/roulette"
                                        }
                                        className="py-2 px-4 text-white font-medium bg-green-700 hover:bg-green-800 rounded-md shadow"
                                    >
                                        {
                                            decodedToken?.role === "ROLE_ADMIN" ? "Dashboard" :
                                                decodedToken?.role === "ROLE_EMPLOYE" ? "Distribuer les gains" :
                                                    "Participer"
                                        }
                                    </Link>
                                }
                                <div className="relative ml-3">
                                    <div>
                                        <button onClick={() => setOpenMenu((prev) => !prev)} type="button" className="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                            <span className="absolute -inset-1.5"></span>
                                            <span className="sr-only">Open user menu</span>
                                            {currentUser?.userInfo?.img ?
                                                <img 
                                                    className="h-8 w-8 rounded-full"
                                                    src={`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${currentUser?.userInfo?.img}`}
                                                    alt="Photo de profile" 
                                                />
                                            :
                                                <Avatar className="h-8 w-8 rounded-full" icon={<UserOutlined />} />
                                            }
                                        </button>
                                    </div>
                                    {openMenu && <div ref={menuRef} className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                                        <Link onClick={() => setOpenMenu(false)} to="/gains-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5]" role="menuitem" tabIndex={-1} id="user-menu-item-0">Mes participations</Link>
                                        <Link onClick={() => setOpenMenu(false)} to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5]" role="menuitem" tabIndex={-1} id="user-menu-item-1">Profile</Link>
                                        <span onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5] cursor-pointer" role="menuitem" tabIndex={-1} id="user-menu-item-2">Se déconnecter</span>
                                    </div>}
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
