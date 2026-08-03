import { Box, Grid, Skeleton } from "@mui/material";

export function BookInfoSkeleton() {
    return (
        <Grid container spacing={6}>
                <Grid size={{xs: 12, md: 6}}>
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={500}
                        sx={{borderRadius: 2}}>

                    </Skeleton>
                </Grid>
                <Grid size={{xs: 12, md: 6}} display="flex" flexDirection="column">
                    <Skeleton width="80%" height={60}/>
                    <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={2}>
                        <Skeleton width="40%" height={40}/>
                        <Skeleton width="30%" height={40}/>
                    </Box>
            

                    <Skeleton width="100%" height={300}/>
                    
                    <Box display="flex" gap={3} mb={4} mt={2} justifyContent="space-between">
                        <Skeleton width="20%" height={20}/>

                        <Box display="flex" alignItems="center" gap={1}>
                            <Skeleton width={100} height={20}/>
                            <Skeleton width={100} height={20}/>
                        </Box>
                    </Box>

                    <Skeleton width="100%" height={50} variant="rectangular"
                    sx={{
                        borderRadius: 2, mt:'auto'
                    }}/>

                </Grid>
            </Grid>
    );
}