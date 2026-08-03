import { Box, Button, Divider, Paper, Typography } from "@mui/material";

interface CartSummaryProps {
    totalAmount: number;
    totalQuantity: number;
    handleComprar: () => void;
}

export function CartSummary ({
    totalAmount, totalQuantity, handleComprar
}: CartSummaryProps) {
    return (
    <Paper variant="outlined" sx={{px: 3, mb: 4, py: 2}}>
       <Typography variant="h6" fontWeight={700} gutterBottom>
            Resumo do Pedido
       </Typography>
       <Divider sx={{mb: 2}} />
       <Box sx={{display: "flex", justifyContent:"space-between", mb: 1}}>
        <Typography variant="body2" color="text.secondary">
            Itens ({totalQuantity})
        </Typography>
        <Typography variant="body2">R$ {totalAmount.toFixed(2)}</Typography>
       </Box>
       <Divider sx={{my: 2}} />

       <Box sx={{display: "flex", justifyContent: "space-between", mb:3 }}>
            <Typography variant="subtitle1" fontWeight={700}>
                Total
            </Typography>
            <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                R$ {totalAmount.toFixed(2)}
            </Typography>
       </Box>

       <Button variant="contained" fullWidth size="large"
        onClick={() => handleComprar()}
       >
            Finalizar Compra
       </Button>
    </Paper>
    );
}