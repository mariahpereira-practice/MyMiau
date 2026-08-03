import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import type { ResponseSingleBook } from "../types";
import { api } from "../services/api";
import { MINUTES_30 } from "../constants";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { BookInfo } from "../components/BookInfo";
import { BookInfoSkeleton } from "../components/BookInfo/book-info-skeleton";
import { Box, Button, Paper, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch } from "../store";
import { addCartItem } from "../store/slices/cart-slice";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/auth-slice";

export function BookDetails() {

    const { id } = useParams<{ id: string }>();

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const {isAuthenticated} = useSelector(selectAuth);

    const {data: book, isLoading, isError} = useQuery<ResponseSingleBook>({
        queryKey: ['book', id],
        queryFn: async () => {
            const response = await api.get(`/products/${id}?populate=image`);
            return response.data;
        },
        enabled: !!id,
        staleTime: MINUTES_30
    });

    const handleAddToCart = useCallback(async () => {
        if (!book?.data) return;
        if( !isAuthenticated) {
            toast.error("Faça login para adicionar o item ao carrinho.");
            return navigate("/login");
        }
        try {
            const actionResult = await dispatch(addCartItem(book.data));
            if (addCartItem.fulfilled.match(actionResult)) {
                toast.success(`${book?.data.title} adicionado ao carrinho!`);
            } else if (addCartItem.rejected.match(actionResult)) {
                const message = (actionResult.payload as string) ?? actionResult.error?.message ?? "Não foi possível adicionar o item ao carrinho.";
                toast.error(message);
            } else {
                toast.error("Não foi possível adicionar o item ao carrinho, tente novamente.");
            }
        } catch (err) {
            console.error("BookDetails: unexpected error when adding to cart", err);
            toast.error("Não foi possível adicionar o item ao carrinho, tente novamente.")
        }
    }, [book, dispatch, toast, isAuthenticated]);

    if (isLoading) {
        return <Paper elevation={0} sx={{
                p: {xs: 2, md: 4},
                backgroundColor: "background.paper",
                borderRadius: 3,
            }}
                ><BookInfoSkeleton />
                </Paper>
    }

    if (isError || !book) {
        return (
            <Box textAlign="center" py={10}>
                <Typography variant="h5" color="error" gutterBottom>
                    Livro não encontrado.
                </Typography>
                <Button startIcon={<ArrowLeft />}
                onClick={() => navigate("/books")}
                sx={{ mt: 2 }}>
                    Voltar para a lista de livros
                </Button>
            </Box>
        )
    }   

    return (
        <Paper elevation={0} sx={{
                p: {xs: 2, md: 4},
                backgroundColor: "background.paper",
                borderRadius: 3,
            }}
        >
        <BookInfo book={book.data} onAddToCart={handleAddToCart} />
        </Paper>
    );
}