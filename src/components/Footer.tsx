
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo.svg";
import { Button, Checkbox, message } from "antd";
import { useState } from "react";
import { publicRequest } from "../makeRequest";
import { useMutation } from "react-query";
import SuccessModal from "./SuccessModal";

const Footer = () => {

    const [acceptConditions, setAcceptConditions] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const mutation = useMutation(async () => {
        const res = await publicRequest.post(`newsletters`, {email});
        return res?.data;
    },
    {
        onSuccess: () => {
            setEmail("");
            setAcceptConditions(false);
            setOpen(true);
        },
        onError: () => {
            message.error("Newsletter déjà existe");
        }
    });

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) {
            return setError("Email est requis");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            return setError("Format d'email invalide");
        }
        mutation.mutate();
    }

    const footerNavs = [
        {
            label: "Liens utiles :",
            items: [
                {
                    href: '/',
                    name: 'Accueil'
                },
                {
                    href: '/blog',
                    name: 'Blog'
                },
                {
                    href: '/contact',
                    name: 'Contact'
                },
                // {
                //     href: '/about',
                //     name: 'À propos de nous'
                // },
                {
                    href: '/plan',
                    name: 'Plan du site'
                },
            ],
        },
        {
            label: "À propos",
            items: [
                {
                    href: '/faq',
                    name: 'Faq'
                },
                {
                    href: '/cgu',
                    name: 'CGU'
                },
                {
                    href: 'politique-confidentialite',
                    name: 'Politique de confidentialité'
                },
                {
                    href: 'mentions',
                    name: 'Mentions légales'
                },
            ],
        },
        {
            label: "Réseaux sociaux",
            blanc: true,
            items: [
                {
                    href: 'https://www.facebook.com/profile.php?id=61557016658147',
                    name: 'Facebook'
                },
                {
                    href: 'https://www.instagram.com/the.tiptop_1?igsh=MWRyMDRseHkyYzZpdQ%3D%3D&utm_source=qr',
                    name: 'Instagram'
                },
                {
                    href: 'https://t.snapchat.com/wA7ZkeTF',
                    name: 'Snapchat'
                },
                {
                    href: 'https://www.tiktok.com/@thetiptop24?_t=8kXxcSBE8Y5&_r=1',
                    name: 'TikTok'
                },
            ]
        }
    ]

    return (
        <footer className="text-gray-500 px-4 py-5 max-w-screen-xl mx-auto md:px-8">
            <img alt="Logo Thé Tip Top" src={Logo} className="w-32 mb-2" />
            <div className="gap-6 justify-between md:flex">
                <div className="flex-1 flex flex-col gap-5">
                    <div className="max-w-xs">
                        <h4 className="text-gray-800 font-medium">NEWSLETTER :</h4>
                        <p className="leading-relaxed mt-2 text-[15px]">
                            Inscrivez-vous à nos communications Et accédez aux meilleures offres du moment
                        </p>
                    </div>
                    <form className="flex flex-col gap-3">
                        <div>
                            <div className="flex items-center gap-x-3">
                                <div className="relative">
                                    <svg className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        placeholder="Entrer votre email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full pl-12 pr-3 py-1.5 text-gray-500 bg-white border outline-none shadow-sm rounded-lg ${(error && error !== "") ? "border-[#ff4d4f]" : ""}`}
                                    />
                                </div>
                                <Button disabled={!acceptConditions} loading={mutation.isLoading} onClick={handleSubmit} className={`block !text-white !bg-green-700 hover:!bg-green-800 hover:!border-green-800 !outline-none shadow disabled:!bg-[#d9d9d9] disabled:!text-[#00000040] disabled:!border-[#00000040]`}>
                                    S'abonner
                                </Button>
                            </div>
                        {(error && error !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{error}</p>}
                        </div>
                        <div>
                            <Checkbox className="text-xs max-w-96 text-gray-600" checked={acceptConditions} onChange={(e) => setAcceptConditions(e.target.checked)}>
                                En cochant cette case, vous consentez à recevoir notre newsletter conformément à notre politique de confidentialité et aux règles du RGPD.
                            </Checkbox>
                        </div>
                    </form>
                </div>
                <div className="flex-1 mt-10 space-y-6 items-center justify-between sm:flex md:space-y-0 md:mt-0">
                    {
                        footerNavs?.map((item) => (
                            <ul
                                className="space-y-4"
                                key={item?.label}
                            >
                                <li className="h4 text-gray-800 font-medium">
                                    { item.label }
                                </li>
                                {
                                    item.items.map(((el) => (
                                        <li key={el?.name}>
                                            <Link
                                                target={item?.blanc ? "_blank" : ""}
                                                to={el.href}
                                                className="hover:text-green-600 hover:font-medium"
                                            
                                            >
                                                { el.name }
                                            </Link>
                                        </li>
                                    )))
                                }
                            </ul>
                        ))
                    }
                </div>
            </div>
            <div className="mt-8 py-6 border-t items-center justify-between sm:flex">
                <div className="mt-4 sm:mt-0">
                    &copy; 2023 Thé tiptop - Tous droits réservés
                </div>
            </div>
            {open && <SuccessModal
                open={open} 
                setOpen={setOpen} 
                title="Vous êtes abonné(e) ! 🎉🥳" 
                desc="Abonnement confirmé ! Préparez-vous pour des actualités exclusives." 
                submitText="Fermer"
                submitType="button"
            />}
        </footer>
    )
}


export default Footer