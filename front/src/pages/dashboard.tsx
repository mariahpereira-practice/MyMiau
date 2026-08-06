import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/auth-slice';
import { nomeFormatado } from '../utils/formatacao';

export function Dashboard() {
  const { user } = useSelector(selectAuth);

  return (
    <Stack spacing={3} sx={{ maxWidth: 820, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Olá, {nomeFormatado(user?.username)}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Seja bem-vindo(a) ao MyMiau! Você está inscrito(a) como <strong>{user?.role}</strong>.
          Isso significa que você pode cadastrar seu gatos e criar tarefas para CatSitters poderem cuidar deles! 
        </Typography>
      </Box>

      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sessao Atual
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Você é: <strong>{user?.role}</strong>
          </Typography>
          {user?.role === 'CATSITTER' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Pontuação: <strong>{user?.pontuacao}</strong>
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Rank Global: <strong>{user?.rankGlobal}</strong>
            </Typography>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">
            Usuário: <strong>{user?.username}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            E-mail: <strong>{user?.email}</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />
          
        </CardContent>
      </Card>
    </Stack>
  );
}
