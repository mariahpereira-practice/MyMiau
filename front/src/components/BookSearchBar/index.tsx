import { Box, TextField } from "@mui/material";

export function BookSearchBar({value, onChange}: { value: string, onChange: (value: string) => void }) {
    return (
        <Box sx={{mb: 4}}>
            <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nome ou autor ..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            sx={{
                backgroundColor: "background.paper", borderRadius: 1
            }}
            />
        </Box>
    );
}