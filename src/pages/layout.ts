import { routing } from '../router';
import { addListenersToLayout } from '../utils';

const Layout = async () => {
    const layout = new DocumentFragment();

    const header: HTMLElement = document.createElement('header');
    header.innerHTML = `
        <button id="dashboard">dashboard</button>
        <button id="profile">profile</button>
        <button id="todos">todos</button>
        <button id="add">add</button>
        <button id="settings">settings</button>
    `;
    layout.appendChild(header);

    addListenersToLayout(layout);

    const main: HTMLElement = document.createElement('main');
    main.id = 'main';
    layout.appendChild(main);
    routing(main);

    return layout;
};

export default Layout;