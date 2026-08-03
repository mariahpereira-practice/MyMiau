import { AppBar, Toolbar } from "@mui/material";
import { MobileNavMenu } from "./mobile-nav-menu";
import { DesktopNavMenu } from "./desktop-nav-menu";
import { UserAuthenticationActions } from "./user-authentication-actions";
import BrandLogo from "./brand-logo";

export function Header(){
    return (
        <AppBar position="static" elevation={1} sx={{
            zIndex: 1
        }}>
            <Toolbar sx={{justifyContent: 'space-between'}}>
                <MobileNavMenu />
                <BrandLogo />
                <DesktopNavMenu />
                <UserAuthenticationActions />
            </Toolbar>
        </AppBar>
    )
}