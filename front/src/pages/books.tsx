import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Box, Typography } from "@mui/material";
import { BookList } from "../components/BookList";
import type { ResponseBooks } from "../types";
import { BookSearchBar } from "../components/BookSearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { MINUTES_30 } from "../constants";

export function Books() {
     const [searchTerm, setSearchTerm] = useState<string>("");
     const [page, setPage] = useState<number>(1);
     const pageSize = 4;

     const debouncedSearchTerm = useDebounce(searchTerm, 300);

     useEffect(() => {
        setPage(1);
     }, [debouncedSearchTerm]);

      useEffect(() => {
          console.log('Books state:', { searchTerm, debouncedSearchTerm, page });
      }, [searchTerm, debouncedSearchTerm, page]);

     const { data, isLoading, isError} = useQuery<ResponseBooks>({
        queryKey: ['products', page, debouncedSearchTerm],
        queryFn: async () => {
            let url = `/products?populate=image&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
            if (debouncedSearchTerm) {
                url += `&filters[$or][0][title][$containsi]=${debouncedSearchTerm}`;
                url += `&filters[$or][1][autor][$containsi]=${debouncedSearchTerm}`;
            }
            const { data } = await api.get(url);
            return data;
        },
        staleTime: MINUTES_30,
         placeholderData: (previousData) => previousData
     });

    const mostrarCarregandoOuErro = () => {
        return (
            <Box>
                <Typography
                variant="h4"
                sx={{
                    fontWeight: 700, mb: 4, color: "primary.main"}}
                >
                    Nossos Livros
                </Typography>

                <BookSearchBar value={searchTerm} onChange={setSearchTerm} />
                <BookList data={data} isLoading={isLoading} isError={isError} page={page} setPage={setPage} searchText={debouncedSearchTerm} totalPage={pageSize}/>
            </Box>

        );

    };
    
    return (
        <Box>
            {mostrarCarregandoOuErro()}
        </Box>
    );
}