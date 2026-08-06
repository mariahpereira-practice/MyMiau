import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import type { Gato } from "../../../types";
import { nomeFormatado, peloFormatado } from "../../../utils/formatacao";
import { Cat } from "lucide-react";

export const GatosCard = (
    { gato }: { gato: Gato }
) => {

    return (
        <Card key={gato.id} >
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {gato.nomeGato}
                </Typography>
                    <ImagemIcone idIcone={gato.idIcone} />
                </Stack>
                <Divider />
                <Typography variant="body2">Nome Tutor: {nomeFormatado(gato.tutorNome)}</Typography>
                <Typography variant="body2">Idade: {gato.idadeGato}</Typography>
                <Typography variant="body2">Peso: {gato.pesoGato}kg</Typography>
                <Typography variant="body2">Pêlo: {peloFormatado(gato.peloGato)}</Typography>
                <Typography variant="body2">Raça: {gato.racaGato}</Typography>
              </Stack>
            </CardContent>
          </Card>
    );
};

export const ImagemIcone = ({ idIcone }: { idIcone: number }) => {
  switch (idIcone) {
    case 1:
      return (
          <Cat size={40} fill="black" color="white"/>
      );
    case 2:
      return (
        <Cat size={40} fill="white" color="black" />
      );
    case 3:
      return (
        <Cat size={40} fill="brown" color="white"/>
      );
    case 4:
      return (
        <Cat size={40} fill="orange" color="white" />
      );
    case 5:
      return (
        <Cat size={40} fill="gray" color="white" />
      );
    default:
      return (
        <Cat size={40} fill="black" color="white" />
      );
  }
}