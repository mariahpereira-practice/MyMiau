import { Typography } from "@mui/material";
import { Book, Cat } from "lucide-react";
import {Link as RouterLink} from "react-router";

function BrandLogo() {
  return (
    <Typography variant="h6" component={RouterLink} to="/"
    sx={{
        textDecoration: 'none',
        color: "inherit",
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        whiteSpace: "nowrap",
        flexGrow: {xs: 1, md: 0, lg: 0},
        mr: {md: 4}
    }}>
    <Book size={25}/>
      Miau Livraria
    <Cat size={25}/>
    </Typography>
  );
}

export default BrandLogo;