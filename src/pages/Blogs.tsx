import { Link } from 'react-router-dom';
import { publicRequest } from '../makeRequest';
import { useQuery } from 'react-query';
import { Blog } from '../types/types';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Breadcrumb, Pagination } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

type BlogCount = {
    data: Blog[];
    count: number;
}

const Blogs = () => {

    const [page, setPage] = useState<number>(1);

    const {data: blogs, isLoading, refetch} = useQuery<BlogCount>(["blogs"], async() => {
        const res = await publicRequest.get(`blogs?page=${page}`);
        return res?.data;
    });

    const controls = useAnimation();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
        hover: {scale: 1.03}
    };

    const containerVariantsUl = {
        hidden: { opacity: 1, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.3,
            }
        }
    };
        
    const itemVariantsUl = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: {duration: 1.2, type: 'spring', stiffness: 100}},
    };

    useEffect(() => {
        if (!isLoading) {
            controls.start('visible');
        }
    }, [controls, isLoading]);

    useEffect(() => {
        refetch();
    }, [page]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate={controls}
            variants={containerVariants}
            className="max-w-screen-xl mx-auto px-4 md:px-8"
        >
            <Breadcrumb className="bg-[#fafafa40] p-2 rounded-full pl-5 mb-3 shadow-md">
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Blouges</Breadcrumb.Item>
            </Breadcrumb>
            <div className='pt-12 pb-28'>
            {
                isLoading ?
                    <div className="px-6 py-10 mx-auto animate-pulse">
                        <h1 className="w-48 h-2 mx-auto bg-gray-200 rounded-lg"></h1>
                        <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg "></p>
                        <p className="w-64 h-2 mx-auto mt-4 bg-gray-200 rounded-lg sm:w-80 "></p>
                        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="w-full ">
                            <div className="w-full h-64 bg-gray-300 rounded-lg "></div>
                            <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg "></h1>
                            <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg "></p>
                            </div>
                        ))}
                        </div>
                    </div>
                :   
                    <>
                        <div className="space-y-5 text-center sm:max-w-md sm:mx-auto">
                            <motion.h1
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
                                }}
                                className="text-gray-800 text-3xl font-extrabold sm:text-4xl"
                            >
                                Nos blogues
                            </motion.h1>
                            <motion.p
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.7 } },
                                }}
                                className="text-gray-600"
                            >
                                Blogs appréciés par la communauté. Mis à jour toutes les heures.
                            </motion.p>
                        </div>
                        <motion.ul
                            initial="hidden"
                            animate="visible"
                            variants={containerVariantsUl}
                            className="grid gap-x-8 gap-y-10 mt-16 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {blogs?.data?.map((item) => (
                                <motion.li
                                    key={item.id}
                                    className="w-full mx-auto group sm:max-w-sm"
                                    variants={itemVariantsUl}
                                    whileHover={{ scale: 1.03, transition: { duration: 0.3 }}}
                                    whileTap={{ scale: 1, transition: { duration: 0.3 }}}
                                >
                                <Link to={item.title}>
                                    <motion.img
                                        src={`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${item?.img}`}
                                        loading="lazy"
                                        alt={item?.title}
                                        className="w-full h-[255px] rounded-lg"
                                    />
                                    <motion.div
                                        className="mt-3 space-y-2"
                                        variants={itemVariantsUl}
                                    >
                                    <motion.h3 variants={itemVariantsUl} className="text-lg text-gray-800 duration-150 group-hover:text-indigo-600 font-semibold">
                                        {item?.title}
                                    </motion.h3>
                                    <motion.p variants={itemVariantsUl} className="text-gray-600 text-sm duration-150 group-hover:text-gray-800 line-clamp-4">
                                        {item?.desc}
                                    </motion.p>
                                    </motion.div>
                                </Link>
                                </motion.li>
                            ))
                            }
                        </motion.ul>
                        <div className='flex items-center justify-center my-12'>
                            <Pagination defaultCurrent={page} onChange={(pageN) => setPage(pageN)} total={blogs?.count} />
                        </div>
                    </>
            }
            </div>
        </motion.div>
    )
}

export default Blogs