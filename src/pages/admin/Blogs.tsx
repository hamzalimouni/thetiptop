import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/DataTable"
import Header from "../../components/Header"
import { Tag } from "antd";
import { userRequest } from "../../makeRequest";
import { useQuery } from "react-query";
import { Blog } from "../../types/types";
import { useAppSelector } from "../../redux/hooks/hooks";

type BlogCount={
    data: Blog[];
    count: number;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90, disableColumnMenu: true },
    { field: 'title', headerName: 'Titre', width: 200 },
    { field: 'desc', headerName: 'Description', width: 300 },
        { field: 'img', headerName: 'Image', width: 90, renderCell(params) {
        return <img src={`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${params.value}`} alt="blog photo" className="w-10 h-10 rounded-full" />
    }, },
    { field: 'status', headerName: 'Status', width: 120, renderCell(params) {
        if(params.value === true) return <Tag color="success">Actif</Tag>
        return <Tag color="error">Inactif</Tag>
    }, }
];

const Blogs = () => {

    const {currentUser} = useAppSelector(state => state.auth);

    const {data: blogs, isLoading} = useQuery<BlogCount>(["blogs"], async() => {
        const res = await userRequest.get(`blogs`, {
            headers: {
                token: `Bearer ${currentUser?.token}`
            }
        });
        return res?.data;
    });

    return (
        <>
            <Header path={["Tableau de bord", "Blogs"]}/>
            <DataTable columns={columns} rows={Array.isArray(blogs?.data) ? blogs?.data : []} loading={isLoading} tableName="Blogues" />
        </>
    )
}

export default Blogs