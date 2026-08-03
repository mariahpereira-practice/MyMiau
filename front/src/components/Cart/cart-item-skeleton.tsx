import { Box, Divider, Skeleton } from "@mui/material";

export function CartItemSkeletonRow(){
    return (
        <>
        <Box sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            py: 2
        }}>
            <Skeleton variant="rounded" width={80} height={80} sx={{
                flexShrink:0
            }}></Skeleton>
            <Box sx={{
                flexGrow: 1
            }}>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="30%" height={20} />
            </Box>
            <Skeleton variant="rounded" width={100} height={36} />
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Divider />
        </>
    )
}

export function CartItemSkeleton() {
    return (
        <>
        <CartItemSkeletonRow />
        <CartItemSkeletonRow />
        <CartItemSkeletonRow />
        </>
    )
}