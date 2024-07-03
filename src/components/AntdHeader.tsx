import { Avatar, Layout } from "antd";
import { useAppDispatch, useAppSelector } from "../redux/hooks/hooks";
import { useEffect, useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../redux/reducers/authSlice";
import { resetAppAction } from "../redux/reducers/rootReducer";
import { publicRequest } from "../makeRequest";

const {Header} = Layout;

const AntdHeader = () => {

    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const {currentUser} = useAppSelector(state => state.auth);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

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
        <Header className='bg-white flex items-center justify-end'>
            <span className="text-sm font-semibold">{currentUser?.userInfo?.firstname} {currentUser?.userInfo?.lastname}</span>
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
                    <Link onClick={() => setOpenMenu(false)} to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5]" role="menuitem" tabIndex={-1} id="user-menu-item-0">Accueil</Link>
                    <Link onClick={() => setOpenMenu(false)} to="/gains-history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5]" role="menuitem" tabIndex={-1} id="user-menu-item-0">Mes participations</Link>
                    <Link onClick={() => setOpenMenu(false)} to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5]" role="menuitem" tabIndex={-1} id="user-menu-item-1">Profile</Link>
                    <span onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#e0e0e0c5] cursor-pointer" role="menuitem" tabIndex={-1} id="user-menu-item-2">Se déconnecter</span>
                </div>}
            </div>
        </Header>
    )
}

export default AntdHeader