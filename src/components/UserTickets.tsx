import { useState } from "react";
import { User } from "../types/types"
import { Avatar, Button, Divider, Modal, Tag, message } from "antd";
import { UserOutlined, SyncOutlined, CheckCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { userRequest } from "../makeRequest";
import { useAppSelector } from "../redux/hooks/hooks";
import bg from '../assets/img/theme.png';


type Props = {
    user: User;
    getUserWinners: () => void;
}

const UserTickets = (props: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("Inactif");
    const { currentUser } = useAppSelector(state => state.auth);
    const { dateOfValidate } = useAppSelector(state => state.config);

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const getFilteredRows = () => {
        return props?.user?.tickets?.filter((gain) => {
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

    const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>, id: number) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await userRequest.put('tickets/employe',
                {
                    id,
                },
                {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                });
            if (res.status === 200) {
                await props.getUserWinners();
                message.success('Gain validé avec succès');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button
                className="bg-green-700 text-white hover:!text-green-700 hover:!border-green-700 hover:shadow-lg"
                onClick={showModal}
                disabled={new Date(dateOfValidate) <= new Date()}
            >
                Voir les gains
            </Button>
            {open && <Modal
                className="font-[quicksand]"
                centered
                title="Détails du compte"
                open={open}
                onCancel={handleCancel}
                cancelText="Fermer"
                okButtonProps={{ hidden: true }}
                cancelButtonProps={{ className: "w-full md:w-1/3 hover:!border-green-700 hover:!text-green-700" }}
                width={650}
                styles={{
                    content: { background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover' },
                    header: { backgroundColor: 'transparent' },
                    footer: { backgroundColor: 'transparent' }
                }}
            >
                <div>
                    <div>
                        <div className="flex flex-col items-center gap-2">
                            <Avatar size={80} icon={<UserOutlined />} />
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-semibold">{props.user.firstname} {props.user.lastname}</span>
                                <span className="text-sm">{props.user.email}</span>
                            </div>
                        </div>
                        <div>
                            <div className="pb-8 mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 h-1/2"></div>
                                    <div className="relative max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
                                        <div className="max-w-4xl mx-auto">
                                            <dl className="bg-white rounded-lg shadow-lg sm:grid sm:grid-cols-3">
                                                <div className="flex flex-col p-6 text-center border-t border-gray-100 sm:border-0 sm:border-r">
                                                    <dt className="order-2 mt-2 text-base font-medium leading-6 text-gray-500" id="item-1">
                                                        Participations
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold leading-none text-indigo-600" aria-describedby="item-1">
                                                        {props?.user?.tickets?.length}
                                                    </dd>
                                                </div>
                                                <div
                                                    className="flex flex-col p-6 text-center border-t border-b border-gray-100 sm:border-0 sm:border-l sm:border-r">
                                                    <dt className="order-2 mt-2 text-base font-medium leading-6 text-gray-500">
                                                        Gains récupérés
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold leading-none text-indigo-600">
                                                        {props?.user?.tickets?.filter((gain) => gain?.given === true)?.length}
                                                    </dd>
                                                </div>
                                                <div className="flex flex-col p-6 text-center border-t border-gray-100 sm:border-0 sm:border-l">
                                                    <dt className="order-2 mt-2 text-base font-medium leading-6 text-gray-500">
                                                        Gains en attente
                                                    </dt>
                                                    <dd className="order-1 text-xl font-extrabold leading-none text-indigo-600">
                                                        {props?.user?.tickets?.filter((gain) => gain?.given === false)?.length}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex items-center justify-center">
                            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse ">
                                <button
                                    onClick={() => setFilter('Tout')}
                                    className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${(filter === "Tout") && "bg-gray-100"} sm:text-sm`}>
                                    Tout
                                </button>
                                <button
                                    onClick={() => setFilter('Actif')}
                                    className={`px-5 py-2 text-xs font-medium text-green-600 transition-colors duration-200 ${(filter === "Actif") && "bg-gray-100"} sm:text-sm`}>
                                    Récupérés
                                </button>
                                <button
                                    onClick={() => setFilter('Inactif')}
                                    className={`px-5 py-2 text-xs font-medium text-[#108ee9] transition-colors duration-200 ${(filter === "Inactif") && "bg-gray-100"} sm:text-sm`}>
                                    En attente
                                </button>
                            </div>
                        </div>
                        <ul
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 place-items-center">
                            {getFilteredRows()?.map((gain) =>
                                <li
                                    key={gain?.id}
                                    className="bg-[#ffffff34] rounded-lg font-Lato m-5 shadow-md hover:shadow-xl w-60"
                                >
                                    <div className="bg-[#ffffff34] rounded-t-lg p-4">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="font-bold">{gain?.code}</span>
                                            <span className="text-center">{gain?.profit?.libelle}</span>
                                        </div>
                                        <div className="flex justify-between pt-3">
                                            <div className="flex flex-col gap-2">
                                                <div>Utilisé le :</div>
                                                <div className="font-bold">Récupérer :</div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div>{moment(gain?.dateOfUse).format('DD-MM-YYYY')}</div>
                                                <Tag className='w-fit' color={gain?.given === true ? "green" : "processing"} icon={gain?.given === true ? <CheckCircleOutlined /> : <SyncOutlined spin />} >{gain?.given === true ? "Oui" : "En attente"}</Tag>
                                            </div>
                                        </div>
                                    </div>
                                    <Divider className="!m-0" />
                                    <div className={`py-4 ${gain?.given === false ? "flex items-center justify-center gap-4" : "px-3"}`}>
                                        {/* <Button
                                            className="bg-[#108ee9] text-white hover:shadow-lg"
                                            icon={<EyeOutlined />}
                                            size="small"
                                        >
                                            Voir +
                                        </Button> */}
                                        {gain?.given === false &&
                                            <Button
                                                className=" bg-green-700 text-white hover:!text-green-700 hover:!border-green-700 hover:shadow-lg"
                                                icon={<CheckCircleOutlined className="animate-bounce" />}
                                                // size="large"
                                                onClick={(e) => handleSubmit(e, gain?.id)}
                                                loading={isLoading}
                                            >
                                                Valider le gain
                                            </Button>}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </Modal>}
        </>
    )
}

export default UserTickets