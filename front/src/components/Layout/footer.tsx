import { Box, Container, Typography } from "@mui/material";

export function Footer() {

    return ( 
        <Box component="footer" sx={{
            bgcolor: 'background.paper',
            py: 3,
            mt: 'auto',
            zIndex: 1
        }}>
            <Container maxWidth="lg" >
                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} Miau Livraria. Projeto de Estudo de Front-End com React. Instituição: Infnet
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" sx={{
                    display: { xs: 'none', sm: 'block' },
                    mt: 1
                }}>
                   Ícones: Lucide
                </Typography>
            </Container>
        </Box>
    );

};