import { Breadcrumb, Button, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette'
import { userRequest } from '../makeRequest';
import { Loading, Ticket } from '../types/types';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks/hooks';
import ConfettiExplosion from 'react-confetti-explosion';
import moment from 'moment';
import Prizes from '../components/Prizes';
import { CheckOutlined, HomeOutlined } from '@ant-design/icons';
import infuseur from '/src/assets/img/transparent-infuseur.png';
import boitedetox from '/src/assets/img/transparent-boitedetox.png';
import boitesignature from '/src/assets/img/transparent-boitesignature.png';
import coffret39 from '/src/assets/img/transparent-coffret39.png';
import coffret69 from '/src/assets/img/transparent-coffret69.png';
import { Helmet } from "react-helmet";
import bg from '../assets/img/theme.png';

type Error = {
    error: boolean;
    msg: string;
}

const Roulette = () => {

    const [mustSpin, setMustSpin] = useState<boolean>(false);
    const [prizeNumber, setPrizeNumber] = useState<number>(-1);
    const [winOpen, setWinOpen] = useState<boolean>(false);
    const [confettiOpen, setConfettiOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<Loading>({ loading: false, title: "" });
    const [codeTicket, setCodeTicket] = useState<string>("");
    const [userTicket, setUserTicket] = useState<Ticket | null>(null);
    const [codeTicketError, setCodeTicketError] = useState<Error>({ error: false, msg: "" });
    const { currentUser } = useAppSelector(state => state.auth);
    const { dateOfValidate } = useAppSelector(state => state.config);

    const handleSpinClick = () => {
        if (!mustSpin) {
            setMustSpin(true);
        }
    };

    const handleCheckTicket = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setCodeTicketError({ error: false, msg: "" });
        if (!codeTicket || codeTicket.length === 0) {
            setCodeTicketError({ error: true, msg: "Le code du ticket est requis" });
        } else if (codeTicket.length < 10) {
            setCodeTicketError({ error: true, msg: "Le code du ticket doit contenir au moins 10 caractères" });
        } else if (codeTicket.length > 10) {
            setCodeTicketError({ error: true, msg: "Le code du ticket ne peut pas dépasser 10 caractères" });
        }
        else {
            try {
                setIsLoading({ loading: true, title: "checkTicket" });
                await new Promise(resolve => setTimeout(resolve, 2000));
                const res = await userRequest.get(`tickets/${codeTicket}`, {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                });
                const ticket: Ticket = res?.data;
                if (ticket?.status === true) {
                    setCodeTicket("");
                    setUserTicket(ticket);
                    setPrizeNumber(Number(ticket?.profitId) - 1);
                }
                else setCodeTicketError({ error: true, msg: "Le code ticket que avez-vous saisi et déjà utilisé" });
            } catch (error: any) {
                (error?.response?.status === 404) ?
                    setCodeTicketError({ error: true, msg: "Le code ticket que avez-vous saisi n'est pas valide" })
                    :
                    console.log(error);
            } finally {
                setIsLoading({ loading: false, title: "" });
            }
        }
    };

    const handleStopSpinning = async () => {
        try {
            const res = await userRequest.put(`tickets/user`,
                { id: userTicket?.id },
                {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                }
            );
            if (res.status === 200) {
                setMustSpin(false);
                setUserTicket(res?.data);
                setWinOpen(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleWinAction = () => {
        setPrizeNumber(-1);
        setUserTicket(null);
        setWinOpen(false);
    }

    useEffect(() => {
        winOpen && setTimeout(() => {
            setConfettiOpen(true);
        }, 500);
    }, [winOpen]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <Breadcrumb className="bg-[#fafafa40] p-2 rounded-full pl-5 mb-3 shadow-md">
                <Breadcrumb.Item href="/">
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Participer</Breadcrumb.Item>
            </Breadcrumb>
            <Helmet>
                <title>Roulette du Thé: Tournez, Dégustez, Gagnez!</title>
                <meta name="description" content="Laissez la Chance Vous Guider à travers un Tourbillon de Saveurs et de Prix, et Gagnez des Thés et Infusions de Qualité." />
            </Helmet>
            <div className='pt-12 pb-28'>
                <h1 className="text-gray-800 text-center text-3xl font-extrabold sm:text-4xl">Roulette du Thé: Tournez, Dégustez, Gagnez!</h1>
                <p className="text-gray-600 text-center text-sm sm:text-base mt-5">Laissez la Chance Vous Guider à travers un Tourbillon de Saveurs et de Prix!</p>
                <div className="flex flex-wrap my-10">
                    {
                        prizeNumber < 0 && (
                            <div className="w-full md:w-1/2 p-4">
                                <h2 className='font-bold'>Comment jouer ?</h2>
                                <ul className="list-disc list-inside text-gray-600 mt-2">
                                    <ol className='text-sm'>1. Obtenez un ticket de participation après un achat en magasin ou en ligne.</ol>
                                    <ol className='text-sm'>2. Saisissez le code du ticket pour vérifier votre participation</ol>
                                    <ol className='text-sm'>3. Tournez la roulette <Button
                                        disabled={true}
                                        className='p-0 rounded-full !bg-green-700 !text-white !border-white !w-[25px] !h-[25px] z-10'
                                        icon={<svg fill="#ffffff" height={10} width={10} viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M493.556 -.063c-265.602 0 -482.306 209.741 -493.5 472.594 -.765 18.027 13 19.031 13 19.031l83.813 0c16.291 0 19.146 -9.297 19.531 -17.625 9.228 -199.317 175.315 -357.688 377.156 -357.688 107.739 0 204.915 45.163 273.719 117.563l-58.813 56.875c-10.23 12.319 -10.043 27.275 5.063 31.5l247.125 49.75c21.15 5.281 46.288 -10.747 37.656 -43.656l-58.375 -227.563c-1.482 -8.615 -15.924 -22.024 -29.406 -12.406l-64.094 60.031c-89.659 -91.567 -214.627 -148.406 -352.875 -148.406zm409.625 508.5c-16.291 0 -19.146 9.297 -19.531 17.625 -9.228 199.317 -175.315 357.688 -377.156 357.688 -107.739 0 -204.915 -45.132 -273.719 -117.531l58.813 -56.906c10.229 -12.319 10.043 -27.275 -5.063 -31.5l-247.125 -49.75c-21.15 -5.281 -46.288 10.747 -37.656 43.656l58.375 227.563c1.482 8.615 15.924 22.024 29.406 12.406l64.094 -60.031c89.659 91.567 214.627 148.406 352.875 148.406 265.602 0 482.306 -209.741 493.5 -472.594 .765 -18.027 -13 -19.031 -13 -19.031l-83.813 0z"></path></g></svg>}
                                    ></Button> et gagnez un prix</ol>
                                </ul>
                                <h2 className='font-bold mt-5'>Comment récupérer votre prix ?</h2>
                                <p className="text-gray-600 text-sm mt-2">Une fois que vous avez gagné, vous recevrez un email de confirmation avec les détails de votre gain et les instructions pour le récupérer.</p>
                                <div>
                                    {
                                        new Date(dateOfValidate) <= new Date() ?
                                            <p className="text-red-600 text-sm mt-2">La date de validation des tickets est dépassée. Vous ne pouvez plus participer.</p>
                                            :
                                            currentUser?.token ?
                                                <>
                                                    <p className="text-gray-600 text-sm mt-2">Les tickets de participation sont valables jusqu'au <b>{moment(dateOfValidate).format("DD-MM-YYYY")}</b></p>
                                                    <div className="flex gap-2 items-center mt-5 ">
                                                        <Input
                                                            className='py-2 hover:border-green-700'
                                                            placeholder="Code ticket"
                                                            value={codeTicket}
                                                            onChange={(e) => setCodeTicket(e.target.value)}
                                                            count={{
                                                                show: true,
                                                                max: 10,
                                                            }}
                                                            status={codeTicketError.error ? 'error' : ''}
                                                        />
                                                        <Button
                                                            className=' w-[auto] !h-[38px] !border-0 !text-white !bg-green-700 ring-offset-2 !focus:ring-2 rounded-md'
                                                            loading={(isLoading.loading && isLoading.title === "checkTicket")}
                                                            icon={<CheckOutlined />}
                                                            onClick={handleCheckTicket}
                                                        >
                                                            Vérifier
                                                        </Button>
                                                    </div>
                                                </>
                                                :
                                                <Link to="/login" className="flex justify-center items-center gap-2 mt-5">
                                                    <Button className='animation-pulse !bg-red-100 !text-red-700 !border-red-700 text-wrap'>Vous devez être connecté pour participer</Button>
                                                </Link>
                                    }
                                </div>

                                {codeTicketError.error && <p className="text-red-500 text-sm">{codeTicketError.msg}</p>}
                            </div>
                        )
                    }
                    <div className={`${prizeNumber < 0 ? 'md:w-1/2' : ''} w-full p-4 `}>
                        <div className='relative flex justify-center'>
                            <Wheel
                                mustStartSpinning={mustSpin}
                                prizeNumber={prizeNumber}
                                data={[
                                    { option: '1', style: { backgroundColor: '#63a377', textColor: '#000' }, image: { uri: infuseur, offsetY: 150 } },
                                    { option: '2', style: { backgroundColor: '#EFF1FE', textColor: '#000' }, image: { uri: boitedetox, offsetY: 150 } },
                                    { option: '3', style: { backgroundColor: '#63a377', textColor: '#000' }, image: { uri: boitesignature, offsetY: 150 } },
                                    { option: '4', style: { backgroundColor: '#EFF1FE', textColor: '#000' }, image: { uri: coffret39, offsetY: 150 } },
                                    { option: '5', style: { backgroundColor: '#63a377', textColor: '#000' }, image: { uri: coffret69, offsetY: 150 } },
                                    { option: '6', style: { backgroundColor: '#EFF1FE', textColor: '#000' }, image: { uri: boitedetox, offsetY: 150 } },
                                ]}
                                onStopSpinning={handleStopSpinning}
                                spinDuration={0.6}
                                radiusLineColor='transparent'
                                radiusLineWidth={6}
                                backgroundColors={["#ffffff8c"]}
                                outerBorderColor='#63a377'
                                outerBorderWidth={8}
                            />
                            {
                                <Button
                                    disabled={prizeNumber < 0}
                                    className='absolute top-1/2 rounded-full !bg-green-700 !text-white !border-white !border-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 !w-[65px] !h-[65px] z-10'
                                    onClick={handleSpinClick}
                                    icon={<svg fill="#ffffff" height={30} width={30} className='mt-[5px]' viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M493.556 -.063c-265.602 0 -482.306 209.741 -493.5 472.594 -.765 18.027 13 19.031 13 19.031l83.813 0c16.291 0 19.146 -9.297 19.531 -17.625 9.228 -199.317 175.315 -357.688 377.156 -357.688 107.739 0 204.915 45.163 273.719 117.563l-58.813 56.875c-10.23 12.319 -10.043 27.275 5.063 31.5l247.125 49.75c21.15 5.281 46.288 -10.747 37.656 -43.656l-58.375 -227.563c-1.482 -8.615 -15.924 -22.024 -29.406 -12.406l-64.094 60.031c-89.659 -91.567 -214.627 -148.406 -352.875 -148.406zm409.625 508.5c-16.291 0 -19.146 9.297 -19.531 17.625 -9.228 199.317 -175.315 357.688 -377.156 357.688 -107.739 0 -204.915 -45.132 -273.719 -117.531l58.813 -56.906c10.229 -12.319 10.043 -27.275 -5.063 -31.5l-247.125 -49.75c-21.15 -5.281 -46.288 10.747 -37.656 43.656l58.375 227.563c1.482 8.615 15.924 22.024 29.406 12.406l64.094 -60.031c89.659 91.567 214.627 148.406 352.875 148.406 265.602 0 482.306 -209.741 493.5 -472.594 .765 -18.027 -13 -19.031 -13 -19.031l-83.813 0z"></path></g></svg>}
                                    loading={isLoading.loading}
                                ></Button>
                            }
                        </div>
                    </div>

                </div>
                <Prizes />
                {(userTicket?.code && userTicket?.code !== "" && winOpen) &&
                    <Modal
                        title={<div className='flex justify-center'>
                            <span className='text-xl md:text-2xl'>Félicitations !</span>
                        </div>}
                        open={winOpen}
                        closable={false}
                        centered
                        footer={[]}
                        styles={{
                            content: { background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover' },
                            header: { backgroundColor: 'transparent' },
                            footer: { backgroundColor: 'transparent' }
                        }}
                    >
                        <div className='flex flex-col items-center gap-5'>
                            {confettiOpen && <ConfettiExplosion particleCount={200} zIndex={999999} />}
                            <p className='text-medium'>Vous avez gagner : <span className='text-lg font-semibold'>{userTicket?.profit?.libelle}</span></p>
                            <img src={`./images/${userTicket?.profit?.img}`} alt="lot photo" className='w-52 rounded-md' />
                            <div className='w-full flex items-center justify-around'>
                                <div className='flex flex-col gap-2'>
                                    <span>Votre code ticket :</span>
                                    <span>Joue le :</span>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <span>{userTicket?.code}</span>
                                    <span>{moment(userTicket?.dateOfUse).format("DD-MM-YYYY")}</span>
                                </div>
                            </div>
                            <small className='text-center mt-4'>
                                Vous allez recevoir un email de confirmation avec les détails de votre gain et les instructions pour le récupérer.
                            </small>
                            <div className='flex gap-5'>
                                <Link to="/gains-history" onClick={handleWinAction}><Button>Voir mes participations</Button></Link>
                                <Button onClick={handleWinAction}>Jouer à nouveau</Button>
                            </div>
                        </div>
                    </Modal>}
            </div>
        </div>
    )
}

export default Roulette