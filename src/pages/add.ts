import { BASE_URI, credentials } from "../config";
import { addToErrorLog, setVariable, addToEvents, getVariable } from '../globalVariables';
import { todoType } from '../types';
import { addCsrf } from '../utils';

export default function () {
    const layout = new DocumentFragment();

    const addForm = document.createElement('div');
    addForm.innerHTML = `
        <input placeholder="new todo text" id="text">
        <input type="hidden" id="csrf">
        <button id="add">add</button>
    `;
    layout.appendChild(addForm);

    addCsrf();

    layout.getElementById('add').addEventListener('click', async () => {
        const textEl = <HTMLInputElement>document.getElementById('text');
        const text: string = textEl.value.trim();
        const userId: number = +window.sessionStorage.getItem('userId');

        if (!text) {
            alert('Please enter text');
            return;
        }

        const todo: todoType = {
            isComplete: false,
            author: userId,
            text: text,
        };

        const response = await fetch(BASE_URI + '/todos', {
            method: 'POST',
            credentials: credentials,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
                'X-CSRF-TOKEN': (<HTMLInputElement>document.getElementById('csrf')).value,
            },
            body: JSON.stringify(todo),
        });
        if (!response) {
            addToErrorLog(`Error add todo operation for todoId: ${userId} at ${Date.now()}`);
        } else {
            response.json().then(todo => {
                textEl.value = '';
                setVariable('newTodoText', todo.text);
                const userId = sessionStorage.getItem('userId');
                addToEvents(`New todo was added at ${Date.now()}. userId: ${userId} `);
                history.push('/todos?phrase=' + getVariable('newTodoText'));
            });
        }
    });

    return layout;
};
