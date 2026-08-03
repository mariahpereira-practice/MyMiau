import { Box, Paper, Typography } from "@mui/material"

export function CardFeature({
    icon, description, title
    }: Readonly<{
        icon: React.ReactElement,
        title: string,
        description: string
    }>) {
    return (
        <Paper sx={{
            p:4,
            height: "100%",
            textAlign: "center",
            backgroundColor: "background.paper",
            transition: "transform 0.3s ease",
            "&:hover": {
                transform: "translateY(-10px)",
            }
        }}>
            <Box sx={{
                color: "primary.main",
                mb: 2
            }}>{icon}</Box>
            
            <Typography variant="h6" gutterBottom sx={{
                fontWeight: 700,
            }}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{description}</Typography>

        </Paper>
    )
}