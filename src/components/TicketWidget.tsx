import { QRCode, Tag } from "antd";
import { Ticket } from "../types/types";
import TicketDetailsModal from "./TicketDetailsModal";
import {LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";

type Props = {
    tickets: Ticket[] | undefined;
}

const TicketWidget = (props: Props) => {

    return (
        <>
            {props.tickets?.map((ticket) => 
                <div key={ticket?.id} className="bg-[#FAFAFA] rounded-lg font-Lato w-60 m-5 shadow-sm hover:shadow-lg">
                    <div className="bg-[#FAFAFA] rounded-t-lg p-4">
                        <div className="w-full flex flex-col items-center">
                            <span className="font-bold ">{ticket?.code}</span>
                            <span className="text-center">{ticket?.profit?.libelle}</span>
                        </div>
                        {/* <img className="py-4" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/199011/concert.png" alt="" /> */}
                        <div className="flex items-center justify-center mt-2">
                            <QRCode size={90} value={`${import.meta.env.VITE_REACT_APP_CLIENT_URL}gain/${ticket?.code}`} />
                        </div>
                        <div className="flex justify-between py-2">
                            <div className="flex flex-col gap-2">
                                <div>Utilisé :</div>
                                {/* <div>Utilisé le :</div> */}
                                {!ticket?.status && <div className="font-bold">Récupéré :</div>}
                            </div>
                            <div className="flex flex-col gap-2">
                                {/* <div>{moment(ticket?.dateOfUse).format('DD-MM-YYYY')}</div> */}
                                <Tag className='w-fit' color={ticket?.status === false ? "green" : "red"} icon={ticket?.status === false ? <CheckCircleOutlined /> : <CloseCircleOutlined />} >{ticket?.status === false ? "Oui" : "Non"}</Tag>
                                {!ticket?.status && <Tag className='w-fit' color={ticket?.given === true ? "green" : "processing"} icon={ticket?.given === true ? <CheckCircleOutlined /> : <LoadingOutlined />} >{ticket?.given === true ? "Oui" : "En attente"}</Tag>}
                            </div>
                        </div>
                    </div>
                    <div className="relative flex flex-col items-center border-dashed justify-between border-2 bg-white border-zinc-900">
                        <div className="absolute rounded-full w-8 h-8 bg-white -left-5 -top-[17px]"></div>
                        <div className="absolute rounded-full w-8 h-8 bg-white -right-5 -top-[17px]"></div>
                    </div>
                    <div className="bg-[#FAFAFA] rounded-b-lg flex justify-between items-center p-4">
                        <TicketDetailsModal key={ticket?.id} gain={ticket} />
                    </div>
                </div>
            )}
        </>
    );
};

export default TicketWidget;
