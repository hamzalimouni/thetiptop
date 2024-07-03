import { useState } from "react"
import { publicRequest } from "../makeRequest";
import { message } from "antd";
import { useMutation } from "react-query";
import SuccessModal from "./SuccessModal";

const Newsletter = () => {

    const [email, setEmail] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const mutation = useMutation(async () => {
        const res = await publicRequest.post(`newsletters`, {email});
        return res?.data;
    },
    {
        onSuccess: () => {
            setEmail("");
            setOpen(true);
        },
        onError: () => {
            message.success("Newsletter déjà existe");
        }
    });

    const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        mutation.mutate();
    }


    return (
        <section className="py-14 max-w-screen-xl mx-auto">
            <div className="relative overflow-hidden mx-4 px-4 py-14 rounded-2xl md:px-8 md:mx-8" style={{ background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.17) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)" }}>
                <div className="relative z-10 max-w-xl mx-auto sm:text-center">
                    <div className="space-y-3">
                        <h3 className="text-3xl text-black font-bold">
                            S'abonner to our newsletter
                        </h3>
                        <p className="text-black leading-relaxed">
                            Stay up to date with the roadmap progress, announcements and exclusive discounts feel free to sign up with your email.
                        </p>
                    </div>
                    <div className="mt-6">
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="flex items-center justify-center bg-white rounded-lg p-1 sm:max-w-md sm:mx-auto">
                            <input
                                type="email"
                                placeholder="Entrer votre email"
                                className="text-gray-500 w-full p-2 outline-none"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <button
                                onClick={handleSubmit}
                                className="py-2 px-4 text-white bg-green-700 hover:bg-green-800 rounded-md shadow"
                                style={{ background: "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.17) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)"}}
                            >
                                S'abonner
                            </button>
                        </form>
                        <p className="mt-3 max-w-lg text-[15px] text-black sm:mx-auto">
                            No spam ever, we are care about the protection of your data.
                            Read our <a className="underline" href=""> Privacy Policy </a>
                        </p>
                    </div>
                </div>
                {/* <div className="absolute inset-0 w-full h-full" style={{ background: "linear-gradient(268.24deg, rgba(59, 130, 246, 0.76) 50%, rgba(59, 130, 246, 0.545528) 80.61%, rgba(55, 48, 163, 0) 117.35%)" }}></div> */}
            </div>
            {open && <SuccessModal
                open={open} 
                setOpen={setOpen} 
                title="Vous êtes abonné(e) ! 🎉🥳" 
                desc="Abonnement confirmé ! Préparez-vous pour des actualités exclusives." 
                submitText="Fermer"
                submitType="button"
            />}
        </section>
    )
}

export default Newsletter