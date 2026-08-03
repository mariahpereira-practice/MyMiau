import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";

export const BookPagination = ({
    pageCount, page, onChange
}: {
    pageCount: number;
    page: number;
    onChange: (page: number) => void;
}) => {
    
    if(!pageCount || pageCount <= 1) {
        return null;
    }

    return (
        <Box display="flex" justifyContent="center" mt={6}>
            <Pagination count={pageCount} page={page} onChange={(_, value) => onChange(value)} color="primary" size="large"/>
        </Box>
    );
}