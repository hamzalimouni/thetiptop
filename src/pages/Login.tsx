import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/img/logo.svg';
import { Button, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks';
import { login } from '../redux/apiCalls/authCalls';
import LoginImg from '../assets/img/loginImg.webp';
import { setGoogle } from '../redux/reducers/itemVisibleSlice';
import { resetAuthVars } from '../redux/reducers/authSlice';

type Error = {
    email?: string;
    password?: string;
}

const Login = () => {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<Error>({});
    const {pending, error} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const startGoogle = () => {
        dispatch(setGoogle(true));
        window.open(`${import.meta.env.VITE_REACT_APP_API_URL}auth/google`, "_self");
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Error> = {};
        if (!email?.trim()) {
            newErrors.email = "Email est requis";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Format d'email invalide";
        }
        if (!password.trim()) {
            newErrors.password = "Mot de passe est requis";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async() => {
        validateForm() && await login(dispatch, {email, password}, navigate);
    }

    useEffect(() => {
        dispatch(setGoogle(false));
        dispatch(resetAuthVars());
    },[])

    return (
        <div className={`min-h-screen bg-[url('/src/assets/img/theme.png')] bg-cover bg-center flex items-center justify-center h-screen`}>
            <div className="flex w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-lg lg:max-w-4xl">
            <div
                className="hidden bg-cover lg:block lg:w-1/2"
                style={{
                backgroundImage:
                    `url(${LoginImg})`,
                }}
            ></div>

            <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
                <div className="flex justify-center mx-auto">
                    <img className="w-28" src={Logo} alt="logo"/>
                </div>
                <div
                    onClick={startGoogle}
                    className="flex items-center justify-center cursor-pointer mt-4 text-gray-600 bg-white hover:bg-[#ffffff8a] transition-colors duration-300 transform border rounded-lg"
                >
                    <div className="px-4">
                        <svg className="w-6 h-6" viewBox="0 0 40 40">
                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                            <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                            <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                            <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                        </svg>
                    </div>
                    <span className="w-5/6 px-4 py-2 font-bold text-center">
                        Se connecter avec Google
                    </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="w-1/5 border-b lg:w-1/4"></span>
                    <span className="text-xs text-center text-gray-500 uppercase ">
                        ou Se connecter avec Email
                    </span>
                    <span className="w-1/5 border-b lg:w-1/4"></span>
                </div>
                <div className="mt-4">
                    <label
                        className="block mb-2 text-sm font-medium text-gray-600 "
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <Input id='email' value={email} onChange={(e) => setEmail(e.target.value)} status={errors?.email ? "error" : ""} className='hover:border-green-700 focus:border-green-700 !shadow-none' />
                    {errors?.email &&<p className="text-[#ff4d4f] text-sm mt-2">{errors.email}</p>}
                </div>
                <div className="mt-4">
                    <div className="flex justify-between">
                        <label
                        className="block mb-2 text-sm font-medium text-gray-600 "
                        htmlFor="password"
                        >
                        Mot de passe
                        </label>
                        <Link
                            to="/forget-password"
                            className="text-xs text-gray-500 hover:underline"
                        >
                            Mot de passe oublié?
                        </Link>
                    </div>
                    <Input.Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} status={errors?.password ? "error" : ""} className='hover:border-green-700 focus:border-green-700 !shadow-none' />
                    {errors.password &&<p className="text-[#ff4d4f] text-sm mt-2">{errors.password}</p>}
                    {(error && (!errors?.password && !errors?.email)) &&<p className="text-[#ff4d4f] text-sm mt-2">Email ou mot de passe incorrect</p>}
                </div>
                <div className="mt-6">
                    <Button
                        onClick={handleSubmit}
                        loading={pending}
                        className="w-full text-sm font-medium tracking-wide !text-white transition-colors duration-300 transform !bg-green-700 hover:!bg-green-800 hover:!border-green-800 !outline-none"
                    >
                        Se connecter
                    </Button>
                </div>
                <div className="flex items-center justify-between mt-4">    
                    <span className="w-1/5 border-b  md:w-1/4"></span>
                    <Link
                        to="/register"
                        className="text-xs text-gray-500 uppercase  hover:underline"
                    >
                        ou Inscrez-vous
                    </Link>
                    <span className="w-1/5 border-b  md:w-1/4"></span>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Login;
