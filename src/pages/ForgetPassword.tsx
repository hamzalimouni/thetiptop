import Logo from '../assets/img/logo.svg';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { publicRequest } from '../makeRequest';
import { useMutation } from 'react-query';
import SuccessModal from '../components/SuccessModal';

const ForgetPassword = () => {

    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const mutation = useMutation(async() => {
        const res = await publicRequest.post(`auth/forget-password`, {email});
        return res?.data;
    },
    {
        onSuccess: () => {
            setOpen(true);
            setEmail("");
        },
        onError: (error: any) => {
            if (error?.response?.status === 404) {
                setEmailError("Email n'existe pas");
            } else {
                console.log(error);
            }
        }
    })

    const handleSubmit = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setEmailError("");
        if (!email?.trim()) {
            return setEmailError("Email est requis");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            return setEmailError("Format d'email invalide");
        }
        try {
            mutation.mutate();
        } catch (error) {
            console.log(error);
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
                        <p className="text-center text-sm text-[#555] w-96">Entrez votre code et nous vous enverrons un lien par mail pour réinitialiser votre mot de passe.</p>
                    </div>
                    <div className="mt-6">
                        <label
                            className="block mb-2 text-sm font-medium text-gray-600"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <Input id='email' value={email} onChange={(e) => setEmail(e.target.value)} status={(emailError && emailError !== "" ? "error" : "")} />
                        {(emailError && emailError !== "") &&<p className="text-[#ff4d4f] text-sm mt-2">{emailError}</p>}
                    </div>
                    <div className="mt-6">
                        <Button
                            onClick={handleSubmit}
                            loading={mutation.isLoading}
                            className="w-full px-6 text-sm font-medium tracking-wide !text-white transition-colors duration-300 transform bg-[#283618] rounded-lg hover:bg-[#283618] focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                        >
                            Réinitialiser votre mot de passe
                        </Button>
                    </div>
                </div>
            </div>
            {open && <SuccessModal
                open={open} 
                setOpen={setOpen} 
                title="Email envoyé" 
                desc="Un e-mail a été envoyé à votre adresse e-mail enregistrée contenant un lien pour réinitialiser votre mot de passe. Veuillez vérifier votre boîte de réception." 
                submitText="Se Connecter"
                submitType="link"
                linkTo="/login"
            />}
        </div>
    );
};

export default ForgetPassword;
