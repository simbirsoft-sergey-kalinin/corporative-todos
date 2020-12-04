import { BASE_URI, credentials } from "../config";
import { todoType } from '../types';

export default function () {
    const phrase = new URL(document.location.href).searchParams.get(
        'phrase'
    );

    const layout = new DocumentFragment();

    const results = document.createElement('div');
    results.innerHTML = `
        <div>Search by phrase: <span id="phrase"></span></div>
        <ul id="searchList"></ul>
    `;
    layout.appendChild(results);

    layout.getElementById('phrase').textContent = phrase;


    const getTodosPromise = async () => {
        const response = await fetch(BASE_URI + '/todos', {
            method: 'GET',
            credentials: credentials,
            headers: {
                Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
            },
        });
        return response.json();
    };

    const todosList = document.createElement('div');
    getTodosPromise().then(async (todos: todoType[]) => {
        const currentUserTodosMathed: todoType[] = todos.filter((todo: todoType) => {
            return todo.author.toString() === sessionStorage.getItem('userId') &&
                todo.text.indexOf(phrase) > -1;
        })

        const functionNotice = await fetch(BASE_URI + '/functions', {
            method: 'GET',
            credentials: credentials,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
            },
        });
        functionNotice.json().then((notice) => {
            const functionAlert = notice[0]['body'];

            if (phrase) {
                currentUserTodosMathed.forEach((todo: todoType) => {
                    const text: HTMLElement = document.createElement('div');
                    text.textContent = todo.text;
                    todosList.appendChild(text);
                });
            } else {
                setTimeout(functionAlert, 0);
            }
        });
    });

    layout.appendChild(todosList);

    return layout;
};
