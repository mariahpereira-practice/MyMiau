import { Alert, Box, Button, Card, CardContent, CircularProgress, Divider, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { clearGatosFilters, fetchGatos, selectGatos } from '../store/slices/gatos-slice';

export function Gatos() {
  const dispatch = useAppDispatch();
  const { gatos, isLoading, error, filters } = useSelector(selectGatos);

  const [pesquisa, setPesquisa] = useState(filters.search || '');

  useEffect(() => {
    dispatch(fetchGatos());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchGatos({ search: pesquisa }));
  };

  const handleClear = () => {
    setPesquisa('');
    dispatch(clearGatosFilters());
    dispatch(fetchGatos());
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Gatos
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Busque por nome do gato ou nome do tutor..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              size="small"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" onClick={handleSearch} disabled={isLoading}>
                Pesquisar
              </Button>
              <Button variant="outlined" onClick={handleClear} disabled={isLoading}>
                Limpar filtros
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {isLoading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">
            Carregando gatos...
          </Typography>
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && gatos.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhum gato encontrado para os filtros informados.
        </Typography>
      )}

      {!isLoading && gatos.length > 0 && (
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Total de gatos encontrados: {gatos.length}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      {!isLoading &&
        gatos.map((gato) => (
          <Card key={gato.id}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {gato.nomeGato}
                </Typography>
                <Divider />
                <Typography variant="body2">Id: {gato.id}</Typography>
                <Typography variant="body2">Tutor: {gato.nomeTutor}</Typography>
                <Typography variant="body2">Idade: {gato.idadeGato}</Typography>
                <Typography variant="body2">Peso: {gato.pesoGato}</Typography>
                <Typography variant="body2">Pelo: {gato.peloGato}</Typography>
                <Typography variant="body2">Raça: {gato.racaGato}</Typography>
                <Typography variant="body2">Endereço do tutor: {gato.enderecoTutor}</Typography>
                <Typography variant="body2">Telefone do tutor: {gato.telefoneTutor}</Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
    </Stack>
  );
}
