import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/slices/auth-slice';

export function Dashboard() {
  const { user } = useSelector(selectAuth);

  return (
    <Stack spacing={3} sx={{ maxWidth: 820, mx: 'auto' }}>
      <Box>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
          Painel do Projeto
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Esta area e o ponto de partida para novas paginas e para a sua regra de negocio.
        </Typography>
      </Box>

      <Card elevation={1}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sessao Atual
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">
            Usuario: <strong>{user?.username}</strong>
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Email: <strong>{user?.email}</strong>
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
