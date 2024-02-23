
export const sendRequest = async ({ url, method = "POST", body, idToken }: { url: string; method?: string; body?: any; idToken: string | null; }) => {

    const headers: HeadersInit = new Headers();
    if (idToken) {
        headers.set('idToken', idToken);
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/" + url,
        {
            method,
            headers,
            body: JSON.stringify(body)
        });

    return response.json()
}
