import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Cat, CircleUser, Layers, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { CatPawPrint } from "../components/CatPawPrint";
import { selectAuth } from "../store/slices/auth-slice";
import { nomeFormatado } from "../utils/formatacao";

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
                    My Miau Community
                    <Cat size={64} />
                </Typography>            
                <Typography variant="h6" color="text.secondary" sx={{
                    maxWidth: "760px",
                    mb: 2,
                    textAlign: "justify",
                }}>
                    A comunidade My Miau é um espaço dedicado aos amantes de gatos, 
                    onde você pode se conectar com outros tutores e cat sitters, 
                    compartilhar experiências, dicas e cuidados para garantir o bem-estar dos felinos. 
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
                            Bem-vindo(a) {nomeFormatado(username)}!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{
                            mb: 2,
                            mt: 2
                        }}>
                            Você está inscrito(a) como <strong>{useSelector((state: any) => state.auth.user?.role)}</strong>.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<CircleUser />}
                            onClick={() => navigate('/perfil')}
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: "1rem",
                                fontWeight: "bold",
                                color: "primary.contrastText",
                            }}
                        >
                            Acessar Perfil
                        </Button>
                    </div>
                    
                ))}
            </Paper>
            <CatPawPrint />
        </Box>
    )
}