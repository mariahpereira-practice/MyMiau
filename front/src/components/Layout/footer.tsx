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
                    © {new Date().getFullYear()} My Miau Base. Estrutura inicial para evolucao de produto com React.
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center" sx={{
                    display: { xs: 'none', sm: 'block' },
                    mt: 1
                }}>
                   UI com Material UI e icones Lucide.
                </Typography>
            </Container>
        </Box>
    );

};