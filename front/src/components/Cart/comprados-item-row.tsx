import { Box, Divider, IconButton, Modal, Typography } from "@mui/material";
import type { ProdutoComprado, ResponseSingleBook } from "../../types"
import { getImageUrlBook } from "../../utils/generateImageUrlBook";
import {  Plus,} from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import { MINUTES_30 } from "../../constants";

interface CompradosItemRowProps {
    item: ProdutoComprado;
}

export function CompradosItemRow({
    item
}: CompradosItemRowProps ) {
    const { book } = item;

    const imageUrl = getImageUrlBook(book.image);

    const [openModal, setOpenModal] = React.useState(false);

    const {data } = useQuery<ResponseSingleBook>({
        queryKey: ['book', book.id ],
        queryFn: async () => {
            const response = await api.get(`/products/${book.id}?populate=image`);
            return response.data;
        },
        enabled: !!book.id,
        staleTime: MINUTES_30
    });

    const maisDetalhes = () => {
        setOpenModal(true);
    }

    return (
    <>
    <Modal open={openModal} onClose={()=>setOpenModal(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                {book.title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {data?.data.description}
            </Typography>
        </Box>
    </Modal>

    <Box sx= {{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 2,
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
            <IconButton size="small" onClick={()=>{maisDetalhes()}} aria-label="Mais detalhes do livro">
                <Plus size={16}></Plus>
            </IconButton>
           
        </Box>

    </Box>
    <Divider />
    </>
    )
}

function useState(arg0: boolean): [any, any] {
    throw new Error("Function not implemented.");
}
