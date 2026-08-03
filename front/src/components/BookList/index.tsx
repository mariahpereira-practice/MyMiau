import { Grid, Typography } from "@mui/material";
import { CardBook } from "../CardBook";
import type { Book, BookListProps } from "../../types";
import { CardBookSkeleton } from "../CardBook/card-book-skeleton";
import { BookPagination } from "./book-pagination";

export function BookList({ data, isLoading, isError, searchText: searchText, page, setPage, totalPage }: Readonly<BookListProps>) {

    if (isLoading) {
            return (
                <Grid container spacing={4}>
                    {Array.from(new Array(totalPage)).map((_, index) => (
                        <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={index}>
                            <CardBookSkeleton />
                        </Grid>
                    ))}
                </Grid>
            );
        }
        
        if (isError) {
            return (
                <Typography color="error" align="center" sx={{ py: 5 }}>
                    Erro ao carregar os livros.
                </Typography>
            );
        }

        if(!data?.data || data.data.length === 0) {
            return (
                <Typography align="center" color="text.secondary" sx={{ py: 5 }}>
                    Nenhum livro encontrado para "{searchText}".
                </Typography>
            );
        }
        
    return (
        <>
        <Grid container spacing={4}>
            {data.data.map((book: Book) => (
                <Grid key={book.documentId} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                    <CardBook data={book} />
                </Grid>
            ))}
        </Grid>
        <BookPagination pageCount={data.meta.pagination.pageCount || 0} page={page} onChange={setPage} />
        </>
    );
}