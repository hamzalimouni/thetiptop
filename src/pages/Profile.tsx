import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../redux/hooks/hooks';
import { Avatar, Button, DatePicker, GetProp, Input, Popconfirm, Select, Tag, Upload, UploadProps, message } from 'antd';
import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Loading, UserInfo } from '../types/types';
import { publicRequest, userRequest } from '../makeRequest';
import locale from 'antd/es/date-picker/locale/fr_FR';
import { logout, setUserInfo } from '../redux/reducers/authSlice';
import {PlusOutlined} from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { resetAppAction } from '../redux/reducers/rootReducer';
import { useNavigate } from 'react-router-dom';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Vous ne pouvez télécharger qu\'un fichier JPG/PNG !');
    }
    return isJpgOrPng;
};

const Profile = () => {

    const {currentUser} = useAppSelector(state => state.auth);
    const [currentUserData, setCurrentUserData] = useState<UserInfo>(currentUser?.userInfo);
    const [isLoading, setIsLoading] = useState<Loading>({loading: false, title: ""});
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const decodedToken: DecodedToken = currentUser?.token && jwtDecode(currentUser?.token);
    const [errors, setErrors] = useState<Partial<UserInfo>>({});
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<UserInfo> = {};
        if (!currentUserData.firstname.trim()) {
            newErrors.firstname = "Nom est requis";
        }

        if (!currentUserData.lastname.trim()) {
            newErrors.lastname = "Prénom est requis";
        }

        if (!currentUserData.email.trim()) {
            newErrors.email = "Email est requis";
        } else if (!/\S+@\S+\.\S+/.test(currentUserData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!currentUserData.gender) {
            newErrors.gender = "Genre est requis";
        }

        if (!currentUserData.birth) {
            newErrors.birth = "Date de naissance est requise";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status !== 'uploading') {
            console.log("upload")
        }
        if (info.file.status === 'done') {
            setFile(info.file.originFileObj as File);
            getBase64(info.file.originFileObj as FileType, (url) => {
                setImageUrl(url);
            });
            message.success(`${info.file.name} l'image a été téléchargée avec succès.`);
        }
        else if (info.file.status === 'error') {
            message.error(`${info.file.name} l'image n'a pas pu être téléchargée.`);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>télécharger</div>
        </button>
    );

    const handleUpload = async() => {
        try {
            if(file){
                const formData = new FormData();
                formData.append('file', file);
                const res = await publicRequest.post(`upload`, formData);
                if(res.status === 200){
                    return res?.data;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setCurrentUserData(currentUser?.userInfo);
        setIsEdit(false);
        setFile(null);
        setImageUrl(null);
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading({loading: true, title: "updateAccount"});
        try {
            if(validateForm()){
                let imgUrl: string = "";
                if(file){
                    imgUrl = await handleUpload();
                }
                const res = await userRequest.put(`users/${decodedToken?.id}`, 
                    (imgUrl && imageUrl !== "") ? {...currentUserData, img: imgUrl} : currentUserData
                , {
                    headers: {
                        token: `Bearer ${currentUser?.token}`
                    }
                });
                if(res.status === 200) {
                    setIsEdit(false);
                    dispatch(setUserInfo(res?.data?.user));
                }
            }
        } catch (error) {
            console.log(error);
        } finally{
            setIsLoading({loading: false, title: ""});
        }
    }

    const handleDeleteAccount = async (e: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => {
        e?.preventDefault();
        setIsLoading({loading: true, title: "deleteAccount"});
        try {
            const res = await userRequest.put(`users/${decodedToken?.id}`, 
                {...currentUserData, status: false},
                {headers: {token: `Bearer ${currentUser?.token}`}
            });
            if(res.status === 200){
                dispatch(logout());
                dispatch(resetAppAction());
                const resLogout = await publicRequest.get(`auth/logout`, { withCredentials: true });
                if (resLogout.data?.success) {
                    navigate(0);
                }
                message.success("Votre compte a été supprimé avec succès");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading({loading: false, title: ""});
        }
    }

    return (
        <motion.section initial="hidden" animate="visible" variants={containerVariants} className="pt-12 pb-28">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <motion.h1
                    variants={itemVariants}
                    className="text-center text-gray-800 text-3xl font-extrabold sm:text-4xl"
                >
                    Profile
                </motion.h1>
                <div className="flex flex-col justify-center items-center py-12">
                    <div className="relative flex flex-col items-center rounded-[20px] w-[350px] sm:w-[500px] mx-auto p-4 bg-[#ffffff94] bg-clip-border shadow-2xl shadow-shadow-500">
                        <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
                            <motion.img
                                variants={itemVariants}
                                src='https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png'
                                className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
                                alt="Banner"
                            />
                            <motion.div variants={itemVariants} className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                                {currentUser?.userInfo?.img ?
                                    <img
                                        className="h-full w-full rounded-full"
                                        src={`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${currentUser?.userInfo?.img}`}
                                        alt="Avatar"
                                    />
                                    :
                                    <Avatar icon={<UserOutlined className='text-3xl' />} className='w-full h-full' />
                                }
                            </motion.div>
                        </div>
                        <div className="mt-16 flex flex-col items-center">
                            <motion.h4 variants={itemVariants} className="text-xl font-bold text-navy-700">
                                {currentUser?.userInfo?.firstname} {currentUser?.userInfo?.lastname}
                            </motion.h4>
                            <motion.p variants={itemVariants} className="text-sm font-normal text-gray-600">{currentUser?.userInfo?.email}</motion.p>
                        </div>
                        <div className="mt-6 mb-3 flex gap-14 md:!gap-14">
                            <div className="flex flex-col items-center gap-2 justify-center">
                                <motion.p variants={itemVariants} className="font-semibold text-navy-700">
                                    Statut de compte
                                </motion.p>
                                <motion.span variants={itemVariants}>
                                    <Tag color='success'>Actif</Tag>
                                </motion.span>
                                <Popconfirm
                                    title="Suppression de compte"
                                    description="Êtes-vous sûr de vouloir supprimer définitivement votre compte ?"
                                    onConfirm={handleDeleteAccount}
                                    okText="Confirmer"
                                    okType='danger'
                                    cancelText="Annuler"
                                    className='mt-5 text-xs font-semibold'
                                    placement='bottom'
                                    icon={<QuestionCircleOutlined className='!text-[#ff4d4f]' />}
                                    rootClassName="w-[360px] sm:w-[400px]"
                                    okButtonProps={{loading: isLoading.loading && isLoading.title === "deleteAccount"}}
                                >
                                    <Button danger>Supprimer mon compte</Button>
                                </Popconfirm>
                                </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="relative flex flex-col gap-5 rounded-[20px] w-[370px] sm:w-[540px] md:w-[650px] mx-auto p-8 bg-[#ffffff94] bg-clip-border shadow-2xl shadow-shadow-500">
                        <div className='flex items-center justify-between flex-col sm:flex-row gap-5'>
                            <motion.h4 variants={itemVariants} className='text-base sm:text-lg font-bold text-[#333]'>Informations personnelles :</motion.h4>
                            {
                                isEdit ?
                                    <div className='flex gap-2'>
                                        <Button
                                            type='text'
                                            onClick={handleCancel}
                                            danger
                                            className='text-sm font-semibold hover:!bg-[#ff4d4f] hover:!text-white'
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type='text'
                                            onClick={handleSubmit}
                                            loading={isLoading.loading && isLoading.title === "updateAccount"}
                                            className='text-sm font-semibold text-green-700 hover:!bg-green-700 hover:!text-white'
                                        >
                                            Enregistrer
                                        </Button>
                                    </div>
                                    :
                                    <motion.button
                                        variants={itemVariants}
                                        onClick={() => setIsEdit(true)}
                                        className='text-sm font-semibold text-blue-700 hover:underline focus:outline-none'
                                    >
                                        Modifier
                                    </motion.button>
                            }
                        </div>
                        <ul className='mt-5'>
                            {isEdit && <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='!w-16 text-[13px] sm:text-base sm:!w-28 italic font-medium'>Photo </span>:
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    multiple={false}
                                    maxCount={1}
                                    rootClassName="!w-0"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    customRequest={
                                        ({ file, onSuccess }) => {
                                        setTimeout(() => {
                                            file && onSuccess && onSuccess("ok");
                                        }, 500)}
                                    }
                                >
                                    {imageUrl ? 
                                        <img src={imageUrl} alt="photo de profile" className='w-full rounded-full' /> 
                                    : 
                                    currentUser?.userInfo?.img ?
                                        <img 
                                        src={`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${currentUser?.userInfo?.img}`}
                                        alt="photo de profile" className='w-full rounded-full' /> 
                                    :
                                        uploadButton}
                                </Upload>
                            </motion.li>}
                            <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Prénom {isEdit &&<span className='text-[#ff4d4f]'>*</span>}</span>:
                                {
                                    isEdit ?
                                        <div className='flex flex-col'>
                                            <Input
                                                type='text'
                                                value={currentUserData?.firstname}
                                                onChange={(e) => setCurrentUserData((prev) => ({...prev, firstname: e.target.value}))}
                                                className='w-[200px] focus:outline-none'
                                                status={(errors.firstname && errors.firstname !== "") ? "error" : ""}
                                            />
                                            {(errors.firstname && errors.firstname !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.firstname}</p>}
                                        </div>
                                        :
                                        <span className='block text-sm font-semibold italic text-[#444]'>{currentUser?.userInfo?.firstname}</span>
                                }
                            </motion.li>
                            <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Nom {isEdit &&<span className='text-[#ff4d4f]'>*</span>}</span>:
                                {
                                    isEdit ?
                                        <div className='flex flex-col'>
                                            <Input
                                                type='text'
                                                value={currentUserData?.lastname}
                                                onChange={(e) => setCurrentUserData((prev) => ({...prev, lastname: e.target.value}))}
                                                className='w-[200px] focus:outline-none'
                                                status={(errors.lastname && errors.lastname !== "") ? "error" : ""}
                                            />
                                            {(errors.lastname && errors.lastname !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.lastname}</p>}
                                        </div>
                                        :
                                        <span className='block text-sm font-semibold italic text-[#444]'>{currentUser?.userInfo?.lastname}</span>
                                }
                            </motion.li>
                            <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Email {isEdit &&<span className='text-[#ff4d4f]'>*</span>}</span>:
                                {
                                    isEdit ?
                                        <div className='flex flex-col'>
                                            <Input
                                                type='text'
                                                value={currentUserData?.email}
                                                onChange={(e) => setCurrentUserData((prev) => ({...prev, email: e.target.value}))}
                                                className='w-[200px] focus:outline-none'
                                                status={(errors.email && errors.email !== "") ? "error" : ""}
                                            />
                                            {(errors.email && errors.email !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.email}</p>}
                                        </div>
                                        :
                                        <span className='text-sm font-semibold italic text-[#444]'>{currentUser?.userInfo?.email}</span>
                                }
                            </motion.li>
                            <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Téléphone </span>:
                                {
                                    isEdit ?
                                        <Input
                                            type='text'
                                            value={currentUserData?.phone}
                                            onChange={(e) => setCurrentUserData((prev) => ({...prev, phone: e.target.value}))}
                                            className='w-[200px] focus:outline-none'
                                        />
                                        :
                                        <span className='text-sm font-semibold italic text-[#444]'>{currentUser?.userInfo?.phone}</span>
                                }
                            </motion.li>
                            <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Genre {isEdit &&<span className='text-[#ff4d4f]'>*</span>}</span>:
                                {
                                    isEdit ?
                                        <div className='flex flex-col'>
                                            <Select
                                                className='w-[200px] hover:border-green-700 focus:border-green-700 !shadow-none w-[200px]'
                                                value={currentUserData?.gender}
                                                onChange={(value) => setCurrentUserData((prev) => ({...prev, gender: value}))}
                                                status={(errors.gender && errors.gender !== "") ? "error" : ""}
                                            >
                                                <Select.Option value={"MALE"}>Homme</Select.Option>
                                                <Select.Option value={"FEMALE"}>Femme</Select.Option>
                                                <Select.Option value={"OTHER"}>Autre</Select.Option>
                                            </Select>
                                            {(errors.gender && errors.gender !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.gender}</p>}
                                        </div>
                                        :
                                        <span className='text-sm font-semibold italic text-[#444]'>{currentUser?.userInfo?.gender}</span>
                                }
                            </motion.li>
                            <motion.li variants={itemVariants} className='flex gap-5 border-b pb-2 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Date de naissance {isEdit &&<span className='text-[#ff4d4f]'>*</span>}</span>:
                                {
                                    isEdit ?
                                        <div className='flex flex-col'>
                                            <DatePicker
                                                className='w-[200px] hover:border-green-700 focus:border-green-700 !shadow-none w-[200px]'
                                                locale={locale}
                                                value={currentUserData?.birth ? dayjs(currentUserData?.birth) : null}
                                                onChange={(_, dateString) => setCurrentUserData((prev) => ({...prev, birth: typeof dateString === 'string' ? dateString : ""}))}
                                                status={(errors.birth && errors.birth !== "") ? "error" : ""}
                                            />
                                            {(errors.birth && errors.birth !== "") && <p className="text-[#ff4d4f] text-xs mt-1">{errors.birth}</p>}
                                        </div>
                                        :
                                        <span className='text-sm font-semibold italic text-[#444]'>{dayjs(currentUser?.userInfo?.birth).format('DD-MM-YYYY')}</span>
                                }
                            </motion.li>
                            <motion.li variants={itemVariants} className='flex gap-5 mb-2 items-center'>
                                <span className='w-16 text-[13px] sm:text-base sm:w-28 italic font-medium'>Date d'inscription </span>:
                                <span className='text-sm font-semibold italic text-[#444]'>{dayjs(currentUser?.userInfo?.createdAt).format('DD-MM-YYYY')}</span>
                            </motion.li>
                        </ul>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}

export default Profile