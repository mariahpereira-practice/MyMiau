import { Box, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import type { CartItem } from "../../types"
import { getImageUrlBook } from "../../utils/generateImageUrlBook";
import { useCallback } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";


interface CartItemRowProps {
    item: CartItem;
    isProcessing: boolean;
    onUpdateQuantity: (documentId: string, quantity: number) => void;
    onRemove: (documentId: string) => void;
}

export function CartItemRow({
    isProcessing,
    item,
    onRemove,
    onUpdateQuantity
}: CartItemRowProps) {
    const { documentId, quantity, book } = item;
    const imageUrl = getImageUrlBook(book.image);
    const subtotal = book.price * quantity;
    
    const handleIncrement = useCallback(() => {
        onUpdateQuantity(documentId, quantity+1);
    }, [documentId, quantity]);

    const handleDecrement = useCallback(() => {
        if(quantity <=1) {
            onRemove(documentId);
        } else {
            onUpdateQuantity(documentId, quantity - 1);
        }
    }, [documentId, quantity]);

    return (
    <>
    <Box sx= {{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 2,
        opacity: isProcessing? 0.6 : 1,
        transition: "opacity 0.2s"
    }}>

        <Box component="img" src={imageUrl} alt={book.title} sx={{
            width: 80, height: 80, objectFit: "cover",
            borderRadius: 1, flexShrink: 0
        }} />

        <Box sx={{flexGrow: 1, minWidth: 0}}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>{book.title}</Typography>
            <Typography variant="body2" color="text.secondary">R$ {book.price.toFixed(2)} / un.</Typography>
        </Box>

        <Box sx={{
            display: "flex", alignItems: "center", gap: 0.5
        }}>
            <IconButton size="small" onClick={handleDecrement} disabled={isProcessing} aria-label="Diminuir quantidade">
                <Minus size={16}></Minus>
            </IconButton>
            <Box sx={{width: 32, textAlign: "center"}}>
                 {isProcessing ? (
                    <CircularProgress size={16} />
                 ): (
                    <Typography variant="body1" fontWeight={600}>
                        {quantity}
                    </Typography>
                 )}
            </Box>
            <IconButton size="small" onClick={handleIncrement} disabled={isProcessing} aria-label="Aumentar quantidade">
                <Plus size={16}></Plus>
            </IconButton>
        </Box>

        <Typography
            variant="subtitle1" fontWeight={700} color="primary.main" sx={{
                minWidth: 80, textAlign: "right"
            }}
        >
            R$ {subtotal.toFixed(2)}
        </Typography>
        <IconButton color="error" size="small" onClick={() => onRemove(documentId)} disabled={isProcessing} aria-label="RemoverItem">
            <Trash2 size={18} />
        </IconButton>

    </Box>
    <Divider />
    </>
    )
}