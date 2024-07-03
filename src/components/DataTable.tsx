import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Button, Popconfirm, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import AddModal from './AddModal';
import { useLocation } from 'react-router-dom';
import { userRequest } from '../makeRequest';
import UpdateModal from './UpdateModal';
import { useMutation, useQueryClient } from 'react-query';
import { useAppSelector } from '../redux/hooks/hooks';

type Props = {
    columns: GridColDef[];
    rows: any[];
    loading: boolean;
    tableName: string;
}

const DataTable = (props: Props) => {

    const [searchText, setSearchText] = useState<string>("");
    const [filter, setFilter] = useState<string>("Tout");
    const [hasStatusField, setHasStatusField] = useState<boolean>(false);
    const {currentUser} = useAppSelector(state => state.auth);
    const location = useLocation();
    const pathNameTable = location.pathname.split("/")[1];
    const queryClient = useQueryClient();

    const getFilteredRows = () => {
        return props.rows?.filter((row) => {
            const isTextMatch = props.columns?.some(({ field }) => {
                const value = row[field]?.toString().toLowerCase();
                return value?.includes(searchText.toLowerCase());
            });
            let isStatusMatch = true;
            if (hasStatusField) {
                switch (filter) {
                    case 'Actif':
                        isStatusMatch = row?.status === true;
                        break;
                    case 'Inactif':
                        isStatusMatch = row?.status === false;
                        break;
                    case 'Tout':
                    default:
                        isStatusMatch = true;
                        break;
                }
            }
            return isTextMatch && isStatusMatch;
        });
    };

    const deleteMutation = useMutation(async(id: GridRowId) => {
        const res = await userRequest.delete(`${pathNameTable}/${id}`, {
            headers: {
                token: `Bearer ${currentUser?.token}`
            }
        });
        return res?.data;
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries([`${pathNameTable}`]);
            message.success(`${props?.tableName} à été bien supprimée`);
        }
    })

    const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: GridRowId) => {
        e.preventDefault();
        deleteMutation.mutate(id);
    }

    useEffect(() => {
        const statusFieldExists = props.columns?.some(column => column.field === 'status');
        setHasStatusField(statusFieldExists);
    }, [props.columns]);

    const actionsColumn: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell(params) {
                return (
                    <div className='flex gap-3'>
                        <UpdateModal columns={props.columns} tableName={props?.tableName} row={params.row} />
                        <Popconfirm
                            title={`Supprimer ${pathNameTable}`}
                            description={`Vous voulez vraiment supprimer cette ${pathNameTable}`}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            okText="Supprimer"
                            cancelText="Annuler"
                            okButtonProps={{loading: deleteMutation.isLoading}}
                            onConfirm={(e) => e && handleDelete(e, params.id)}
                            placement='bottom'
                            okType='danger'
                        >
                            <Tooltip color='#ff4d4f' title="Supprimer" zIndex={1}>
                                <Button type='primary' loading={deleteMutation.isLoading} icon={<DeleteOutlined />} className="bg-[#ff4d4f] hover:!bg-[#f5222d]" />
                            </Tooltip>
                        </Popconfirm>
                    </div>
                )
            },
        }
    ];

    return (
        <div className="my-12 px-4 md:px-8">
            <div className="items-start justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                        Gestion des {props.tableName}
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Page simplifiée pour une gestion efficace et sécurisée des {props.tableName}.
                    </p>
                </div>
                {(pathNameTable !== "profits") && <div className="mt-3 md:mt-0">
                    <AddModal columns={props.columns} tableName={props?.tableName} />
                </div>}
            </div>
            <div className="mt-6 md:flex md:items-center md:justify-between">
            {hasStatusField && 
                <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg rtl:flex-row-reverse">
                    <button 
                        onClick={() => setFilter('Tout')}
                        className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 ${(filter === "Tout") && "bg-gray-100"} sm:text-sm`}>
                    Tout
                    </button>

                    <button 
                        onClick={() => setFilter('Actif')}
                        className={`px-5 py-2 text-xs font-medium text-green-600 transition-colors duration-200 ${(filter === "Actif") && "bg-gray-100"} sm:text-sm`}>
                    Actif
                    </button>

                    <button 
                        onClick={() => setFilter('Inactif')}
                        className={`px-5 py-2 text-xs font-medium text-red-600 transition-colors duration-200 ${(filter === "Inactif") && "bg-gray-100"} sm:text-sm`}>
                    Inactif
                    </button>
                </div>
            }
            <div className="relative flex items-center mt-4 md:mt-0">
                <span className="absolute">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 mx-3 text-gray-400"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                </svg>
                </span>
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Rechercher..."
                    className="block w-full py-1.5 pr-5 text-gray-700 bg-white border border-gray-200 rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                />
            </div>
        </div>
            <div style={{ width: '100%', marginTop: 50, marginBottom: 50 }}>
                <DataGrid
                    className='bg-white'
                    rows={getFilteredRows()}
                    columns={props.columns?.concat(actionsColumn)}
                    initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                    }}
                    pageSizeOptions={[10, 20, 30, 50]}
                    loading={props.loading}
                    disableRowSelectionOnClick
                    autoHeight
                    disableColumnMenu
                    slotProps={{ pagination: { labelRowsPerPage: 'Lignes par page' } }}
                    localeText={{ noRowsLabel: `Aucune ligne pour ${props.tableName}` }}
                    columnVisibilityModel={
                        {password: false}
                    }
                />
            </div>
        </div>
    )
}

export default DataTable