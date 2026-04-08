import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import logo from "../logo.png";
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import { KeyboardArrowDownRounded, LogoutOutlined, SettingsOutlined } from "@mui/icons-material";


const Navbar = () => {

    const isAdmin = apiService.isAdmin();
    const isAuthenticated = apiService.isAuthenticated();
    const isAuditor = apiService.isAuditor();

    const [showModal, setShowModal] = useState(false);
    const [navbarUser, setNavbarUser] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isUserMenuOpen = Boolean(userMenuAnchorEl);
    const isProfileSection = location.pathname === "/profile" || location.pathname === "/update-profile";
    const userPillClassName = `navbar-user-pill${isProfileSection || isUserMenuOpen ? " navbar-user-pill-active" : ""}`;

    const getNavClassName = (isActive) => {
        return `navbar-link${isActive ? " navbar-link-active" : ""}`;
    };

    useEffect(() => {
        let isMounted = true;

        const fetchNavbarUser = async () => {
            if (!isAuthenticated) {
                setNavbarUser(null);
                return;
            }

            try {
                const response = await apiService.getMyProfile();
                if (!isMounted) return;

                if (response.data?.statusCode === 200) {
                    setNavbarUser(response.data.data);
                } else {
                    setNavbarUser(null);
                }
            } catch (error) {
                if (!isMounted) return;
                setNavbarUser(null);
            }
        };

        fetchNavbarUser();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated]);

    const userDisplayName = useMemo(() => {
        const fullName = `${navbarUser?.firstName || ""} ${navbarUser?.lastName || ""}`.trim();
        if (fullName) return fullName;
        if (navbarUser?.email) return navbarUser.email.split("@")[0];
        return "Account";
    }, [navbarUser]);

    const userInitials = useMemo(() => {
        const first = navbarUser?.firstName?.[0] || "";
        const last = navbarUser?.lastName?.[0] || "";

        if (first || last) {
            return `${first}${last}`.toUpperCase();
        }

        if (navbarUser?.email?.[0]) {
            return navbarUser.email[0].toUpperCase();
        }

        return "U";
    }, [navbarUser]);

    const handleLogout = () => {
        setShowModal(true)
    }

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleMenuLogout = () => {
        handleUserMenuClose();
        handleLogout();
    };

    const confirmLogout = () => {
        apiService.logout();
        setShowModal(false)
        navigate("/login")
    }

    const cancelLogout = () => {
        setShowModal(false);
    };


    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img
                        src={logo}
                        alt="Shark Bank"
                        className="navbar-logo-img"
                        loading="eager"
                        decoding="async"
                    />
                    <span className="navbar-logo-text">Shark Bank</span>
                </Link>
                <ul className="navbar-menu">
                    <li className="navbar-item">
                        <NavLink
                            to="/home"
                            className={({ isActive }) => getNavClassName(isActive || location.pathname === "/")}
                        >
                            Home
                        </NavLink>
                    </li>
                    {isAuthenticated ? (
                        <>
                            <li className="navbar-item">
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) => getNavClassName(isActive || location.pathname === "/update-profile")}
                                >
                                    Profile
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink
                                    to="/transfer"
                                    className={({ isActive }) => getNavClassName(isActive)}
                                >
                                    Transfer
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink
                                    to="/transactions"
                                    className={({ isActive }) => getNavClassName(isActive)}
                                >
                                    Transactions
                                </NavLink>
                            </li>
                            {(isAdmin || isAuditor) && (
                                <>
                                    <li className="navbar-item">
                                        <NavLink
                                            to="/auditor-dashboard"
                                            className={({ isActive }) => getNavClassName(isActive)}
                                        >
                                            Auditor Dashboard
                                        </NavLink>
                                    </li>

                                    <li className="navbar-item">
                                        <NavLink
                                            to="/deposit"
                                            className={({ isActive }) => getNavClassName(isActive)}
                                        >
                                            Deposit
                                        </NavLink>
                                    </li>
                                </>
                            )}
                            <li className="navbar-item navbar-user-item">
                                <button
                                    type="button"
                                    className={userPillClassName}
                                    title={userDisplayName}
                                    aria-haspopup="menu"
                                    aria-expanded={isUserMenuOpen ? "true" : undefined}
                                    onClick={handleUserMenuOpen}
                                >
                                    <Avatar
                                        src={navbarUser?.profilePictureUrl || undefined}
                                        alt={userDisplayName}
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            fontSize: 13,
                                            fontWeight: 900,
                                            bgcolor: "rgba(96,165,250,0.25)",
                                            color: "#e7eeff",
                                            border: "1px solid rgba(255,255,255,0.22)",
                                        }}
                                    >
                                        {userInitials}
                                    </Avatar>
                                    <span className="navbar-user-meta">
                                        <span className="navbar-user-name">{userDisplayName}</span>
                                    </span>
                                    <KeyboardArrowDownRounded className="navbar-user-caret" fontSize="small" />
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => getNavClassName(isActive)}
                                >
                                    Log in
                                </NavLink>
                            </li>
                            <li className="navbar-item">
                                <NavLink
                                    to="/register"
                                    className={({ isActive }) => getNavClassName(isActive)}
                                >
                                    Register
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            <Menu
                anchorEl={userMenuAnchorEl}
                open={isUserMenuOpen}
                onClose={handleUserMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleUserMenuClose}>
                    <SettingsOutlined fontSize="small" sx={{ mr: 1.25, color: "text.secondary" }} />
                    Setting
                </MenuItem>
                <MenuItem onClick={handleMenuLogout}>
                    <LogoutOutlined fontSize="small" sx={{ mr: 1.25 }} />
                    Log out
                </MenuItem>
            </Menu>

            <Dialog
                open={showModal}
                onClose={cancelLogout}
                fullWidth
                maxWidth="xs"
                sx={{
                    "& .MuiDialog-container": {
                        alignItems: "center",
                        justifyContent: "center",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 900 }}>Log out?</DialogTitle>
                <DialogContent>
                    <Typography color="text.secondary">
                        Are you sure you want to log out?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button variant="outlined" onClick={cancelLogout}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={confirmLogout}>
                        Log out
                    </Button>
                </DialogActions>
            </Dialog>

        </nav>
    );
};
export default Navbar;