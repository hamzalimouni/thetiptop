import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Loading, User } from '../../types/types';
import { userRequest } from '../../makeRequest';
import { useAppSelector } from '../../redux/hooks/hooks';
import { AutoComplete, Avatar, Button, Card, Modal, Skeleton, Statistic, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Gift from '../../assets/img/gift.gif';
import UserTickets from '../../components/UserTickets';
import { RandomReveal } from 'react-random-reveal'
import bg from '../../assets/img/theme.png';

const { Countdown } = Statistic;

const { Meta } = Card;

type RandomTicket = {
    id: number;
    code: string;
}

const CheckGains = () => {

    const [filter, setFilter] = useState<string>("User");
    const [searchValue, setSearchValue] = useState<string>("");
    const [randomTicket, setRandomTicket] = useState<RandomTicket | null>(null);
    const { currentUser } = useAppSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState<Loading>({loading: false, title: ""});
    const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);
    const [winnersUsers, setWinnersUsers] = useState<User[]>([]);
    const { dateOfEnd, dateOfValidate } = useAppSelector(state => state.config);

    const getTicketCode = async () => {
        try {
            const res = await userRequest.get(`tickets/random`,
                {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                }
            );
            if (res.status === 200) {
                setRandomTicket(res?.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const printTicket = async (email: String) => {
        setIsLoading({ loading: true, title: "printTicket" });
        try {
            const res = await userRequest.put(`tickets/print/${randomTicket?.id}`, {
                email: email,
            },
                {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                }
            );
            if (res.status === 200) {
                setPrintModalOpen(false);
                message.success("Email envoyé avec succès");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading({ loading: false, title: "" });
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

    const getWinnersUsers = async () => {
        setIsLoading({ loading: true, title: "getWinnersUsers" });
        try {
            const res = await userRequest.get('users/winners', {
                headers: {
                    token: `Bearer ${currentUser?.token}`
                }
            });
            if (res.status === 200) {
                setWinnersUsers(res.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading({ loading: false, title: "" });
        }
    }

    const getFilteredUsers = () => {
        return winnersUsers.filter(user => {
            const userFullName = `${user?.firstname} ${user?.lastname}`.toLowerCase();
            const userEmail = user?.email?.toLowerCase();
            const ticketCodes = user?.tickets?.map(ticket => ticket?.code.toLowerCase());

            return userFullName?.includes(searchValue.toLowerCase().trim()) ||
                ticketCodes?.includes(searchValue.toLowerCase().trim()) ||
                userEmail?.includes(searchValue.toLowerCase().trim());
        });
    };

    const getAutoCpmpletOptions = () => {
        const filteredUsers = winnersUsers?.filter(user =>
            `${user?.firstname} ${user?.lastname}`?.toLowerCase().includes(searchValue.toLowerCase()) ||
            user?.email?.toLowerCase().includes(searchValue.toLowerCase().trim())
        );

        if (filter === "User") {
            return filteredUsers?.map(user => ({
                value: user?.email,
                label: (
                    <div className='flex items-center gap-2'>
                        <Avatar icon={<UserOutlined />} className='w-6 h-6' />
                        <div className='flex flex-col '>
                            <span>{user?.firstname} {user?.lastname}</span>
                            <span className='text-xs text-[#777]'>{user?.email}</span>
                        </div>
                    </div>
                ),
            }));
        } else {
            return filteredUsers
                ?.flatMap(user =>
                    user?.tickets?.map(ticket => ({
                        value: ticket?.code,
                        label: <span>{ticket?.code}</span>,
                    })) || []
                )
                .flat();
        }
    };

    const onSelect = (data: string) => {
        console.log('onSelect', data);
    };

    const onChange = (data: string) => {
        setSearchValue(data);
    };

    useEffect(() => {
        getWinnersUsers();
    }, []);

    return (
        <motion.div
            className='font-[quicksand]'
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
                <div className='text-right'>
                    <Button
                        className='hover:!border-green-700 hover:!text-green-700'
                        disabled={new Date(dateOfEnd) < new Date()}
                        onClick={() => {
                            setPrintModalOpen(true);
                            getTicketCode();
                        }}>
                        {
                            new Date(dateOfEnd) > new Date() ? "Imprimer un nouveau ticket" : "Jeu terminé"
                        }
                    </Button>
                </div>
                <div className="space-y-5 text-center sm:max-w-md sm:mx-auto">

                    <motion.h1
                        variants={itemVariants}
                        className="text-gray-800 text-3xl font-extrabold sm:text-4xl"
                    >
                        Liste des gains
                    </motion.h1>
                    <motion.p
                        variants={itemVariants}
                        className="text-gray-600"
                    >
                        Valider et distribuer les gains aux gagnants.
                    </motion.p>
                    <motion.div variants={itemVariants}>
                        {
                            new Date(dateOfEnd) > new Date() ?
                                <div className="flex gap-1 items-center justify-center bg-blue-200 py-2 mb-2 rounded-lg">
                                    <svg className="w-6 h-6 me-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
                                    </svg>
                                    <Countdown className="flex items-center justify-center font-semibold" valueStyle={{ fontSize: 15, }} value={dateOfEnd} onFinish={() => alert("finished")} format="D[J] H[h] m[m] s[s]" />
                                    <small className='mt-[2px] font-medium'>avant la fin du jeu</small>
                                </div>
                                : new Date(dateOfValidate) > new Date() ?
                                    <div className="flex gap-1 flex-col items-center justify-center bg-orange-200 py-2 mb-2 rounded-lg">
                                        <small>Le jeu est terminé ! Vous avez encore </small>
                                        <Countdown className="flex items-center justify-center font-semibold" valueStyle={{ fontSize: 15 }} value={dateOfValidate} onFinish={() => alert("finished")} format="D[J] H[h] m[m] s[s]" />
                                        <small className='mt-[2px]'>pour distribuer les lots aux gagnants</small>
                                    </div>
                                    :
                                    <div className="flex gap-1 flex-col items-center justify-center bg-red-200 py-2 mb-2 rounded-lg">
                                        <small>Le jeu est terminé ! vous ne pouvez plus distribuer les lots</small>
                                    </div>
                        }
                    </motion.div>
                    <motion.div variants={itemVariants} className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse ">
                        <button
                            onClick={() => { setFilter('User'); setSearchValue(""); }}
                            className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${(filter === "User") && "bg-gray-100"} sm:text-sm`}>
                            Utilisateur
                        </button>
                        <button
                            onClick={() => { setFilter('CodeTicket'); setSearchValue(""); }}
                            className={`px-5 py-2 text-xs font-medium text-[#108ee9] transition-colors duration-200 ${(filter === "CodeTicket") && "bg-gray-100"} sm:text-sm`}>
                            Code ticket
                        </button>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <AutoComplete
                            value={searchValue}
                            options={getAutoCpmpletOptions()}
                            className='w-[220px]'
                            onSelect={onSelect}
                            onSearch={(text) => setSearchValue(text)}
                            onChange={onChange}
                            placeholder={filter === "User" ? "Rechercher par email" : "Rechercher par code"}
                        />
                    </motion.div>
                </div >
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 py-5 mt-5 place-items-center">
                    {getFilteredUsers()?.map((user) =>
                        <Card
                            key={user?.id}
                            rootClassName='cursor-default w-full !p-0'
                            styles={{ body: { paddingBottom: 6, paddingTop: 20 } }}
                            actions={[
                                // <EyeOutlined key="show" className='text-base' />,
                                <UserTickets user={user} getUserWinners={getWinnersUsers} />,
                            ]}
                            hoverable
                        >
                            <Skeleton loading={isLoading.loading && isLoading.title === "getWinnersUsers"} avatar active>
                                <Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={`${user?.firstname} ${user?.lastname}`}
                                    description={user?.email}
                                />
                                <div className='mt-4 flex items-center justify-between'>
                                    <span className='italic text-base font-semibold text-[#777]'>Gains :</span>
                                    <div className='flex items-center gap-2'>
                                        <img src={Gift} alt="gift photo" className='w-10 h10' />
                                        <span className='text-xl font-semibold text-[#555]'>{user?.tickets?.length}</span>
                                    </div>
                                </div>
                            </Skeleton>
                        </Card>
                    )}
                </motion.div>
            </div >
            {printModalOpen && <Modal centered title="Imprimer un nouveau ticket" open={printModalOpen} onCancel={() => setPrintModalOpen(false)} footer={null} styles={{
                content: { background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover' },
                header: { backgroundColor: 'transparent' },
                footer: { backgroundColor: 'transparent' }
            }}>
                <div className='mt-5'>
                    Le code de ticket est :
                    <div className='mt-2 bg-gray-100 text-center p-3 font-bold text-xl font-[monospace]'>
                        {
                            randomTicket ?
                                <RandomReveal isPlaying duration={1.5} characters={randomTicket?.code} />
                                :
                                "Le code sera affiché ici"
                        }
                    </div>
                    <small className='mt-5 block'>Vous avez la possibilité soit de l'imprimer ou d'envoyer directement au client par email.</small>
                    <form className='flex my-5 pb-4 border-b' onSubmit={(e) => {
                        e.preventDefault();
                        let email = e.currentTarget.email.value;
                        printTicket(email)
                    }}>
                        <input type="text" name='email' className='w-full p-2 rounded-md border outline-none' placeholder='Email du client' />
                        <Button htmlType='submit' loading={isLoading.loading && isLoading.title === "printTicket"} size='large' className='ml-2 !bg-green-700 !text-white hover:!bg-green-800 hover:!border-green-800' >Envoyer</Button>
                    </form>
                    <Button onClick={() => setPrintModalOpen(false)} className='mx-auto block !bg-green-700 !text-white hover:!bg-green-800 hover:!border-green-800' >Imprimer</Button>
                </div>
            </Modal>}
        </motion.div >

    )
}

export default CheckGains