import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { CatPawPrint } from "../components/CatPawPrint";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import { toast } from "react-toastify";
import type { AuthResponse } from "../types";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../store";
import { setCredentials } from "../store/slices/auth-slice";

export function Register() {

    const dispatch = useAppDispatch();

    const isError = false;
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post<AuthResponse>("/auth/local/register", {
                username,
                email,
                password
            });
            return response.data;
        },
        onSuccess: (data) => { 
            dispatch(setCredentials({user: data.user, token: data.jwt}));
            toast.success("Cadastro realizado com sucesso!");
            navigate("/");
        },
        onError: (error) => {
            toast.error("Erro ao registrar a conta. Verifique os dados e tente novamente.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        registerMutation.mutate();
    }

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
            }}>
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
                <Typography component="h1" variant="h5"
                sx={{
                    fontWeight: 700, 
                    color: "primary.main",
                    textAlign: "center",
                    mb: 3
                }}>
                    Registre sua conta
                </Typography>

                {isError && (
                    <Alert severity="error" sx={{
                    width: "100%",
                    mt: 2
                    }}>Ocorreu um erro ao registrar a conta. Verifique os dados e tente novamente.
                </Alert>
                )}

                <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nome de Usuário"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    ></TextField>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></TextField>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></TextField>
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={registerMutation.isPending}
                    >
                    {registerMutation.isPending ? "Registrando..." : "Registrar"}
                    </Button>
                </Box>
            </Paper>
        </Container>
    </Box>
    
    )
}