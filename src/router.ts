import dashboard from './pages/dashboard';
import profile from './pages/profile';
import todos from './pages/todos';
import add from './pages/add';
import search from './pages/search';
import settings from './pages/settings';
import { redirectCheck } from './utils';

export const routing = (main: HTMLElement) => {
    const getRoutesList = () => ({
        '/': dashboard,
        '/profile': profile,
        '/todos': todos,
        '/add': add,
        '/search': search,
        '/settings': settings,
    });

    history.push = (route: string) => {
        history.pushState(null, null, route);
        window.dispatchEvent(new Event('pushstate'));
    };

    const defaultPageProcess = () => {
        history.pushState(null, null, '/');
        return dashboard;
    };

    const routeStateHandler = () => {
        setDynamicRoutes((currentPath: string) => {
            let path = currentPath;
            const routesList = getRoutesList();
            const redirect = new URL(document.location.href).searchParams.get(
                'redirect'
            );

            if (redirect) {
                path = redirect;
                redirectCheck(redirect);
            }

            const currentPage = Object.prototype.hasOwnProperty.call(routesList, path)
                ? routesList[path]
                : defaultPageProcess();
            main.innerHTML = '';
            main.append(currentPage());
        });
    };

    window.addEventListener('pushstate', () => {
        routeStateHandler();
    });
    window.addEventListener('popstate', () => {
        routeStateHandler();
    });

    routeStateHandler();
};

export const setDynamicRoutes = (callback: (arg: string) => void) => {
    const currentPath = document.location.pathname;
    callback(currentPath);
};
