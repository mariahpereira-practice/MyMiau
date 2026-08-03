import { Box, Button, Typography } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";

export function CartEmpty() {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py:10,
            gap: 2,
            color: "text.secondary"
        }}>
            <ShoppingCart size={64} strokeWidth={1}></ShoppingCart>
            <Typography variant="h6" fontWeight={600}>Seu carrinho está vazio.</Typography>
            <Typography variant="body2">Adicione livros para continuar comprando.</Typography>
            <Button component={Link} to="/books" variant='contained' sx={{mt: 1}}>Ver livros</Button>
        </Box>
    )
}