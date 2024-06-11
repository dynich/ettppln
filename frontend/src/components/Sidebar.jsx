import React from "react";
import { Layout, Menu } from "antd";
import {
    BiSolidDashboard,
    BiLogOut,
    BiUser,
} from "react-icons/bi";
import { AiFillFolderOpen } from "react-icons/ai";
import { MdFolderShared } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, reset } from "../features/authSlice";

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        try {
            dispatch(LogOut());
            dispatch(reset());
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    const handleMenuItemClick = ({ key }) => {
        if (key === "logout") {
            handleLogout();
        } else if (key === "datapegawai") {
            navigate("/datapegawai");
        } else {
            navigate(`/dashboard/${key}`);
        }
    };

    const handleMenuItemClick1 = () => {
        navigate("/users");
    };

    const handleMenuItemClick2 = ({key}) => {
        if (key === "laporan") {
            navigate("/laporan");
        } else if (key === "semualembur") {
            navigate(`/laporan/${key}`);
        } else if (key === "semuapiket") {
            navigate(`/laporan/${key}`);
        } else if (key === "semuapremi") {
            navigate(`/laporan/${key}`);
        }
    };

    const handleApprovalMenuItemClick = ({ key }) => {
        navigate(`/approval/${key}`);
    };

    const menuItems = [
        {
            label: "Dashboard",
            key: "dashboard",
            icon: <BiSolidDashboard className="fs-4" />,
            items: [
                { label: "Lembur", key: "lemburs" },
                { label: "Piket", key: "pikets" },
                { label: "Premi", key: "premis" },
            ],
        },
        {
            label: "Data Pegawai",
            key: "datapegawai",
            icon: <MdFolderShared className="fs-4" />,
        },
    ];

    const renderMenuItems = (items, onClickHandler) =>
        items.map((item) => {
            if (
                item.key === "dashboard" &&
                (!user || (user.role === "admin2" || user.role === "superadmin"))
            )   
            {
                return null; 
            } else if (
                item.key === "datapegawai" &&
                (!user || (user.role === "superadmin"))
            )
            {
                return null;
                }

            return item.items ? (
                <SubMenu key={item.key} icon={item.icon} title={item.label}>
                    {item.items.map((child) => (
                        <Menu.Item key={child.key} onClick={onClickHandler}>
                            {child.label}
                        </Menu.Item>
                    ))}
                </SubMenu>
            ) : (
                <Menu.Item key={item.key} icon={item.icon} onClick={onClickHandler}>
                    {item.label}
                </Menu.Item>
            );
        });

    const determineOpenKeys = () => {
        const path = location.pathname;
        if (path.includes("/dashboard/")) {
            return ["dashboard"];
        } else if (path.includes("/approval/")) {
            return ["approval"];
        } else if (path.includes("/laporan/")) {
            return ["laporan"];
        }else {
            return []; // Tidak ada submenu yang terbuka
        }
    };

    const openKeys = determineOpenKeys();

    return (
        <Sider trigger={null}>
            <Menu
                mode="inline"
                defaultOpenKeys={openKeys}
                selectedKeys={[location.pathname.split("/").pop()]}
                style={{ width: 256 }}
            >
                {renderMenuItems(menuItems, handleMenuItemClick)}

                {user && (user.role === "admin1" || user.role === "admin2" || user.role === "superadmin") && (
                    <SubMenu key="approval" icon={<AiFillFolderOpen className="fs-4" />} title="Approval">
                        <Menu.Item key="approvallembur" onClick={handleApprovalMenuItemClick}>
                            Approval Lembur
                        </Menu.Item>
                        <Menu.Item key="approvalpiket" onClick={handleApprovalMenuItemClick}>
                            Approval Piket
                        </Menu.Item>
                        <Menu.Item key="approvalpremi" onClick={handleApprovalMenuItemClick}>
                            Approval Premi
                        </Menu.Item>
                    </SubMenu>
                )}

                {user && (user.role === "superadmin") && (
                    <Menu.Item key="users" icon={<BiUser className="fs-4" />} onClick={handleMenuItemClick1}>
                        Pengguna
                    </Menu.Item>
                        
                )}

                {user && (user.role === "superadmin") && (
                    <SubMenu key="laporan" icon={<AiFillFolderOpen className="fs-4" />} title="Laporan">
                        <Menu.Item key="semualembur" onClick={handleMenuItemClick2}>
                            Semua Lembur
                        </Menu.Item>
                        <Menu.Item key="semuapiket" onClick={handleMenuItemClick2}>
                            Semua Piket
                        </Menu.Item>
                        <Menu.Item key="semuapremi" onClick={handleMenuItemClick2}>
                            Semua Premi
                        </Menu.Item>
                    </SubMenu>
                )}

                <Menu.Item key="logout" icon={<BiLogOut className="fs-4" />} onClick={handleLogout}>
                    Keluar
                </Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;
