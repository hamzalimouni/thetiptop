import Header from "../../components/Header";
import { Card } from "antd";
import { userRequest } from "../../makeRequest";
import { useQuery } from "react-query";
import { Profit } from "../../types/types";
import { useAppSelector } from "../../redux/hooks/hooks";

const Profits = () => {

    const {currentUser} = useAppSelector(state => state.auth);

    const {data: profits} = useQuery<Profit[]>(["profits"], async({signal}) => {
        const res = await userRequest.get(`profits`, {
            headers: {
                token: `Bearer ${currentUser?.token}`
            },
            signal
        });
        return res?.data;
    });

    return (
        <>
            <Header path={["Tableau de bord", "Profits"]}/>
            <div className="my-12 px-4 md:px-8">
                <div className="items-start justify-between md:flex">
                    <div className="max-w-lg">
                        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                            Gestion des profits
                        </h3>
                        <p className="text-gray-600 mt-2">
                            Page simplifiée pour une gestion efficace et sécurisée des profits.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-5 gap-y-8 my-10 place-items-center">
                    {profits?.map((item) => 
                        {
                            return (
                                <Card
                                    key={item?.id}
                                    hoverable
                                    className="w-[280px] shadow-md cursor-default"
                                    cover={
                                    <img
                                        alt={item?.libelle}
                                        src={`./images/${item?.img}`}
                                        className="!w-full !h-[230px]"
                                    />
                                    }
                                >
                                    <div className="w-full flex flex-col gap-3 !h-[160px]">
                                        <span className="text-lg text-center font-semibold">{item?.libelle}</span>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-full flex items-center justify-between">
                                                <span>Pourcentage :</span>
                                                <span className="text-base font-semibold text-[#333]">{item?.percentage}%</span>
                                            </div>
                                            <div className="w-full flex items-center justify-between">
                                                <span>Quantité Total :</span>
                                                <span className="text-base font-semibold text-[#333]">{item?.quantityTotal}</span>
                                            </div>
                                            <div className="w-full flex items-center justify-between">
                                                <span>Quantité Utilisé :</span>
                                                <span className="text-base font-semibold text-[#333]">{item?.quantityRemaining}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        }
                    )}
                </div>
            </div>
        </>
    )
}

export default Profits;