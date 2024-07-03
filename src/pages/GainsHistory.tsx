import { userRequest } from '../makeRequest';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Ticket } from '../types/types';
import { QRCode, Tag } from 'antd';
import { useAppSelector } from '../redux/hooks/hooks';
import moment from 'moment';
import {LoadingOutlined, CheckCircleOutlined} from '@ant-design/icons';
import TicketDetailsModal from '../components/TicketDetailsModal';
import {jwtDecode} from "jwt-decode";

const GainsHistory = () => {

    const [gains, setGains] = useState<Ticket[]>([]);
    const [filter, setFilter] = useState<string>("Tout");
    const {currentUser} = useAppSelector(state => state.auth);
    const decodedToken: DecodedToken = currentUser && jwtDecode(currentUser?.token as string);

    const getUserGains = async () => {
        try {
            const res = await userRequest.get(`tickets/user/${decodedToken?.id}`,
                {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                }
            );
            if(res.status === 200){
                setGains(res?.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

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

    const getFilteredRows = () => {
        return gains?.filter((gain) => {
            let isStatusMatch = true;
                switch (filter) {
                    case 'Actif':
                        isStatusMatch = gain?.given === true;
                        break;
                    case 'Inactif':
                        isStatusMatch = gain?.given === false;
                        break;
                    case 'Tout':
                    default:
                        isStatusMatch = true;
                        break;
            }
            return isStatusMatch;
        });
    };

    useEffect(() => {
        getUserGains();
    },[])

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
                <div className="space-y-5 text-center sm:max-w-md sm:mx-auto">
                    <motion.h1
                        variants={itemVariants}
                        className="text-gray-800 text-3xl font-extrabold sm:text-4xl"
                    >
                        Mes participations
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600"
                    >
                        Consulter ici vos historique de participations et du lots.
                    </motion.p>
                    <motion.div variants={itemVariants} className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse ">
                        <button 
                            onClick={() => setFilter('Tout')}
                            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${(filter === "Tout") && "bg-gray-100"} sm:text-sm`}>
                        Tout
                        </button>
                        <button 
                            onClick={() => setFilter('Actif')}
                            className={`px-5 py-2 text-xs font-medium text-green-600 transition-colors duration-200 ${(filter === "Actif") && "bg-gray-100"} sm:text-sm`}>
                        Récupéré
                        </button>
                        <button 
                            onClick={() => setFilter('Inactif')}
                            className={`px-5 py-2 text-xs font-medium text-[#108ee9] transition-colors duration-200 ${(filter === "Inactif") && "bg-gray-100"} sm:text-sm`}>
                        En attente
                        </button>
                    </motion.div>
                </div>
                <motion.ul
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 py-5 place-items-center">
                    {getFilteredRows()?.map((gain) => 
                        <motion.li 
                            key={gain?.id} 
                            variants={itemVariants} 
                            whileHover={{ scale: 1.03, transition: { duration: 0.3 }}}
                            whileTap={{ scale: 1, transition: { duration: 0.3 }}}
                            className="bg-[#ffffff34] rounded-lg font-Lato m-5 hover:shadow-lg shadow-sm w-60"
                        >
                            <div className="bg-[#ffffff34] rounded-t-lg p-4 !h-[255px] ">
                                <div className="font-bold">{gain?.code}</div>
                                <div>{gain?.profit?.libelle}</div>
                                <div className="flex items-center justify-center mt-2">
                                    <QRCode size={90} value={`${import.meta.env.VITE_REACT_APP_CLIENT_URL}gain/${gain?.code}`} />
                                </div>
                                <div className="flex justify-between py-2">
                                    <div className="flex flex-col gap-2">
                                        <div>Utilisé le :</div>
                                        <div className="font-bold">Récupéré :</div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div>{moment(gain?.dateOfUse).format('DD-MM-YYYY')}</div>
                                        <Tag className='w-fit' color={gain?.given === true ? "green" : "processing"} icon={gain?.given === true ? <CheckCircleOutlined /> : <LoadingOutlined />} >{gain?.given === true ? "Oui" : "En attente"}</Tag>
                                    </div>
                                </div>
                            </div>
                            <div className="relative flex flex-col items-center border-dashed justify-between border-2 bg-white border-zinc-900">
                                <div className="absolute rounded-full w-8 h-8 bg-white -left-5 -top-[17px]"></div>
                                <div className="absolute rounded-full w-8 h-8 bg-white -right-5 -top-[17px]"></div>
                            </div>
                            <div className="bg-[#ffffff34] rounded-b-lg flex justify-between items-center p-4">
                                <TicketDetailsModal gain={gain} />
                            </div>
                        </motion.li>
                    )}
                </motion.ul>
            </div>
        </motion.div>
    )
}

export default GainsHistory