import { publicRequest } from "../makeRequest";
import { Blog } from "../types/types";
import { Link } from "react-router-dom";
import { motion  } from "framer-motion";
import { memo, useEffect, useState } from "react";

const BlogList = () => {

    const [blogs, setBlogs] = useState<Blog[]>([]);

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

    const getBlogs = async () => {
        try {
            const res = await publicRequest.get(`blogs/last-three`);
            setBlogs(res?.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBlogs();
    },[]);

    return (
        <div className="container px-6 py-14 mx-auto">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl">Derniers articles de blog.</h1>

                <p className="max-w-lg mx-auto mt-4 text-gray-500">
                    Salami mustard spice tea fridge authentic Chinese food dish salt tasty liquor. Sweet savory foodtruck
                    pie.
                </p>
            </div>

            <motion.ul
                initial="hidden"
                animate="visible"
                variants={containerVariantsUl}
                className="grid gap-x-8 gap-y-10 mt-16 sm:grid-cols-2 lg:grid-cols-3"
            >
                {Array.isArray(blogs) && blogs?.map((item) => (
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
        </div>
    );
};

export default memo(BlogList);
