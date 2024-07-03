import {motion} from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

type FaqList = {
    q: string;
    a: string;
}

const Faq = () => {
    const faqsList: FaqList[] = [
        {
            q: "Proposez-vous des thés sans caféine ?",
            a: `Oui, nous offrons une gamme de thés et d'infusions sans caféine. Vous pouvez les découvrir dans la section "Nos Thés" de notre site web "www.thetiptop.fr".`
        },
        {
            q: "Comment puis-je savoir quel thé me convient le mieux ?",
            a: "Nous avons une page dédiée à la découverte de votre thé idéal selon vos préférences de goût et les bienfaits recherchés. Vous pouvez également nous contacter directement pour une recommandation personnalisée."
        },
        {
            q: "Est-il possible de visiter votre boutique ?",
            a: "Bien sûr ! Vous pouvez visiter notre 10ème boutique qui vient d'ouvrir à Nice. Nos experts en thé seront ravis de vous accueillir et de vous guider à travers notre sélection."
        },
        {
            q: "Comment fonctionne votre jeu-concours ?",
            a: "Pour chaque achat de plus de 49€, vous recevez un ticket de caisse avec un code unique qui vous permet de participer à notre jeu-concours. Chaque ticket garantit un prix, avec la chance de gagner un an de thé gratuit !"
        },
        {
            q: "Comment puis-je vérifier si j'ai gagné au jeu-concours ?",
            a: "Rendez-vous sur notre site dédié au jeu-concours, entrez votre code et découvrez immédiatement ce que vous avez gagné. Vous pouvez réclamer votre prix en magasin ou en ligne."
        },
        {
            q: "Offrez-vous des options de livraison ?",
            a: "Nous offrons une livraison à domicile pour tous les achats effectués sur notre site de vente en ligne. Les options et les frais de livraison seront détaillés au moment de la commande."
        },
        {
            q: "Quelle est votre politique de retour ?",
            a: "Si vous n'êtes pas entièrement satisfait de votre achat, vous pouvez le retourner dans les 14 jours pour un échange ou un remboursement complet."
        },
        {
            q: "Comment Thé Tip Top s'engage-t-il dans la responsabilité sociale de l'entreprise ?",
            a: "Nous adoptons une démarche éco-responsable dans tous les aspects de notre activité, de la sélection des produits à l'emballage, et nous soutenons des initiatives locales pour le développement durable."
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
             <Breadcrumb className="bg-[#fafafa40] p-2 rounded-full pl-5 mb-3 shadow-md">
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Faq</Breadcrumb.Item>
            </Breadcrumb>
            <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-28">
                <motion.h1
                    variants={itemVariants}
                    className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl"
                >
                    Questions fréquemment posées
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-gray-600 mx-auto text-center mt-2 max-w-[450px] font-medium"
                >
                    A répondu à toutes les questions fréquemment posées. Vous êtes toujours confus ? N'hésitez pas à <Link to="/contact" className='text-green-600'> nous contacter.</Link>
                </motion.p>
                <div className="grid divide-y divide-neutral-200 max-w-4xl mx-auto mt-8 px-5">
                        {
                        faqsList.map((item) => 
                            <motion.div variants={itemVariants} className="py-4" key={item.q}>
                                <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span> {item.q}</span>
                                    <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                    </span>
                                </summary>
                                <p className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                                    {item.a}
                                </p>
                                </details>
                            </motion.div>
                        )}
                </div> 
            </motion.section>
        </div>
    );
}

export default Faq