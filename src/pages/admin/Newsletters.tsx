import Header from "../../components/Header"
import { userRequest } from "../../makeRequest";
import { GridColDef } from "@mui/x-data-grid";
import { Tag } from "antd";
import { useQuery } from "react-query";
import { Newsletter } from "../../types/types";
import { useAppSelector } from "../../redux/hooks/hooks";
import DataTable from "../../components/DataTable";

type NewsletterCount = {
    data: Newsletter[];
    count: number;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120, disableColumnMenu: true },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'status', headerName: 'Status', width: 150, renderCell(params) {
        if(params.value === true) return <Tag color="success">Actif</Tag>
        return <Tag color="error">Inactif</Tag>
    }, }
];

const Newsletters = () => {

    const {currentUser} = useAppSelector(state => state.auth);

    const {data: newsletters, isLoading} = useQuery<NewsletterCount>(["newsletters"], async({signal}) => {
        const res = await userRequest.get(`newsletters`, {
            headers: {
                token: `Bearer ${currentUser?.token}`
            },
            signal
        });
        return res?.data;
    });

    return (
        <>
            <Header path={["Tableau de bord", "Newsletters"]}/>
            <DataTable columns={columns} rows={(Array.isArray(newsletters?.data) && newsletters?.data?.length > 0) ? newsletters?.data : []} loading={isLoading} tableName="Newsletters" />
        </>
    )
}

export default Newsletters