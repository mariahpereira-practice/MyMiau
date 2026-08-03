export interface BookImage {
    url?: string;
}

export interface Book {
    id: number;
    documentId: string;
    title: string;
    description: string;
    price: number;
    stock: number;
    image?: string | BookImage;
    image_url?: string;
    autor: string;
};

export interface ResponseBooks {
    data: Book[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        }
    }
};

export interface BookListProps {
    data?: ResponseBooks;
    isLoading: boolean;
    isError: boolean;
    searchText: string;
    page: number;
    setPage: (page: number) => void;
    totalPage?: number;
};

export interface ResponseSingleBook {
    data: Book;
}

export interface BookInfoProps {
    book: Book;
    onAddToCart?: () => void;
}

export interface AuthResponse {
    jwt: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface CartItem {
    id: number;
    documentId: string;
    quantity: number;
    book: {
        id: number;
        documentId: string;
        title: string;
        price: number;
        image?: string | BookImage;
        image_url?: string;
    }
}

export interface ResponseCartItems {
    data: CartItem[];
}

export interface ProdutoComprado {
    id: number;
    documentId: string;
    book: {
        id: number;
        documentId: string;
        title: string;
        price: number;
        image?: string | BookImage;
        image_url?: string;
    }
}


