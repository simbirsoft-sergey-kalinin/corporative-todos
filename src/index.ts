import login from './pages/login';
import Layout from './pages/layout';
import { checkAuthorizationUrl, credentials, BASE_URI } from './config';

const checkAuth = async () => {
    const result = await fetch(BASE_URI + checkAuthorizationUrl, {
        method: 'GET',
        credentials: credentials,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    }).then((response) => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    });
    return result.data;
};

const checkAuthorization = async () => await checkAuth();

const App = async () =>
    (await checkAuthorization()) ? Layout() : login();

const index = async () => {
    document.getElementById('root').appendChild(await App());
};

index();

