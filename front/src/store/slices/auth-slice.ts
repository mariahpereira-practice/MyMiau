import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User } from '../../types';
import { logout } from '../actions/logout';

interface AuthState {
    user?: User;
    token?: string;
    isAuthenticated: boolean;
}

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
    isAuthenticated: !!savedToken,
    token: savedToken || undefined,
    user: savedUser ? JSON.parse(savedUser) : undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            const { user, token } = action.payload;
            
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
        }
    },
   extraReducers: (builder) => {
    builder.addCase(logout, (state) => {
        state.user = undefined;
        state.token = undefined;
        state.isAuthenticated = false;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    });
   }
});

export const selectAuth = (state: any) => state.auth;
export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;