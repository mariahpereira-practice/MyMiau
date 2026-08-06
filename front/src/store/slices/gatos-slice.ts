import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { type Gato } from '../../types';
import { logout } from '../actions/logout';
import type { RootState } from '..';

export interface GatosFilters {
    searchGato?: string;
    searchTutor?: string;
}

interface GatosState {
    gatos: Gato[];
    filters: GatosFilters;
    isLoading: boolean;
    error?: string;
}

const initialState: GatosState = {
    gatos: [],
    filters: {},
    isLoading: false,
    error: undefined,
};

export const fetchGatos = createAsyncThunk<
    Gato[],
    GatosFilters | undefined,
    { state: RootState; rejectValue: string }
>('gatos/fetchGatos', async (filters, { getState, rejectWithValue }) => {
    try {
        const role = getState().auth.user?.role;
        const endpoint = role === 'TUTOR' ? '/gatos/meus' : '/gatos/disponiveis';

        const params = {
            ...(filters?.searchGato?.trim() ? { searchGato: filters.searchGato.trim() } : {}),
            ...(filters?.searchTutor?.trim() ? { searchTutor: filters.searchTutor.trim() } : {}),
        };

        const response = await api.get<Gato[]>(endpoint, { params });
        return response.data;
    } catch {
        return rejectWithValue('Nao foi possivel carregar os gatos.');
    }
});

const gatosSlice = createSlice({
    name: 'gatos',
    initialState,
    reducers: {
        setGatos: (state, action: PayloadAction<{ gatos: Gato[] }>) => {
            state.gatos = action.payload.gatos;
        },
        setGatosFilters: (state, action: PayloadAction<GatosFilters>) => {
            state.filters = action.payload;
        },
        clearGatosFilters: (state) => {
            state.filters = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGatos.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;
                state.filters = action.meta.arg || {};
            })
            .addCase(fetchGatos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.gatos = action.payload;
            })
            .addCase(fetchGatos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Erro ao carregar gatos.';
            });

    builder.addCase(logout, (state) => {
            state.gatos = [];
            state.filters = {};
            state.isLoading = false;
            state.error = undefined;
    });
    },
});

export const selectGatos = (state: RootState) => state.gatos;
export const { setGatos, setGatosFilters, clearGatosFilters } = gatosSlice.actions;
export default gatosSlice.reducer;