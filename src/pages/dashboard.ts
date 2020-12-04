import { BASE_URI, credentials } from "../config";
import { addToErrorLog, setVariable, getVariable } from '../globalVariables';
import { reviewType, todoType, countType } from '../types';
import { addCsrf } from '../utils';

export default function () {
    navigator.geolocation.getCurrentPosition(function (position) {
        setVariable('lat', position.coords.latitude.toString());
        setVariable('lng', position.coords.longitude.toString());
    });

    const layout = new DocumentFragment();

    const dashboard: HTMLElement = document.createElement('div');
    dashboard.innerHTML = `
        <h1>Now you have <span id="todosCount"></span> todos</h2>
        <h2>Our sponsors:</h2>
        <a href="https://facebook.com" rel="noopener noreferrer nofollow'" target="_blank">
            Facebook
        </a>
        <br>
        <a href="https://twitter.com" rel="noopener noreferrer nofollow'" target="_blank">
            Twitter
        </a>
        <br>        
        <button id="toAdd">Click my for add new todo</button>
        <br>
        <h3>Please write a review</h3>
        <textarea id="review"></textarea>
        <input type="hidden" id="csrf">
        <button id="sendReview">SEND REVIEW</button>
        <div id="errorMessage"></div>
    `;
    layout.appendChild(dashboard);

    layout.getElementById('toAdd').addEventListener('click', () => {
        history.push('/add');
    });

    layout.getElementById('sendReview').addEventListener('click', async () => {
        const regards = ' /n With best regards: ' + sessionStorage.getItem('login');
        const userId: number = +sessionStorage.getItem('userId');
        const extraInfo = ' \nSender ID: ' + userId;
        const reviewElement = <HTMLTextAreaElement>document.getElementById('review');
        const reviewText: string = clearTags(reviewElement.value.trim());

        if (!reviewText) {
            alert('Please enter text');
            return;
        }

        if (reviewText.length < 10) {
            const errorMessageElement = <HTMLElement>document.getElementById('errorMessage');
            const message = `
                Your message ${reviewText} is too short.
            `;
            errorMessageElement.textContent = message;
            return;
        }

        const review: reviewType = {
            review: reviewText + regards + extraInfo,
            userId: userId,
        }

        const response = await fetch(BASE_URI + '/reviews', {
            method: 'POST',
            credentials: credentials,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
                'X-CSRF-TOKEN': (<HTMLInputElement>document.getElementById('csrf')).value,
            },
            body: JSON.stringify(review),
        });
        if (!response) {
            addToErrorLog(`Error add todo operation for todoId: ${userId} at ${Date.now()}`);
        } else {
            let reviewCount = location.hash ? +location.hash.replace('#', '') : 0;
            reviewCount++;
            history.push('/#' + reviewCount);
            setVariable('reviewText', reviewText);
            reviewElement.value = '';
        }
    });

    const getTodosCount = async () => {
        const response = await fetch(BASE_URI + '/count', {
            method: 'GET',
            credentials: credentials,
            headers: {
                Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
            },
        });
        response.json().then((counts: countType[]) => {
            const currentUserTodosCount: countType = counts.find((count: countType) => {
                return count.userId === +sessionStorage.getItem('userId');
            })
            document.getElementById('todosCount').textContent = currentUserTodosCount.todosCount + '';
        });
    };

    addCsrf();

    setTimeout(() => {
        getTodosCount();
        addCsrf();
        const reviewCount = location.hash ? location.hash.replace('#', '') : null;
        if (reviewCount) {
            const sendButtonElement = document.getElementById('sendReview');
            const sendButtonText = sendButtonElement.innerHTML;
            const message = `. Thank you for submitting your review ${reviewCount} times.`;
            sendButtonElement.textContent = sendButtonText + message;
        }
    });

    function clearTags(message: string) {
        const div = document.createElement('div');
        div.innerText = message;

        const tag = div.querySelectorAll('*');
        let i = tag.length;
        while (i--) {
            tag[i].parentNode.removeChild(tag[i]);
        }

        return div.innerText.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "");
    }

    return layout;
}
