import { Avatar, Skeleton, Tag } from "antd"
import Header from "../../components/Header"
import { motion } from 'framer-motion'
import { RiseOutlined, CalendarOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { useQuery } from "react-query"
import { userRequest } from "../../makeRequest"
import { useAppSelector } from "../../redux/hooks/hooks"
import { NewslettersInfo, ProfitsInfo, StatsTicket, User } from "../../types/types"
import { Chart } from "react-google-charts";
import moment from "moment"

const data = [
  ["Cadeau", "Nombre de tickets"],
  ["Infuseur à thé", 300000],
  ["Boite de 100g - Thé détox ou infusion", 100000],
  ["Boite de 100g - Thé signature", 50000],
  ["Coffret découverte 39€", 30000],
  ["Coffret découverte 69€", 20000],
];

const Dashboard = () => {

  const { currentUser } = useAppSelector(state => state.auth);
  const { dateOfStart, dateOfEnd, dateOfValidate } = useAppSelector(state => state.config);

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

  const { data: statsTickets, isLoading: statsTicketsLoading } = useQuery<StatsTicket>(['statsTickets'], async ({ signal }) => {
    const res = await userRequest.get('stats/tickets', {
      headers: {
        token: `Bearer ${currentUser?.token}`
      },
      signal
    });
    return res?.data;
  });

  const { data: topParticipants, isLoading: topParticipantsLoading } = useQuery<User[]>(['topParticipants'], async ({ signal }) => {
    const res = await userRequest.get('stats/top-participants', {
      headers: {
        token: `Bearer ${currentUser?.token}`
      },
      signal
    });
    return res?.data;
  });

  const { data: newslettersInfo, isLoading: newslettersInfoLoading } = useQuery<NewslettersInfo>(['newslettersInfo'], async ({ signal }) => {
    const res = await userRequest.get('stats/newsletters', {
      headers: {
        token: `Bearer ${currentUser?.token}`
      },
      signal
    });
    return res?.data;
  });

  const { data: profitsInfo, isLoading: profitInfoLoading } = useQuery<ProfitsInfo>(['profitsInfo'], async ({ signal }) => {
    const res = await userRequest.get('stats/profits', {
      headers: {
        token: `Bearer ${currentUser?.token}`
      },
      signal
    });
    return res?.data;
  });

  return (
    <>
      <Header path={["Tableau de bord"]} />
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 my-8 px-4 md:px-8 place-items-center"> 
          <motion.div
            variants={itemVariants}
            className="h-28 w-full rounded-lg bg-white p-3 flex items-center gap-3"
          >
            <Tag color="#fdf4ff" className="h-12 w-12 flex items-center justify-center rounded-full">
              <svg fill="#e879f9" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#e879f9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg>
            </Tag>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] text-[#444]">Total des tickets</span>
              {statsTicketsLoading ?
                <Skeleton.Button active size="small" className="!w-24"/>
              :
                <span className="text-xl font-bold text-[#333]">500 000</span>
              }
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="h-28 w-full rounded-lg bg-white p-3 flex items-center gap-3"
          >
            <Tag color="#fffbeb" className="h-12 w-12 flex items-center justify-center rounded-full">
              <svg fill="#fbbf24" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#fbbf24"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg>
            </Tag>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] text-[#444]">Les tickets restes</span>
              {statsTicketsLoading ?
                <Skeleton.Button active size="small" className="!w-24"/>
              :
                <span className="text-xl font-bold text-[#333]">{statsTickets?.unusedTickets?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
              }
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="h-28 w-full rounded-lg bg-white p-3 flex items-center gap-3"
          >
            <Tag color="#ecfeff" className="h-12 w-12 flex items-center justify-center rounded-full">
              <svg fill="#22d3ee" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#22d3ee"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg>
            </Tag>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] text-[#444]">Les tickets utilisé</span>
              {statsTicketsLoading ?
                <Skeleton.Button active size="small" className="!w-24"/>
              :
                <span className="text-xl font-bold text-[#333]">{statsTickets?.usedTickets?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
              }
            </div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="h-28 w-full rounded-lg bg-white p-3 flex items-center gap-3"
          >
            <Tag color="#ecfdf5" className="h-12 w-12 flex items-center justify-center rounded-full">
              <svg fill="#34d399" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#34d399"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg>
            </Tag>
            <div className="flex flex-col justify-center">
              <span className="text-[13px] text-[#444]">Les tickets récupérés</span>
              {statsTicketsLoading ?
                <Skeleton.Button active size="small" className="!w-24"/>
              :
                <span className="text-xl font-bold text-[#333]">{statsTickets?.takedTickets?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</span>
              }
            </div>
          </motion.div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-8 px-4 md:px-8 place-items-start">
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg w-full">
            <h2 className="text-xl font-semibold text-[#333] flex items-center gap-2 p-1">Top 5 participants <Tag color="#fdf4ff" className="rounded-full w-7 h-7 inline-flex items-center justify-center"><RiseOutlined className="text-[#e879f9] text-base" /></Tag></h2>
            <ul role="list" className="divide-y divide-gray-100">
              {
                topParticipantsLoading ?
                  <>
                    {Array.from({length: 5}, (_, index) => (
                      <li key={index} className="flex justify-between items-center gap-x-16 py-5">
                        <div className="flex items-center min-w-0 gap-x-4">
                          <Skeleton.Avatar active size={40} shape="circle"/>
                          <Skeleton.Input active size="small"/>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Skeleton.Avatar active />
                          <Skeleton.Button active size="small"/>
                        </div>
                      </li>
                    ))}
                  </>
                :
                  <>
                    {topParticipants?.map((person) => (
                      <li key={person?.id} className="flex justify-between gap-x-16 py-5">
                        <div className="flex min-w-0 gap-x-4">
                          {person?.img ?
                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" 
                              src={`${import.meta.env.VITE_REACT_APP_API_URL}getImage/${person?.img}`}
                              alt="" 
                            />
                          :
                            <Avatar className="h-12 w-12 rounded-full" icon={<UserOutlined />} />
                          }
                          <div className="min-w-0 flex-auto">
                            <p className="text-sm font-semibold leading-6 text-gray-900">{person?.lastname} {person?.firstname}</p>
                            <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <Tag color="#fdf4ff" className="h-8 w-8 flex items-center justify-center rounded-full">
                            <svg fill="#e879f9" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#e879f9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg>
                          </Tag>
                          <span className="text-base font-bold text-[#444]">{person?.tickets?.length}</span>
                        </div>
                      </li>
                    ))}
                  </>
              }
            </ul>
          </motion.div>
          <div className="w-full">
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg w-full h-[246px]">
              <h2 className="text-xl font-semibold text-[#333] flex items-center gap-2 p-1">Les dates de jeu <Tag color="#fdf4ff" className="rounded-full w-7 h-7 inline-flex items-center justify-center"><CalendarOutlined className="text-[#e879f9]" /></Tag></h2>
              <div className="grid grid-cols-3 my-8 px-4 place-items-center relative mt-14">
                <hr className="absolute w-full top-[15px] border-[#f9e8ff] z-0" />
                <div className="text-center">
                  <div className="mx-auto bg-[#f9e8ff] rounded-full p-3 w-8 h-8 flex items-center justify-center">
                    <CalendarOutlined className="text-[#e879f9] text-md" />
                  </div>
                  <p className="text-[#444] text-xs mt-2 font-semibold">{moment(dateOfStart).format('DD/MM/YYYY')}</p>
                  <small className="text-[#333] font-light">Date de début</small>
                </div>
                <div className="text-center">
                  <div className="mx-auto bg-[#ecfeff] rounded-full p-3 w-8 h-8 flex items-center justify-center">
                    <CalendarOutlined className="text-[#22d3ee] text-md" />
                  </div>
                  <p className="text-[#444] text-xs mt-2 font-semibold">{moment(dateOfEnd).format('DD/MM/YYYY')}</p>
                  <small className="text-[#333] font-light">Date de fin</small>
                </div>
                <div className="text-center">
                  <div className="mx-auto bg-[#ecfdf5] rounded-full p-3 w-8 h-8 flex items-center justify-center">
                    <CalendarOutlined className="text-[#34d399] text-md" />
                  </div>
                  <p className="text-[#444] text-xs mt-2 font-semibold">{moment(dateOfValidate).format('DD/MM/YYYY')}</p>
                  <small className="text-[#333] font-light">Date limite de récupération</small>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg w-full mt-5 h-[246px]">
              <h2 className="text-xl font-semibold text-[#333] flex items-center gap-2 p-1">Newsletters <Tag color="#fdf4ff" className="rounded-full w-7 h-7 inline-flex items-center justify-center"><MailOutlined className="text-[#e879f9]" /></Tag></h2>
              <div className="bg-white p-4 rounded-lg w-full flex justify-around text-center mt-5">
                <div className="flex items-center justify-center w-28 h-28 rounded-full bg-[#ecfdf5] font-bold">
                  {newslettersInfoLoading ?
                    <Skeleton.Node active className="!rounded-full" />
                  :
                    <span className="text-[#34d399]">
                      <p className="text-2xl">{newslettersInfo?.actifNewsletters}</p>
                      <small className="font-light">inscrits</small>
                    </span>
                  }
                </div>
                <div className="flex items-center justify-center w-28 h-28 rounded-full bg-[#ffecec] font-bold">
                  {newslettersInfoLoading ?
                    <Skeleton.Node active className="!rounded-full" />
                  :
                    <span className="text-[#f87171]">
                      <p className="text-2xl">{newslettersInfo?.inactifNewsletters}</p>
                      <small className="font-light">désinscrits</small>
                    </span>
                  }
                </div>
              </div>
            </motion.div>
          </div>
        </div >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-8 px-4 md:px-8 place-items-start">
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg w-full h-[500px]">
            <h2 className="text-xl font-semibold text-[#333] flex items-center gap-2 p-1">Les tickets <Tag color="#fdf4ff" className="rounded-full w-7 h-7 inline-flex items-center justify-center"><svg fill="#e879f9" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#e879f9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg></Tag></h2>
            <Chart
              chartType="PieChart"
              data={data}
              options={{ colors: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#f472b6'], legend: { maxLines: 2, position: 'top', textStyle: { fontSize: 10 }, alignment: 'center' }, chartArea: { height: 300, top: 100 } }}
              width={"100%"}
              height={"440px"}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg w-full h-[500px]">
            <h2 className="text-xl font-semibold text-[#333] flex items-center gap-2 p-1">Répartition des tickets <Tag color="#fdf4ff" className="rounded-full w-7 h-7 inline-flex items-center justify-center"><svg fill="#e879f9" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 30.074 30.075" xmlSpace="preserve" stroke="#e879f9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M1.606,13.595l1.91-0.948L3.952,1.641L2.291,1.575C1.412,1.54,0.672,2.223,0.638,3.102l-0.352,8.869 c-0.017,0.422,0.135,0.833,0.421,1.143C0.946,13.372,1.264,13.536,1.606,13.595z"></path> <path d="M10.387,9.051L8.628,7.197c-0.069-0.073-0.091-0.18-0.056-0.275C8.607,6.827,8.692,6.76,8.793,6.75l2.54-0.268 c0.087-0.009,0.164-0.061,0.205-0.137L12.761,4.1c0.049-0.089,0.144-0.143,0.244-0.139c0.101,0.004,0.19,0.065,0.232,0.157 l1.039,2.335c0.036,0.08,0.107,0.137,0.194,0.153l0.891,0.166l4.827-2.394l0.083-2.091L5.895,1.719l-0.394,9.946l4.95-2.456 C10.444,9.151,10.427,9.095,10.387,9.051z"></path> <path d="M23.838,2.975c0.479,0,0.938,0.099,1.357,0.273c-0.262-0.468-0.748-0.796-1.323-0.819l-1.66-0.066l-0.041,1.03 l0.098-0.048C22.753,3.104,23.297,2.975,23.838,2.975z"></path> <path d="M0.884,16.123c-0.378,0.188-0.666,0.52-0.801,0.917c-0.135,0.399-0.104,0.837,0.082,1.215l4.646,9.361 C5.087,28.176,5.652,28.5,6.237,28.5c0.238,0,0.479-0.054,0.706-0.167l1.984-0.982L2.868,15.14L0.884,16.123z"></path> <path d="M29.909,15.165l-4.646-9.362c-0.275-0.56-0.842-0.884-1.427-0.884c-0.236,0-0.479,0.053-0.706,0.167L21.147,6.07 l6.06,12.211l1.983-0.983c0.378-0.188,0.667-0.519,0.801-0.917C30.126,15.981,30.097,15.543,29.909,15.165z"></path> <path d="M4.608,14.276l6.06,12.21l14.799-7.342l-6.06-12.212L4.608,14.276z M19.854,19.577c-0.047,0.09-0.142,0.146-0.24,0.145 l-2.979-0.069c-0.087-0.002-0.169,0.039-0.221,0.109l-1.746,2.412c-0.06,0.081-0.16,0.122-0.26,0.104 c-0.1-0.017-0.182-0.088-0.211-0.187l-0.853-2.854c-0.024-0.083-0.089-0.149-0.172-0.176l-2.834-0.915 c-0.096-0.031-0.167-0.114-0.182-0.214c-0.015-0.102,0.029-0.2,0.112-0.258l2.448-1.692c0.072-0.049,0.115-0.131,0.115-0.219 l-0.007-2.978c0-0.101,0.057-0.194,0.148-0.239c0.09-0.045,0.198-0.035,0.278,0.026l2.368,1.807 c0.069,0.053,0.16,0.069,0.243,0.041l2.832-0.926c0.096-0.031,0.2-0.005,0.271,0.067c0.07,0.072,0.095,0.179,0.062,0.274 l-1.032,2.94l1.837,2.517C19.892,19.378,19.899,19.488,19.854,19.577z"></path> </g> </g> </g> </g></svg></Tag></h2>
            {profitInfoLoading ? 
            <Skeleton active className="h-96 flex items-center justify-center" paragraph={{rows: 4}} /> :
            <>
            {
              Array.isArray(profitsInfo) && profitsInfo.length > 0 &&
                <Chart
                chartType="ColumnChart"
                className="p-4"
                width="100%"
                height="400px"
                data={[["Tickets", "Reste", "Utilisé"]].concat(Array.isArray(profitsInfo) ? profitsInfo : [])}
                options={{
                  legend: { position: 'bottom' }, bar: { groupWidth: '75%' },
                  isStacked: true, colors: ['#e879f9', '#34d399'], chartArea: { height: 300 }
                }}
              />
            }
            </>
            }
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export default Dashboard