import { useEffect, useState } from "react";
import Header from "../../components/Header"
import TicketWidget from "../../components/TicketWidget";
import { userRequest } from "../../makeRequest";
import { useQuery } from "react-query";
import { Ticket } from "../../types/types";
import { Pagination } from "antd";
import { useAppSelector } from "../../redux/hooks/hooks";

const Tickets = () => {

    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(16);
    const [filter, setFilter] = useState<string>("Tout");
    const {currentUser} = useAppSelector(state => state.auth);

    const {data: tickets, refetch} = useQuery<Ticket[]>(["tickets"], async ({signal}) => {
        const res = await userRequest.get(`tickets?page=${page}&pageSize=${pageSize}`, {
            headers: {
                token: `Bearer ${currentUser?.token}`
            },
            signal
        });
        return res?.data;
    });

    const getFilteredRows = () => {
        return tickets?.filter((ticket) => {
            let isStatusMatch = true;
                switch (filter) {
                    case 'Actif':
                        isStatusMatch = ticket?.given === true;
                        break;
                    case 'Inactif':
                        isStatusMatch = ticket?.given === false;
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
        refetch();
    },[page, pageSize])

    return (
        <>
            <Header path={["Tableau de bord", "Tickets"]}/>
            <div className="my-12 px-4 md:px-8">
                <div className="items-start justify-between md:flex">
                    <div className="max-w-lg">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Gestion des tickets
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Page simplifiée pour une gestion efficace et sécurisée des tickets.
                        </p>
                    </div>
                </div>
                
                <div className="inline-flex mt-5 mb-3 overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
                    <button 
                        onClick={() => setFilter('Tout')}
                        className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${(filter === "Tout") && "bg-gray-100"} sm:text-sm `}>
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
                </div>
                <div className="w-full flex items-center justify-center py-5">
                    <Pagination
                        defaultCurrent={page}
                        total={500000}
                        defaultPageSize={pageSize}
                        pageSizeOptions={[16, 40, 80, 100]}
                        onShowSizeChange={(_, size) => setPageSize(size)}
                        onChange={(pageN) => setPage(pageN)}
                    />
                </div>
                {<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 place-items-center">
                    <TicketWidget tickets={getFilteredRows()} />
                </div>}
                <div className="w-full flex items-center justify-center py-5">
                    <Pagination
                        defaultCurrent={page}
                        total={500000}
                        defaultPageSize={pageSize}
                        pageSizeOptions={[16, 40, 80, 100]}
                        onShowSizeChange={(_, size) => setPageSize(size)}
                        onChange={(pageN) => setPage(pageN)}
                    />
                </div>
            </div>
        </>
    )
}

export default Tickets