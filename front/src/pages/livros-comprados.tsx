import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { CartItemSkeleton } from "../components/Cart/cart-item-skeleton";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { ResponseBooks } from "../types";
import { api } from "../services/api";
import { MINUTES_30 } from "../constants";
import { CompradosItemRow } from "../components/Cart/comprados-item-row";

export function LivrosComprados() {

    const { data, isLoading, isError} = useQuery<ResponseBooks>({
        queryKey: ['comprados'],
        queryFn: async () => {
            let url = `/comprados`;
            const { data } = await api.get(url);
            return data;
        },
        staleTime: MINUTES_30,
         placeholderData: (previousData) => previousData
     });

    return <Box>
        <Typography variant="h4" fontWeight={700} color="primary.main" sx={{
            mb: 4
        }}>
            Livros Comprados
        </Typography>


        {isError && (
            <Alert severity="error" sx={{mb: 3}}>
                {"Ocorreu um erro ao carregar a lista de livros comprados."}
            </Alert>
        )}

        {isLoading && <CartItemSkeleton />}

        {data && 
            <Grid container spacing={3} alignItems="flex-start">
                <Grid size={{xs: 12, md: 8}}>
                    {data.data.map((item: any) => 
                        <CompradosItemRow key={item.id} item={item} 
                         />
                    )}
                </Grid>
            </Grid>
        
        }
    </Box>

}