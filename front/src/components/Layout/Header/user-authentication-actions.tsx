import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router";
import { useAppDispatch } from "../../../store";
import { selectAuth } from "../../../store/slices/auth-slice";
import { logout } from '../../../store/actions/logout';
import { useCallback } from "react";
import { nomeFormatado } from "../../../utils/formatacao";
import { CircleUser } from "lucide-react";

export function UserAuthenticationActions() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {isAuthenticated, user} = useSelector(selectAuth);

    const handleUserLogout = useCallback(() => {
        dispatch(logout());
        navigate('/login');
    }, [dispatch, navigate]);
    
    if(isAuthenticated) {
        return (
            <Box sx={{display:'flex', gap: 2, ml: 2, 
            flexDirection: {xs: 'row', md: 'row'}, 
            alignItems: {xs: 'stretch', md: 'center'},
            mt:{xs: 1, md: 0},
            mb: {xs: 2, md: 0}}}>
                <Button sx={{
                    borderRadius: 10,
                    px: 1,
                    py: 1,
                    alignItems: 'center',
                    '&:hover': {
                        backgroundColor: 'primary.light',
                        color: 'primary.main',
                    },
                    display: 'flex',
                }}
                color="inherit" 
                component={RouterLink} 
                to="/perfil">
                <CircleUser size={32} />
                </Button>
                <Typography variant="body2"
                sx={{display: {xs: 'none', md: 'block'},
                mr:2,
                fontSize: {xs: '0.875rem', md: '1rem'}}}
                    > Olá, <strong>{nomeFormatado(user?.username)}</strong>!
                </Typography>
                <Button 
                color="secondary" 
                variant="contained" 
                size="small" 
                onClick={()=>{
                        handleUserLogout();
                }}>Sair
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{display:'flex', gap: 1, ml: 2, 
            flexDirection: {xs: 'column', md: 'row'}, 
            alignItems: {xs: 'stretch', md: 'center'},
            mt:{xs: 1, md: 0},
            mb: {xs: 2, md: 0}}}>
            <Button color="inherit" variant="outlined" component={RouterLink} to="/login">Entrar</Button>
            <Button color="secondary" variant="contained" component={RouterLink} 
            to="/register">Registrar</Button>
        </Box>
    );

}