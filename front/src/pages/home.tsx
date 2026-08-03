import { Box, Button, Grid, Icon, Paper, Typography } from "@mui/material";
import { Cat, CatIcon, Headset, PawPrint, PawPrintIcon, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { CardFeature } from "../components/CardFeature";
import { useNavigate } from "react-router";
import { CatPawPrint } from "../components/CatPawPrint";

export function Home() {

    const features = [{
        icon: <Truck size={40} />,
        title: "Entrega Rápida",
        description: "Receba seus livros em casa com nossa entrega rápida e confiável."
    },
    {
        icon: <ShieldCheck size={40} />,
        title: "Compra Segura",
        description: "Compre com confiança em nossa plataforma segura e protegida."
    },
    {
        icon: <Headset size={40} />,
        title: "Suporte ao Cliente",
        description: "Nossa equipe de suporte está pronta para ajudar você a qualquer momento."
    }
]

    const navigate = useNavigate();
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
                        fontSize: {xs: "2.5rem", md: "3.75rem", lg: "4.5rem"},
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 3
                    }}>
                    Miau Livraria
                    <Cat size={150}></Cat>
                </Typography>            
                <Typography variant="h5" color="text.secondary" sx={{
                    mb:4,
                    maxWidth: "900px",
                    mx: "auto"
                }}>
                    A livraria online que oferece uma vasta seleção de livros para todos os gostos. <br />
                    Encontre seu próximo livro favorito conosco! Miau!
                </Typography>
                <Button variant="contained" size="large" 
                startIcon={<ShoppingBag />}
                onClick={() => navigate("/books")}
                sx={{
                    px:4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "primary.contrastText",
                }}>
                    Explorar Livros
                </Button>
            </Paper>
            <CatPawPrint />
            <Grid container spacing={4}>
                {features.map((feature, index) => (
                    <Grid sx={{
                        flexGrow: 1,
                        flexBasis: "300px"
                    }} key={index}>
                        <CardFeature {...feature} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}