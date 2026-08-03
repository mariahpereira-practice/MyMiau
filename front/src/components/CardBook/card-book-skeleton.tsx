import { Box, Card, CardContent, Skeleton } from "@mui/material";

export function CardBookSkeleton() {
    return (
        <Card sx={{
            height:"100%",
            display: "flex",
            flexDirection: "column",
            zIndex: 1
        }}>
            <Skeleton variant="rectangular" height={250} animation="wave"/>

            <CardContent sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1
            }}>

                <Box display="flex" flexDirection="column">
                    <Skeleton variant="text" height={32} animation="wave"/>
                    <Skeleton variant="text" width="40%" animation="wave"/>
                </Box>

                <Box sx={{
                    flexGrow: 1,
                    mt: 1
                }}>
                    <Skeleton variant="text" width="100%" animation="wave"/>
                    <Skeleton variant="text" width="60%" animation="wave"/>
                </Box>

                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2
                }}>
                    <Skeleton variant="text" width="30%" height={40}animation="wave"/>
                    <Skeleton variant="rounded" width={100} height={32} animation="wave"/>
                </Box>

            </CardContent>

        </Card>
    );
}