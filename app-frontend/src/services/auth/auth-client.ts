import { serviceUrls } from '../../lib/config/service-urls';
import { fetchJson } from '../http/fetch-json';

export interface AuthExampleResponse {
    ok: boolean;
    service: string;
    message: string;
}

export async function getAuthExample() {
    if (!serviceUrls.auth) {
        throw new Error('NEXT_PUBLIC_AUTH_SERVICE_URL is not configured');
    }

    return fetchJson<AuthExampleResponse>(`${serviceUrls.auth}/api/example`);
}
