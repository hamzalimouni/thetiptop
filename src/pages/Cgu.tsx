import { Breadcrumb } from 'antd';
import {motion} from 'framer-motion';
import { useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';

type CguList = {
    q: string;
    a: string | object;
    list: boolean;
}

const Cgu = () => {
    const cguList: CguList[] = [
        {
            q: "Acceptation des Conditions",
            a: `En accédant et en utilisant le Service, vous reconnaissez avoir lu, compris et 
                accepté les présentes conditions générales d'utilisation. Si vous n'acceptez pas 
                ces conditions, veuillez ne pas utiliser le Service.`,
            list: false
        },
        {
            q: "Utilisation du Service",
            a: {
                a1: `Vous devez avoir au moins 16 ans pour participer aux jeux de concours proposés par TheTipTop.`,
                a2: `Vous êtes responsable de toutes les activités associées à votre compte.`,
                a3: `Vous vous engagez à utiliser le Service conformément aux règles et aux lois en vigueur.`
            },
            list: true
        },
        {
            q: "Compte Utilisateur",
            a: {
                a1: `Vous devez fournir des informations exactes et complètes lors de la création de votre compte.`,
                a2: `Vous êtes responsable du maintien de la confidentialité de votre mot de passe.`,
                a3: `Vous êtes responsable de toutes les activités sur votre compte, qu'elles soient autorisées ou non par vous.`
            },
            list: true
        },
        {
            q: "Participation aux Concours",
            a: {
                a1: `Les jeux de concours proposés sur TheTipTop sont soumis à des règles spécifiques publiées sur le site. En participant, vous acceptez ces règles.`,
                a2: `Les gagnants des concours seront notifiés conformément aux procédures définies dans les règles du concours.`
            },
            list: true
        },
        {
            q: "Propriété Intellectuelle",
            a: {
                a1: `Le contenu du Service, y compris les jeux de concours, est protégé par des 
                    droits d'auteur, des marques de commerce et d'autres droits de propriété 
                    intellectuelle détenus par TheTipTop.`,
                a2: `Vous vous engagez à ne pas copier, reproduire, distribuer ou créer des 
                    œuvres dérivées à partir du contenu du Service sans autorisation écrite.`
            },
            list: true
        },
        {
            q: "Modifications du Service et des Conditions",
            a: {
                a1: `TheTipTop se réserve le droit de modifier, suspendre ou interrompre le Service à tout moment`,
                a2: `TheTipTop se réserve le droit de modifier les présentes conditions 
                    générales d'utilisation à tout moment. Les modifications prendront effet dès 
                    leur publication sur le Service.`
            },
            list: true
        },
        {
            q: "Limitation de Responsabilité",
            a: {
                a1: `Le Service est fourni "tel quel" et "tel que disponible". TheTipTop ne 
                    garantit pas l'exactitude, l'exhaustivité, la pertinence ou la disponibilité du Service.`,
                a2: ` En aucun cas, TheTipTop ne sera responsable des dommages directs, 
                    indirects, accessoires, spéciaux, consécutifs ou punitifs résultant de l'utilisation 
                    ou de l'incapacité à utiliser le Service.`
            },
            list: true
        }
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
                <Breadcrumb.Item>Conditions Générales d'Utilisation</Breadcrumb.Item>
            </Breadcrumb>
            <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-28">
                <motion.h1
                    variants={itemVariants}
                    className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl"
                >
                    Conditions Générales d'Utilisation
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-gray-600 mx-auto text-center mt-2 max-w-[450px] font-medium"
                >
                    En utilisant le site web TheTipTop et les services associés (ci-après dénommés 
                    "le Service"), vous acceptez les conditions générales d'utilisation énoncées ci dessous
                </motion.p>
                <div className="grid divide-y divide-neutral-200 max-w-4xl mx-auto mt-8 px-5">
                        {
                        cguList.map((item) => 
                            <motion.div variants={itemVariants} className="py-4" key={item.q}>
                                <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                    <span> {item.q}</span>
                                    <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
                                    </svg>
                                    </span>
                                </summary>
                                {!item.list ?
                                    <p className="text-neutral-600 ml-2 mt-3 group-open:animate-fadeIn">
                                        {typeof item.a === 'string' ? item.a : ''}
                                    </p>
                                    :
                                    <ul className="text-neutral-600 ml-5 mt-3 group-open:animate-fadeIn list-disc">
                                        {Object.values(item.a).map((value, index) => 
                                            <li key={index}>{value}</li>
                                        )}
                                    </ul>
                                }
                                </details>
                            </motion.div>
                        )}
                </div> 
            </motion.section>
        </div>
    );
}

export default Cgu