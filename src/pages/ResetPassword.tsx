import Logo from '../assets/img/logo.svg';
import { Button, Input } from 'antd';
import { useState } from 'react';

type PasswordError = {
    password?: string;
    confirmPassword?: string;
}

const ResetPassword = () => {

    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [passwordErrors, setPasswordErrors] = useState<PasswordError>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<PasswordError> = {};
        if (!password.trim()) {
            newErrors.password = "Mot de passe est requis";
        }
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = "Mot de passe est requis";
        }
        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        if(validateForm()){
            try {
                
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className={`min-h-screen bg-[url('/src/assets/img/theme.png')] bg-cover bg-center flex items-center justify-center h-screen`}>
            <div className="flex items-center justify-center rounded-lg shadow-lg">
                <div className="px-6 py-8 md:px-8">
                    <div className="flex justify-center mx-auto">
                        <img className="w-28" src={Logo} alt="logo"/>
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <h2 className="text-medium font-semibold leading-9 tracking-tight text-[#444]">Réinitialiser votre mot de passe</h2>
                        <p className="text-center text-sm text-[#555] w-96">Saisissez votre nouveau mot de passe et cliquez sur le bouton "réinitialiser mon mot de passe" pour valider la modification.</p>
                    </div>
                    <div className="mt-6">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-600"
                            htmlFor="password"
                        >
                            Nouveau mot de passe
                        </label>
                        <Input.Password id='password' value={password} onChange={(e) => setPassword(e.target.value)} status={(passwordErrors.password ? "error" : "")} />
                        {(passwordErrors.password) &&<p className="text-[#ff4d4f] text-sm mt-2">{passwordErrors.password}</p>}
                    </div>
                    <div className="mt-4">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-600"
                            htmlFor="confirmPassword"
                        >
                            Confirmer mot de passe
                        </label>
                        <Input.Password id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} status={(passwordErrors.confirmPassword ? "error" : "")} />
                        {(passwordErrors.confirmPassword) &&<p className="text-[#ff4d4f] text-sm mt-2">{passwordErrors.confirmPassword}</p>}
                    </div>
                    <div className="mt-6">
                        <Button
                            onClick={handleSubmit}
                            className="w-full px-6 text-sm font-medium tracking-wide !text-white transition-colors duration-300 transform bg-[#283618] rounded-lg hover:bg-[#283618] focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                        >
                            Réinitialiser votre mot de passe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
