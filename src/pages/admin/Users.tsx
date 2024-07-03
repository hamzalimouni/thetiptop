import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/DataTable"
import Header from "../../components/Header"
import { Tag } from "antd";
import { userRequest } from "../../makeRequest";
import moment from "moment";
import { User } from "../../types/types";
import { useQuery } from "react-query";
import { useAppSelector } from "../../redux/hooks/hooks";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80, disableColumnMenu: true,},
    { field: 'firstname', headerName: 'Prénom', width: 150 },
    { field: 'lastname', headerName: 'Nom', width: 150 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'password', headerName: 'Mot de passe', width: 100,},
    { field: 'role', headerName: 'Role', width: 120, valueFormatter(params) {
        return params?.value === 'ROLE_USER' ? 'User' : params?.value === 'ROLE_EMPLOYE' ? 'Employe' : 'Admin';
    },},
    { field: 'gender', headerName: 'Genre', width: 100 },
    { field: 'birth', headerName: 'Date de naissance', width: 120, valueFormatter(params) {
        return (params.value && params.value !== null) ? moment(params.value).format('DD-MM-YYYY') : null;
    }, },
    { field: 'phone', headerName: 'Téléphone', width: 150 },
    { field: 'typeInscription', headerName: 'Inscription', width: 120 },
    { field: 'status', headerName: 'Status', width: 120, renderCell(params) {
        if(params.value === true) return <Tag color="success">Actif</Tag>
        return <Tag color="error">Inactif</Tag>
    }, }
];

const Users = () => {

    const {currentUser} = useAppSelector(state => state.auth);

    const {data: users, isLoading} = useQuery<User[]>(["users"], async({signal}) => {
        const res = await userRequest.get(`users`, {
            headers: {
                token: `Bearer ${currentUser?.token}`
            },
            signal
        });
        return res?.data;
    });

    return (
        <>
            <Header path={["Tableau de bord", "Utilisateurs"]}/>
            <DataTable columns={columns} rows={(Array.isArray(users) && users?.length > 0) ? users : []} loading={isLoading} tableName="Utilisateurs" />
        </>
    )
}

export default Users