import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { CatPawPrint } from "../components/CatPawPrint";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../store";
import { useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { type AuthResponse } from "../types";
import { setCredentials } from "../store/slices/auth-slice";
import { toast } from "react-toastify";

export function Login() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const loginMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post<AuthResponse>('/auth/local', {
                identifier,
                password
            });
            return response.data;
        },
        onSuccess: (data) => {
            dispatch(setCredentials({
                user: data.user,
                token: data.jwt
            }));
            toast.success(`Bem vindo(a) de volta, ${data.user.username}!`);
            navigate('/');
        },
        onError: () => {
            toast.error('Credenciais inválidas. Tente novamente.');
        }
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!identifier || !password) {
            toast.error('Por favor, preencha todos os campos.');
            return;
        }
        // imprimir variáveis de estado no escopo (para auditoria / depuração) - - resposta a pergunta 
       // O aluno fez a impressão das variáveis de estado no escopo?
        console.log('Login state:', { identifier, passwordLength: password.length });
        loginMutation.mutate();
    }, [identifier, password]);

  return (
    <Box>
        <CatPawPrint />
        <Container 
            maxWidth="lg"
            sx={{
                minHeight: '75vh',
                display: 'flex',
                justifyContent: 'center',
                px: { xs: 4, md: 12 }
            }}
        >
            <Paper
            elevation={0}
            sx={{
                p: {xs: 3, sm: 4},
                borderRadius: 3,
                animation: 'fadeIn 0.5s',
                "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "scale(0.95)" },
                    to: { opacity: 1, transform: "scale(1)" }
                }
            }}>
                <Typography
                component="h1"
                variant="h5"
                sx={{
                    fontWeight: 700, 
                    color: "primary.main",
                    textAlign: "center",
                    mb: 3
                }}
                >
                    Acessar Conta
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Nome de Usuário"
                    autoComplete="username"
                    autoFocus
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    >
                    </TextField>
                    <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Senha"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    >
                    </TextField>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: 3,
                        py: 1.2,
                        mb: 2
                    }}
                    disabled={loginMutation.isPending}
                    >
                       {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
                    </Button>
                </Box>
            </Paper>

        </Container>

    </Box>
  )
}