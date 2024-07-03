import { Breadcrumb } from 'antd';
import {motion} from 'framer-motion';
import { useEffect } from 'react';
import { HomeOutlined } from '@ant-design/icons';

const About = () => {

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
                <Breadcrumb.Item>À propos de nous</Breadcrumb.Item>
            </Breadcrumb>
            <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-28">
                <motion.h1
                    variants={itemVariants}
                    className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl"
                >
                    À propos de nous
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="text-gray-600 mx-auto text-center mt-2 max-w-[450px] font-medium"
                >
                    
                </motion.p>
                <div className="grid divide-y divide-neutral-200 max-w-4xl mx-auto mt-8 px-5">
                </div> 
            </motion.section>
        </div>
    );
}

export default About