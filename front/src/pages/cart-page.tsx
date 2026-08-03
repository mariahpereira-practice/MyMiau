import { Alert, Box, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { fetchCartItems, removeCartItem, selectCart, updateCartItem } from "../store/slices/cart-slice";
import { CartItemSkeleton } from "../components/Cart/cart-item-skeleton";
import { CartEmpty } from "../components/Cart/cart-empty";
import { useCallback, useEffect } from "react";
import { useAppDispatch } from "../store";
import { CartSummary } from "../components/Cart/cart-summary";
import { CartItemRow } from "../components/Cart/cart-item-row";
import type { CartItem } from "../types";
import { useNavigate } from "react-router";
import { api } from "../services/api";
import { toast } from "react-toastify";

export function CartPage() {

    const {
        itens,
        status,
        error,
        totalAmount,
        totalQuantity,
        processingItemIds
    } = useSelector(selectCart);

    const dispatch = useAppDispatch();

    const productsIds = itens.map((item: CartItem) => item.book.id);

    const handleComprar = useCallback(async () => {
            if (totalAmount == 0) return;
            try {
                const actionResult = await api.post("/comprados", {
                        data: {
                            productsIds: productsIds
                        }
                    });
                if (actionResult.status !==400) {
                    toast.success(`Itens comprados com sucesso!`);
                    itens.forEach((item: CartItem) => {
                        handleRemove(item.documentId);
                    });
                } else {
                    toast.error("Não foi possível adicionar o item ao carrinho, tente novamente.");
                }
            } catch (err) {
                toast.error("Não foi possível realizar a compra, tente novamente.")
            }
    }, [totalAmount, productsIds]);

    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);

    const handleUpdateQuantity = useCallback((documentId: string, quantity: number) => {
        dispatch(updateCartItem({documentId, quantity}))
    }, [dispatch]);

    const handleRemove = useCallback((documentId: string) => {
        dispatch(removeCartItem(documentId))
    }, [dispatch]);

    const isLoading = status == "loading";
    const isFailed = status == "failed";
    const isEmpty = status == "succeeded" && itens.length === 0;
    const hasItems = status == "succeeded" && itens.length > 0;

    return <Box>
        <Typography variant="h4" fontWeight={700} color="primary.main" sx={{
            mb: 4
        }}>
            Meu Carrinho
        </Typography>


        {isFailed && (
            <Alert severity="error" sx={{mb: 3}}>
                {error ?? "Ocorreu um erro ao carregar o carrinho."}
            </Alert>
        )}

        {isLoading && <CartItemSkeleton />}
        {isEmpty && <CartEmpty />}


        {hasItems && 
            <Grid container spacing={3} alignItems="flex-start">
                <Grid size={{xs: 12, md: 8}}>
                    {itens.map((item: any) => 
                        <CartItemRow key={item.id} item={item} 
                        isProcessing={processingItemIds.includes(item.documentId)}
                        onRemove={handleRemove}
                        onUpdateQuantity={handleUpdateQuantity}
                         />
                    )}
                </Grid>
                <Grid size={{xs: 12, md: 4}}>
                    <CartSummary totalAmount={totalAmount} totalQuantity={totalQuantity} handleComprar={handleComprar}/>
                </Grid>
            </Grid>
        
        }
    </Box>
}