import Logo from "../assets/img/logo.svg";
import Sider from "antd/es/layout/Sider";
import { Menu, MenuProps } from "antd";
import {TeamOutlined, SolutionOutlined, RocketOutlined, AppstoreOutlined, MailOutlined, DashboardOutlined, BoldOutlined, HomeOutlined, NotificationOutlined} from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";

  const items: MenuProps["items"] = [
    {
      key: '/dashboard',
      icon: <AppstoreOutlined />,
      label: 'Tableau de bord',
    },
    {
      key: '/game',
      icon: <RocketOutlined />,
      label: 'Jeu de gros lot',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: 'Utilisateurs',
    },
    {
      key: '/employes',
      icon: <SolutionOutlined />,
      label: 'Employes',
    },
    {
      key: '/tickets',
      icon: <NotificationOutlined />,
      label: 'Tickets',
    },
    {
      key: '/profits',
      icon: <DashboardOutlined />,
      label: 'Profits',
    },
    {
      key: '/newsletters',
      icon: <MailOutlined />,
      label: 'Newsletters',
    },
    {
      key: '/blogs',
      icon: <BoldOutlined />,
      label: 'Blogs',
    },
    {
      type: 'divider',
    },
    {
      key: '/',
      icon: <HomeOutlined />,
      label: "Revenir à l'accueil",
    },
  ];

const Sidebar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuClick = (e: any) => {
    const { key } = e;
    try {
      navigate(key);
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <Sider 
        className="!bg-white !h-screen !z-50 !fixed !top-0 !left-0 !bottom-0"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={() => {
          // console.log(broken);
        }}
        onCollapse={() => {
          // console.log(collapsed, type);
        }}
      >
        <div className="p-5 flex items-center justify-center w-full">
          <img src={Logo} className="w-28 cursor-pointer" alt="Thé tip top logo" onClick={() => navigate("/")} />
        </div>
        <Menu 
          mode="inline" 
          defaultSelectedKeys={[location.pathname]} 
          items={items} 
          onClick={handleMenuClick}
        />
    </Sider>
  );
};

export default Sidebar;
