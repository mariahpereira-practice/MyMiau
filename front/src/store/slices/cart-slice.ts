import { createAsyncThunk, createSlice,} from "@reduxjs/toolkit";
import { logout } from '../actions/logout';
import type { Book, CartItem, ResponseCartItems } from "../../types";
import { api } from "../../services/api";
import { calculateTotals } from "../../utils/calculateTotals";

function normalizeCartItem(raw: any): CartItem {
    const id = raw.id;
    const documentId = raw.documentId;
    const quantity = raw.quantity;
    const book = (raw.book ?? raw.product) as Book;

    return {
        id,
        documentId,
        quantity,
        book,
    } as CartItem;
}

const StatusCart = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCEEDED: "succeeded",
    FAILED: "failed"
} as const;

export type StatusCart = typeof StatusCart[keyof typeof StatusCart];

interface CartState {
    itens: CartItem[];
    totalAmount: number;
    totalQuantity: number;
    status: StatusCart;
    error: string | null;
    processingItemIds: string[];
}

const initialState: CartState = {
    itens: [],
    totalAmount: 0,
    totalQuantity: 0,
    status: StatusCart.IDLE,
    error: null,
    processingItemIds: []
};

export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async(_, {rejectWithValue}) => {
    try {
        const { data } = await api.get<ResponseCartItems>(
            "/cart-itens?populate[product][populate][image]=*"
        );
        return data.data;
    } catch {
        return rejectWithValue("Não foi possível carregar o carrinho.");
    }
});

export const updateCartItem = createAsyncThunk(
    "cart/updateCartItem", 
    async(
        {documentId, quantity}: {documentId: string; quantity: number },
        {rejectWithValue},
    ) => {
        try {
            const {data} = await api.put(`/cart-itens/${documentId}`, {
                data: {quantity}
            });
            return data.data as CartItem;
        } catch {
            return rejectWithValue("Não foi possível atualizar o item.");
        }
    },
);

export const addCartItem = createAsyncThunk(
    "cart/addCartItem",
    async (
        book: Book, {dispatch, rejectWithValue}
    ) => {
        try {
            const {data: existing} = await api.get<ResponseCartItems>(
                `/cart-itens?filters[product][documentId][$eq]=${book.documentId}&populate[product][populate][image]=*`
            );
            const existingItem = existing.data[0] ?? null;
            if(existingItem) {
                const updated = await dispatch(updateCartItem({
                    documentId: existingItem.documentId,
                    quantity: existingItem.quantity + 1,
                })).unwrap();
                return updated;
            }

            const { data } = await api.post("/cart-itens", {
                data: {
                    product: book.documentId,
                    quantity: 1
                }
            });
            return {... data.data, book } as CartItem;
        } catch {
            return rejectWithValue("Não foi possível adicionar o livro ao carrinho. Por favor, tente novamente.")
        }
    },
);

export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem",
    async (documentId: string, {rejectWithValue}) => {
        try {
            await api.delete(`/cart-itens/${documentId}`);
            return documentId;
        } catch {
            return rejectWithValue("Não foi possível remover o item.");
        }
    },
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: () => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => {
            return initialState;
        });

        builder.addCase(fetchCartItems.pending, (state) => {
            state.status = StatusCart.LOADING;
            state.error=null;
        });

        builder.addCase(fetchCartItems.fulfilled, (state, action) => {
            state.status = StatusCart.SUCCEEDED;
            state.itens = (action.payload ?? []).map((raw: any) => normalizeCartItem(raw));
            const totals = calculateTotals(state.itens);
            state.totalAmount = totals.totalAmount;
            state.totalQuantity = totals.totalQuantity;
        });

        builder.addCase(fetchCartItems.rejected, (state, action) => {
            state.status = StatusCart.FAILED;
            state.itens = [];
            state.error = action.payload as string;
        });

        builder.addCase(addCartItem.fulfilled, (state, action) => {
            const raw = action.payload as any;
            if (raw) {
                const existingIndex = state.itens.findIndex((it) => it.documentId === raw.documentId);
                if (existingIndex >= 0) {
                    state.itens[existingIndex].quantity = raw.quantity ?? state.itens[existingIndex].quantity;
                    if (raw.book || raw.product) {
                        state.itens[existingIndex] = normalizeCartItem(raw);
                    }
                } else {
                    state.itens.push(normalizeCartItem(raw));
                }

                const totals = calculateTotals(state.itens);
                state.totalAmount = totals.totalAmount;
                state.totalQuantity = totals.totalQuantity;
            }
        });

        builder.addCase(updateCartItem.pending, (state, action) => {
            state.processingItemIds.push(action.meta.arg.documentId);
        });

        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            state.processingItemIds = state.processingItemIds.filter(
                (id) => id !== action.meta.arg.documentId,
            );
            const index = state.itens.findIndex(
                (item) => item.documentId === action.payload.documentId,
            );
            if(index !== -1) {
                const raw = action.payload as any;
                const hasProduct = Boolean(raw?.book);
                if (hasProduct) {
                    state.itens[index] = normalizeCartItem(raw);
                } else {
                    state.itens[index].quantity = raw.quantity ?? state.itens[index].quantity;
                }
            }
            const totals = calculateTotals(state.itens);
            state.totalAmount = totals.totalAmount;
            state.totalQuantity = totals.totalQuantity;
        });

        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.processingItemIds = state.processingItemIds.filter(
                (id) => id !== action.meta.arg.documentId,
            );
        });

        builder.addCase(removeCartItem.pending, (state, action) => {
            state.processingItemIds.push(action.meta.arg);
        });

        builder.addCase(removeCartItem.fulfilled, (state, action) => {
            state.itens = state.itens.filter(
                (item) => item.documentId !== action.payload,
            );
            const totals = calculateTotals(state.itens);
            state.totalAmount = totals.totalAmount;
            state.totalQuantity = totals.totalQuantity;
        });

        builder.addCase(removeCartItem.rejected, (state, action) => {
            state.processingItemIds = state.processingItemIds.filter(
                (id) => id!==action.meta.arg,
            );
        });
    }
});

export const selectCart = (state: any) => state.cart;
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;