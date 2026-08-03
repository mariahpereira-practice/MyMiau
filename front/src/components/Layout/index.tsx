import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";
import { Footer } from "./footer";
import { Header } from "./Header";

export function Layout() {
  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        <Header />
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
            <Container maxWidth={false} sx={{ px: { xs: 4, md: 12 } }}>
                <Outlet />
            </Container>
        </Box>
        <Footer />
      </Box>
  );
}