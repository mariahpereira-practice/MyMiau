import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../store';
import { selectAuth } from '../../../store/slices/auth-slice';
import { clearGatosFilters, fetchGatos, selectGatos } from '../../../store/slices/gatos-slice';

export const GatosPesquisa = () => {
  const dispatch = useAppDispatch();
  const { filters, isLoading } = useSelector(selectGatos);
  const { user } = useSelector(selectAuth);
  
  const [pesquisaGato, setPesquisaGato] = useState(filters.searchGato || '');
  const [pesquisaTutor, setPesquisaTutor] = useState(filters.searchTutor || '');

  const handleSearch = () => {
    dispatch(fetchGatos({ searchGato: pesquisaGato, searchTutor: pesquisaTutor }));
  };

  const handleClear = () => {
    setPesquisaGato('');
    setPesquisaTutor('');
    dispatch(clearGatosFilters());
    dispatch(fetchGatos());
  };

  return (
          <Stack spacing={2}>
            <TextField
              label="Nome do gato"
              value={pesquisaGato}
              onChange={(e) => setPesquisaGato(e.target.value)}
              size="small"
            />
            {user?.role === 'CATSITTER' && (
            <TextField
              label="Nome do tutor"
              value={pesquisaTutor}
              onChange={(e) => setPesquisaTutor(e.target.value)}
              size="small"
            />
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button variant="contained" onClick={handleSearch} disabled={isLoading}>
                Pesquisar
              </Button>
              <Button variant="outlined" onClick={handleClear} disabled={isLoading}>
                Limpar filtros
              </Button>
            </Stack>
          </Stack>
  );
};