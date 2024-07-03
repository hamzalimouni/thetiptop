import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Tooltip, Upload, UploadProps, message } from 'antd';
import { GridColDef, GridRowModel } from '@mui/x-data-grid';
import { publicRequest } from '../makeRequest';
import { useLocation } from 'react-router-dom';
import {InboxOutlined, EditOutlined} from '@ant-design/icons';
import { useMutation, useQueryClient } from 'react-query';
import { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/fr_FR';
import { useAppSelector } from '../redux/hooks/hooks';
import bg from '../assets/img/theme.png';


const { TextArea } = Input;
const { Dragger } = Upload;

type Props = {
    columns: GridColDef[];
    tableName?: string;
    row: GridRowModel;
}

interface FormData {
    [key: string]: any;
}

const getBase64 = (file: RcFile) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
});

const UpdateModal = (props: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [inputs, setInputs] = useState<FormData>({});
    const [imgFile, setImgFile] = useState<RcFile | null>();
    const location = useLocation();
    const pathNameTable = location.pathname.split("/")[1];
    const queryClient = useQueryClient();
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const {currentUser} = useAppSelector(state => state.auth);

    const handleCancelPreview = () => setPreviewOpen(false);
    const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Vous ne pouvez télécharger qu\'un fichier JPG/PNG !');
        }
        return isJpgOrPng;
    };

    const propsDragger: UploadProps = {
        name: 'file',
        maxCount: 1,
        defaultFileList: [{uid: props.row.id, status: "done", name: props.row.img, url:`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${props.row.img}`, thumbUrl:`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${props.row.img}`}],
        onPreview: handlePreview,
        beforeUpload: beforeUpload,
        listType: 'picture',
        customRequest:({ file, onSuccess }) => {
            setTimeout(() => {
                file && onSuccess && onSuccess("ok");
            }, 500);
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                const originFileObj = info.file.originFileObj;
                setImgFile(originFileObj);
                message.success(`${info.file.name} l'image a été téléchargée avec succès.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} l'image n'a pas pu être téléchargée.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const showModal = () => setOpen(true);
    const handleCancel = () => {
        setOpen(false);
        setImgFile(null);
        setInputs({});
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    };

    const renderFormInputs = () => {
        return props.columns.map((column) => {
            if (column.field === 'id' || column.field === 'typeInscription') {
                return null;
            }
            if(column.field === 'img'){
                    return (<Form.Item label={column.headerName} key={column.field} required>
                        <Dragger {...propsDragger}>
                            <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                            </p>
                            <p className="ant-upload-text !text-sm">Cliquez ou faites glisser le fichier vers cette zone pour le télécharger.</p>
                        </Dragger>
                        <Modal centered open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancelPreview}>
                            <img alt="photo" className='w-full' src={previewImage}/>
                        </Modal>
                    </Form.Item>)
            }
            if (column.field === 'role') {
                return (
                    <Form.Item label={column.headerName} key={column.field} required>
                        <Select
                            value={inputs[column.field]}
                            defaultValue={"ROLE_USER"}
                            onChange={value => setInputs({ ...inputs, [column.field]: value })}
                        >
                            <Select.Option value="ROLE_USER">User</Select.Option>
                            <Select.Option value="ROLE_EMPLOYE">Employe</Select.Option>
                            <Select.Option value="ROLE_ADMIN">Admin</Select.Option>
                        </Select>
                    </Form.Item>
                );
            }
            if (column.field === 'gender') {
                return (
                    <Form.Item label={column.headerName} key={column.field}>
                        <Select
                            value={inputs[column.field]}
                            onChange={value => setInputs({ ...inputs, [column.field]: value })}
                            allowClear
                        >
                            <Select.Option value="MALE">Homme</Select.Option>
                            <Select.Option value="FEMALE">Femme</Select.Option>
                        </Select>
                    </Form.Item>
                );
            }
            if (column.field === 'status') {
                return (
                    <Form.Item label={column.headerName} key={column.field} required>
                        <Select
                            value={inputs[column.field]}
                            onChange={value => setInputs({ ...inputs, [column.field]: value })}
                        >
                            <Select.Option value={true}>Active</Select.Option>
                            <Select.Option value={false}>Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                );
            }
            if (column.field === 'desc') {
                return (
                <Form.Item label={column.headerName} key={column.field} required>
                    <TextArea 
                        rows={6} 
                        name={column.field}
                        value={inputs[column.field]}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                );
            }
            if (column.field === 'password') {
                return (
                <Form.Item label={column.headerName} key={column.field} required>
                    <Input.Password 
                        name={column.field}
                        value={inputs[column.field]}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                );
            }
            if (column.field === 'birth') {
                return (
                <Form.Item label={column.headerName} key={column.field}>
                    <DatePicker 
                        className='w-full'
                        name={column.field}
                        value={dayjs(inputs[column.field] || Date.now())}
                        onChange={(_, dateString) => setInputs((prevInputs) => ({...prevInputs, [column.field]: dateString}))} 
                        locale={locale}
                    />
                </Form.Item>
                );
            }
            return (
            <Form.Item label={column.headerName} key={column.field} 
                required={
                    column.field === "firstname" ||
                    column.field === "lastname" ||
                    column.field === "email" ||
                    column.field === "title"
                }
            >
                <Input
                    name={column.field}
                    value={inputs[column.field]}
                    onChange={handleInputChange}
                />
            </Form.Item>
        )});
    };

    const handleUpload = async() => {
        try {
            if(imgFile){
                const formData = new FormData();
                formData.append('file', imgFile as RcFile);
                const res = await publicRequest.post(`upload`, formData);
                if(res.status === 200){
                    return res?.data;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateMutation = useMutation(async()=>{
        let imgUrl: string = "";
        if(pathNameTable === "blogs"){
            imgUrl = await handleUpload();
        }
        const res = await publicRequest.put(`${pathNameTable === "employes" ? "users" : pathNameTable}/${props.row?.id}`, 
        (pathNameTable === "blogs" && imgUrl && imgUrl !== "") 
        ? 
            {...inputs, img: imgUrl}
        : 
            inputs,
        {
            headers: {
                token: `Bearer ${currentUser?.token}`
            }
        }
        );
        return res?.data;
    },
    {
        onSuccess: () => {
            queryClient.invalidateQueries([`${pathNameTable}`]);
            handleCancel();
            message.success(`${props.tableName} à été bien modifiée`);
        }
    });

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        updateMutation.mutate();
    }

    useEffect(()=>{
        const {id, ...others} = props.row;
        open &&setInputs(others);
    },[open, props.row])

    return (
        <>
            <Tooltip color='#9254de' title="Modifier" zIndex={1}>
                <Button type='primary' icon={<EditOutlined />} className="bg-[#9254de] hover:!bg-[#722ed1]" onClick={showModal} />
            </Tooltip>
            {open && <Modal 
                title={<div className='pb-5 text-center'>
                        <span className="text-[#333] text-xl font-extrabold sm:text-2xl">Modifier {props.tableName}</span>
                    </div>
                    } 
                open={open} 
                onOk={handleSubmit}
                okType='default' 
                onCancel={handleCancel}
                okText="Modifier"
                cancelText="Annuler"
                confirmLoading={updateMutation.isLoading}
                width={650}
                centered
                styles={{ 
                    content: {background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover'},
                    header: {backgroundColor: 'transparent'},
                    footer: {backgroundColor: 'transparent'}
                }}
            >
                <Form 
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    className='mb-10'
                >
                    {renderFormInputs()}
                </Form>
            </Modal>}
        </>
    );
};

export default UpdateModal;