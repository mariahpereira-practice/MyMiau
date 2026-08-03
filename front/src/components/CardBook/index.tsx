import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { Book } from "../../types";
import { useNavigate } from "react-router";
import { ShoppingCart } from "lucide-react";
import { getImageUrlBook } from "../../utils/generateImageUrlBook";

export function CardBook({ data }: Readonly<{ data: Book }>) {
    const {documentId, title, description, price, image, autor } = data;

    const imageUrl = getImageUrlBook(image);

    const navigate = useNavigate();

    return (
        <Card sx={{
            height:"100%",
            display: "flex",
            flexDirection: "column"
        }}>
            <CardMedia 
            component="img"
            height="250"
            image={imageUrl}
            alt={title}
            sx={{
                objectFit: "contain",
                backgroundColor: "#ffff",
            }}/>
            <CardContent sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                zIndex: 1
            }}>
                <Box display="flex" flexDirection="column">
                    <Typography variant="h6" gutterBottom noWrap>{title}</Typography>
                    <Typography variant="body1" gutterBottom noWrap fontWeight="bold">{autor}</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{
                    mb: 2,
                    flexGrow: 1,
                    overflow: 'hidden',
                }}>
                    {description.length > 300 ? description.substring(0, 300) + '...' : description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                        R$ {price.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCart size={18} />}
                        onClick={() => navigate(`/books/${documentId}`)}
                    >
                        Ver Mais
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}