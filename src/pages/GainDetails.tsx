import {motion} from 'framer-motion';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loading, Ticket } from '../types/types';
import { publicRequest, userRequest } from '../makeRequest';
import { Button, Result, Skeleton, Tag, message } from 'antd';
import { HomeOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAppSelector } from '../redux/hooks/hooks';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';


const GainDetails = () => {

    const [gain, setGain] = useState<Ticket | null>(null);
    const [isLoading, setIsLoading] = useState<Loading>({loading: false, title: ""});
    const [isError, setIsError] = useState<string>("");
    const { code } = useParams();
    const {currentUser} = useAppSelector(state => state.auth);
    const decodedToken: DecodedToken = currentUser?.token && jwtDecode(currentUser?.token as string);

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

    const getGainDetails = async () => {
        setIsLoading({loading: true, title: "getGain"});
        setIsError("");
        try {
            const res = await publicRequest.get(`tickets/used/${code}`);
            if(res.status === 200) {
                setGain(res.data);
            }
        } catch (error: any) {
            if(error?.response?.status === 404) return setIsError("Ticket non trouvé");
            if(error?.response?.status === 400) return setIsError("Ticket non utilisé");
            console.log(error);
        }finally {
            setIsLoading({loading: false, title: ""});
        }
    }

    useEffect(() => {
        getGainDetails();
    }, []);

    const handleSubmit = async (e:React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading({loading: true, title: "validateGain"});
        try {
            const res = await userRequest.put('tickets/employe', 
            {
                id: gain?.id,
            },
            {
                headers: {
                    token: `Bearer ${currentUser?.token}`
                }
            });
            if(res.status === 200) {
                message.success('Gain validé avec succès');
                getGainDetails();
            }
        } catch (error) {
            console.log(error);
        }finally{
            setIsLoading({loading: false, title: ""});
        }
    }
    
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
                        Detaile de gain
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600"
                    >
                        Consulter ici le detaile de votre gain.
                    </motion.p>
                </div>
                <div className={(isError && isError !== "") ? "" : "py-16" }>
                    <Skeleton loading={isLoading.loading && isLoading.title === "getGain"} active paragraph={{rows: 4}}> 
                        {(isError && isError !== "") ?
                            <Result
                                title={isError}
                                extra={
                                    <Button icon={<HomeOutlined />} key="home">Accueil</Button>
                                }
                            />
                        :    
                            <div className='flex justify-around items-center flex-col-reverse md:flex-row'>
                                <img src={`./images/${gain?.profit?.img}`} className='w-80 h-80 rounded-lg shadow-xl' alt="" />
                                <div>
                                    <div className='flex flex-col gap-5 items-center'>
                                        <h2 className='text-3xl font-semibold text-[#555] w-[350px] sm:w-[380px] text-center'>{gain?.profit?.libelle}</h2>
                                        <span>{gain?.code}</span>
                                    </div>
                                    <div className='py-10 flex flex-col'>
                                        <div className='border-b pb-2 mb-3 flex items-center justify-between'>
                                            <span className='italic '>Participant :</span>
                                            <span className='italic font-semibold text-[#444] text-sm sm:text-base'>{gain?.author?.firstname} {gain?.author?.lastname}</span>
                                        </div>
                                        <div className='border-b pb-2 mb-3 flex items-center justify-between'>
                                            <span className='italic '>Email :</span>
                                            <span className='italic font-semibold text-[#444] text-sm sm:text-base'>{gain?.author?.email}</span>
                                        </div>
                                        <div className='border-b pb-2 mb-3 flex items-center justify-between'>
                                            <span className='italic '>Utilisé :</span>
                                            <span className='italic font-semibold text-[#444] text-base'><Tag icon={<CheckCircleOutlined />} color='success'>Oui</Tag></span>
                                        </div>
                                        <div className='border-b pb-2 mb-3 flex items-center justify-between'>
                                            <span className='italic '>Utilisé le :</span>
                                            <span className='italic font-semibold text-[#444] text-sm sm:text-base'>{dayjs(gain?.dateOfUse).format('DD-MM-YYYY')}</span>
                                        </div>
                                        <div className='border-b pb-2 mb-3 flex items-center justify-between'>
                                            <span className='italic '>récupérer :</span>
                                            <span className='italic font-semibold text-[#444] text-sm sm:text-base'>
                                                {gain?.given ? 
                                                    <Tag icon={<CheckCircleOutlined />} color='success'>Oui</Tag>
                                                :
                                                    <Tag icon={<LoadingOutlined />} color='blue'>En attente</Tag>
                                                }
                                            </span>
                                        </div>
                                        {gain?.given && <div className='border-b pb-2 mb-3 flex items-center justify-between'>
                                            <span className='italic '>récupérer le :</span>
                                            <span className='italic font-semibold text-[#444] text-sm sm:text-base'>{dayjs(gain?.dateOfUse).format('DD-MM-YYYY')}</span>
                                        </div>}
                                        {(!gain?.given && (decodedToken?.role === "ROLE_ADMIN" || decodedToken?.role === "ROLE_EMPLOYE")) && 
                                            <Button 
                                                className="bg-[#00a854] mt-2 text-white hover:!text-[#00a854] hover:!border-[#00a854] hover:shadow-lg" 
                                                icon={<CheckCircleOutlined className='animate-bounce'/>} 
                                                loading={isLoading.loading && isLoading.title === "validateGain"}
                                                onClick={handleSubmit}
                                            >
                                                Valider le gain
                                            </Button>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </Skeleton>
                </div>
            </div>
        </motion.div>
    )
}

export default GainDetails