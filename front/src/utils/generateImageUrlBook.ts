import { HOST } from "../services/api";

const DEFAULT_IMAGE = "https://m.media-amazon.com/images/I/71kCqeR-9IL._AC_SX322_CB1169409_QL70_.jpg";

export function getImageUrlBook(url: string | { url?: string } | undefined): string {
    const normalizedUrl = typeof url === 'string'
        ? url.trim()
        : (url && typeof url === 'object' && typeof url.url === 'string' ? url.url.trim() : '');

    if (!normalizedUrl) {
        return DEFAULT_IMAGE;
    }

    if (/^https?:\/\//i.test(normalizedUrl)) {
        return normalizedUrl;
    }

    return `${HOST}${normalizedUrl.startsWith('/') ? normalizedUrl : `/${normalizedUrl}`}`;
}