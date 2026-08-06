import { Alert, Box, Card, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { GatosCard } from '../components/gatos/gatosCard';
import { nomeFormatado } from '../utils/formatacao';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { fetchGatos, selectGatos } from '../store/slices/gatos-slice';
import { selectAuth } from '../store/slices/auth-slice';
import { GatosPesquisa } from '../components/gatos/gatosPesquisa';

export function Gatos() {
  const dispatch = useAppDispatch();
  const { gatos, isLoading, error } = useSelector(selectGatos);

  const { user } = useSelector(selectAuth);

  useEffect(() => {
    dispatch(fetchGatos());
  }, [dispatch]);

  return (

    <Stack spacing={3} sx={{ maxWidth: 1400, mx: 'auto' }}>

      <Box>
        {user?.role === 'TUTOR' && (
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Meus Gatos
          </Typography>
        )}
        {user?.role === 'CATSITTER' && (
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Gatos Disponíveis
        </Typography>
        )}
      </Box>

    <Card>
      <CardContent>
      <GatosPesquisa />
      {isLoading && (
        <Stack direction="row" spacing={1} alignItems="center" mt={2} mb={2}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Carregando gatos...
          </Typography>
        </Stack>
      )}

      {error && <Alert sx={{ mt: 2, mb: 2 }} severity="error">{error}</Alert>}

      {!isLoading && !error && gatos.length === 0 && (
        <Typography variant="body2" color="text.secondary" mt={2} mb={2}>
          Nenhum gato encontrado para os filtros informados.
        </Typography>
      )}

      {!isLoading && gatos.length > 0 && (
            <Stack 
            mt={2} mb={2}
            >
              <Typography variant="body2" color="text.secondary">
                Total de gatos encontrados: {gatos.length}
              </Typography>
            </Stack>
      )}

      <Stack sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: '16px',
      }}>
      {!isLoading &&
        gatos.map((gato) => (
          <GatosCard key={gato.id} gato={gato} />
      ))}
      </Stack>

    </CardContent>
      </Card>
    </Stack>


  );
}
