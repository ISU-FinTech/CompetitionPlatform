import { AppBar, Box, IconButton, Toolbar, Button, Drawer, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../slices/auth";

function Header() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Button 
                        color="inherit" 
                        to="/" 
                        component={Link} 
                        sx={{ flexGrow: 1 }}
                    >
                        FinTech Club at Iowa State University
                    </Button>

                    {isAuth ? (
                        <Button
                            component={Link}
                            to="/"
                            color="inherit"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button
                            component={Link}
                            to="/login"
                            color="inherit"
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => toggleDrawer(false)}
            >
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                    onKeyDown={() => toggleDrawer(false)}
                >
                    <List>
                        <ListItem component={Link} to="/">
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem component={Link} to="/competitions">
                            <ListItemText primary="Competitions" />
                        </ListItem>
                        <ListItem component={Link} to="/documentation">
                            <ListItemText primary="Documentation" />
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}

export default Header;
