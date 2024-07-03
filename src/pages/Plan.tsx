import {motion} from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


const Plan = () => {

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
        <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-28">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <motion.h1
                    variants={itemVariants}
                    className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl"
                >
                    Plan du site
                </motion.h1>
                <div className="grid divide-y divide-neutral-200 max-w-xl mx-auto mt-10 px-5">
                    <Link to="/"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">Accueil</motion.p></Link>
                    <Link to="/roulette"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">Participer</motion.p></Link>
                    <Link to="/blog"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">Blog</motion.p></Link>
                    <Link to="/contact"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">Contact</motion.p></Link>
                    <Link to="/about"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">À propos de nous</motion.p></Link>
                    <Link to="/faq"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">Faq</motion.p></Link>
                    <Link to="/cgu"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">CGU</motion.p></Link>
                    <Link to="/politique-confidentialite"><motion.p variants={itemVariants} className="py-4 hover:font-medium hover:text-green-700">Politique de confidentialité</motion.p></Link>
                </div> 
            </div>
        </motion.section>
    )
}

export default Plan