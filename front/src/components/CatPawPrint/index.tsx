import { Box, Icon } from "@mui/material";
import { PawPrintIcon } from "lucide-react";
import { keyframes } from "@emotion/react";

export function CatPawPrint() {

    const paw1 = { mr: { sm: '40px', md: '180px' }, transform: 'rotate(-270deg)' }
    const paw2 = { mr: { sm: '20px', md: '150px' }, transform: 'rotate(180deg)' }

    const pawSteps = [
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
        { ...paw1 },
        { ...paw2 },
    ]

    return (
        <Box sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 30,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 2,
                    pointerEvents: 'none',
                }}>
            {pawSteps.map((step, index) => {
                const fade = keyframes`
                    0% { opacity: 0; }
                    60% { opacity: 1; }
                    100% { opacity: 0.3; }
                `;
                return (
                    <Icon
                        key={index}
                        component={PawPrintIcon}
                        sx={{
                            color: 'primary.main',
                            ...step,
                            fontSize: 45,
                            opacity: 0,
                            animationName: fade.toString(),
                            animationDuration: '0.5s',
                            animationFillMode: 'forwards',
                            animationDelay: `${index * 0.15}s`,
                        }}
                    />
                );
            })}
                    
            </Box>
    );
}