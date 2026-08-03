import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { NAVIGATION_LINKS } from "../../../constants";
import { Link as RouterLink } from "react-router";
import { useThemeMode } from "../../../theme";
import { Moon, Sun } from "lucide-react";

export function DesktopNavMenu() {

    const { mode, toggleTheme } = useThemeMode();

    return (
        <Box sx={{display: { xs: 'none', md: 'flex' }, gap: 2}}>
            {NAVIGATION_LINKS.map((link) => (
                <Button key={link.path}
                color="inherit"
                component={RouterLink}
                to={link.path}
                sx={{ fontSize: '1.5rem' }}
                >
                    {link.label}
                </Button>
            ))}
            <Tooltip title={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}>
                  <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 2 }}>
                    {mode === 'light' ? <Sun /> : <Moon />}
                  </IconButton>
            </Tooltip>
        </Box>
    );
}