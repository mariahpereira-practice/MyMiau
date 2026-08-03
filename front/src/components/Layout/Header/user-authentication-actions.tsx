import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router";
import { useAppDispatch, type RootState } from "../../../store";
import { selectAuth } from "../../../store/slices/auth-slice";
import { logout } from '../../../store/actions/logout';
import { useCallback } from "react";

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
            flexDirection: {xs: 'column', md: 'row'}, 
            alignItems: {xs: 'stretch', md: 'center'},
            mt:{xs: 1, md: 0},
            mb: {xs: 2, md: 0}}}>
                <Typography variant="body2"
                sx={{display: {xs: 'none', md: 'block'},
                fontSize: {xs: '0.875rem', md: '1rem'}}}
                    > Olá, <strong>{user?.username}</strong>!
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