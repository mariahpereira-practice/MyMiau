import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import type { BookInfoProps } from "../../types";
import { ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { getImageUrlBook } from "../../utils/generateImageUrlBook";

export function BookInfo({ book, onAddToCart }: Readonly<BookInfoProps>) {

    const { title, description, price, image, stock, autor } = book;

    const imageUrl = getImageUrlBook(image);

        return (
        <Grid container spacing={6}>
                <Grid size={{xs: 12, md: 6}}>
                    <Box component="img"
                        src={imageUrl}
                        alt={title}
                        sx ={{
                            width: "100%",
                            maxHeight: "500px",
                            objectFit: "contain",
                            backgroundColor: "#ffff",
                            borderRadius: 2,
                            p: 2,
                        }}>
                    </Box>
                </Grid>
                <Grid size={{xs: 12, md: 6}} display="flex" flexDirection="column">
                    <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                        {title}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
                        <Typography variant="h5" color="textSecondary" gutterBottom fontWeight="bold">
                            {autor}
                        </Typography>
                        <Typography variant="h4" color="primary.main"  fontWeight="bold" sx={{ mb: 3 }}>
                            R$ {price.toFixed(2)}
                        </Typography>
                    </Box>
                    

                    <Divider sx={{ mb: 3, borderColor: "gray" }} />

                    <Typography variant="body1" color="text.secondary" sx={{
                        lineHeight: 1.8, flexGrow: 1
                    }}>
                        {description}
                    </Typography>
                    
                    <Box display="flex" gap={3} mb={4} mt={2} color="texzt.secondary">
                        <Typography variant="body2" color="text.secondary"
                            sx={{
                                lineHeight: 1.8, flexGrow: 1, mt: 2
                            }}
                            >
                            Quantidade: {stock} unidades
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Truck size={20} color="#90caf9"/>
                            <Typography variant="body2">Frete grátis</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <ShieldCheck size={20} color="#90caf9"/>
                            <Typography variant="body2">Garantia de 1 ano</Typography>
                        </Box>
                    </Box>

                <Button variant="contained" size="large" startIcon={<ShoppingCart />} 
                                onClick={onAddToCart}
                                sx={{ 
                                    py:2,
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                }}
                                fullWidth>
                                    Adicionar ao carrinho
                </Button>           
                </Grid>
            </Grid>
        );
    }