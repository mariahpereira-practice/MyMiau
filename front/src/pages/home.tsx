import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Cat, Layers, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { CatPawPrint } from "../components/CatPawPrint";
import { selectAuth } from "../store/slices/auth-slice";

export function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector(selectAuth);
    const username = useSelector((state: any) => state.auth.user?.username);
    return (
        <Box>
            <Paper elevation={1}
            sx={{
                p: { xs: 4, md: 8, lg: 12 },
                borderRadius: 4,
                textAlign: "center",
                mb: 6,
                mx: "auto",
                width: "100%",
                maxWidth:'100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                transition: 'transform 0.3s ease',
                zIndex: 0,
                "&:hover": {
                    transform: "translateY(-10px)",
                    zIndex: 2,
                }
            }}>
                <Typography variant="h2" component="h1" 
                    sx={{
                        fontWeight: 800,
                        color: "primary.main",
                        mb: 2,
                        fontSize: {xs: "2.2rem", md: "3rem", lg: "3.8rem"},
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3
                    }}>
                    My Miau Starter
                    <Cat size={64} />
                </Typography>            
                <Typography variant="h5" color="text.secondary" sx={{
                    mb:4,
                    maxWidth: "760px",
                    mx: "auto"
                }}>
                    Base inicial pronta para evolucao. Comece com autenticacao, depois adicione
                    paginas, dominios e fluxos de negocio do seu jeito.
                </Typography>

                {!isAuthenticated && (
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<LogIn />}
                            onClick={() => navigate('/login')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                color: "primary.contrastText",
                            }}
                        >
                            Entrar
                        </Button>

                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<UserPlus />}
                            onClick={() => navigate('/register')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: "bold",
                            }}
                        >
                            Criar conta
                        </Button>
                    </Stack>
                )}
                {(isAuthenticated && (
                    <div>
                        <Typography variant="h6" color="text.secondary" sx={{
                            mb: 2,
                            mt: 2
                        }}>
                            Bem-vindo {username}!
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<Layers />}
                            onClick={() => navigate('/app')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                color: "primary.contrastText",
                            }}
                        >
                            Acessar Painel
                        </Button>
                    </div>
                    
                ))}
            </Paper>
            <CatPawPrint />
        </Box>
    )
}