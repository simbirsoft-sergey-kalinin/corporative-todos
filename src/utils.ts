import { addToErrorLog } from './globalVariables';
import { BASE_URI, credentials } from "./config";

export function redirectCheck(redirect: string) {
    try {
        history.pushState(null, null, redirect);
    } catch (error) {
        addToErrorLog(`Error: ${JSON.stringify(error)}. User: ${sessionStorage.getItem('login')}. Datestamp: ${Date.now()}`);
    }
}

export function addListenersToLayout(layout: any) {
    layout.getElementById('dashboard').addEventListener('click', () => history.push('/'));
    layout.getElementById('profile').addEventListener('click', () => history.push('/profile'));
    layout.getElementById('todos').addEventListener('click', () => history.push('/todos'));
    layout.getElementById('add').addEventListener('click', () => history.push('/add'));
    layout.getElementById('settings').addEventListener('click', () => history.push('/settings'));
}

export const getTodosPromise = async () => {
    const response = await fetch(BASE_URI + '/todos', {
        method: 'GET',
        credentials: credentials,
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
        },
    });
    return response.json();
};

export const fetchCsrf = async () => {
    const result = await fetch(BASE_URI + '/csrf', {
        method: 'GET',
        credentials: credentials,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    }).then((response) => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    });
    return result;
};

export function addCsrf() {
    fetchCsrf().then((csrf: string[]) => {
        const csrfElement = <HTMLInputElement>document.getElementById('csrf');
        csrfElement.value = csrf[0];
    });
}