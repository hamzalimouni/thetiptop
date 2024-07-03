import { Button, Modal, QRCode, Tag } from 'antd';
import { useState } from 'react';
import { Ticket } from '../types/types';
import moment from 'moment';
import {LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import theme from '../assets/img/theme.png';


type Props = {
    gain: Ticket;
}

const TicketDetailsModal = (props: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    const showModal = () => setOpen(true);

    const handleCancel = () => setOpen(false);
        
    return (
        <>
            <Button onClick={showModal} className="block text-sm font-bold !bg-green-700 !text-white !border-none px-4 py-1 rounded-full text-white no-underline">Détails</Button>
            {open && <Modal 
                title={<div className='pb-5 text-center'>
                    <span className="text-[#333] text-xl font-extrabold sm:text-2xl">Détails du gain</span>
                </div>} 
                centered 
                open={open} 
                onCancel={handleCancel} 
                cancelButtonProps={{className: 'w-full md:w-1/3 hover:!border-green-700 hover:!text-green-700'}} 
                cancelText="Fermer" 
                okButtonProps={{hidden: true}}
                width={600}
                styles={{ 
                    content: {background: `url(${theme})`, backgroundPosition: 'center', backgroundSize: 'cover'},
                    header: {backgroundColor: 'transparent'},
                    footer: {backgroundColor: 'transparent'}
                }}
            >
                <div className='w-full flex items-center gap-6 pb-3 flex-col md:flex-row'>
                    <div className='w-full flex flex-col items-center gap-5'>
                        <span className='font-semibold text-lg'>{props.gain?.profit?.libelle}</span>
                        <img className='rounded-md w-80' src={`./images/${props.gain?.profit?.img}`} alt="Gain Image" />
                    </div>
                    <div className='w-full flex flex-col items-center gap-4'>
                        <span className='font-semibold text-lg'>{props.gain?.code}</span>
                        <QRCode size={90} value={`${import.meta.env.VITE_REACT_APP_CLIENT_URL}gain/${props?.gain?.code}`} />
                        <div className='w-full flex items-center justify-between'>
                            <span className='font-semibold'>Utiliser :</span>
                            <Tag className='w-fit' color={props.gain?.status === false ? "green" : "red"} icon={props.gain?.status === false ? <CheckCircleOutlined /> : <CloseCircleOutlined />} >{props.gain?.status === false ? "Oui" : "Non"}</Tag>
                        </div>
                        {!props.gain?.status && <>
                            <div className='w-full flex items-center justify-between'>
                                <span className='font-semibold'>Utilisé le :</span>
                                <span>{moment(props.gain?.dateOfUse).format('DD-MM-YYYY')}</span>
                            </div>
                            <div className='w-full flex items-center justify-between'>
                                <span className='font-semibold'>Récupérer :</span>
                                <Tag className='w-fit' color={props.gain?.given === true ? "green" : "processing"} icon={props.gain?.given === true ? <CheckCircleOutlined /> : <LoadingOutlined />} >{props.gain?.given === true ? "Oui" : "En attente"}</Tag>
                            </div>
                            {props.gain?.given === true && <div className='w-full flex items-center justify-between'>
                                <span className='font-semibold'>Récupérer le :</span>
                                <span>{moment(props.gain?.dateOfGiven).format('DD-MM-YYYY')}</span>
                            </div>}
                        </>}
                    </div>
                </div>
            </Modal>}
        </>
    )
}

export default TicketDetailsModal