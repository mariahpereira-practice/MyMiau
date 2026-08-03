import { Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import { MenuIcon} from "lucide-react";
import { useState } from "react";
import { NAVIGATION_LINKS } from "../../../constants";
import { Link as RouterLink } from "react-router";
import { useThemeMode } from "../../../theme";

export function MobileNavMenu() {

    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

    const openMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMenuAnchor(event.currentTarget);
    };

    const closeMobileMenu = () => {
        setMobileMenuAnchor(null);
    };

    const { mode, toggleTheme } = useThemeMode();

    return (
        <Box
        sx={{display: { xs: 'flex', md: 'none' },}}>
            <IconButton 
            size="large" 
            onClick={openMobileMenu}
            color="inherit"
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={mobileMenuAnchor}
                keepMounted
                open={Boolean(mobileMenuAnchor)}
                onClose={closeMobileMenu}
                sx={{display: { xs: 'block', md: 'none' },}}
            >
                <MenuItem onClick={toggleTheme}>
                    <Button color="inherit" sx={{ fontSize: '1.25rem' }}>
                        {mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
                    </Button>
                </MenuItem>
                {NAVIGATION_LINKS.map((link) => (
                    <MenuItem 
                        key={link.path} 
                        onClick={closeMobileMenu}>
                            <Button color="inherit" 
                            component={RouterLink} 
                            to={link.path}
                            sx={{ fontSize: '1.25rem' }}>
                                {link.label}
                            </Button>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
}