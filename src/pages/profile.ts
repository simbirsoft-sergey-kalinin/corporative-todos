import { BASE_URI, STATISTICS_URI, credentials, logoutUrl } from "../config";
import { getVariable } from '../globalVariables';
import { userType, personalInfoType } from '../types';

export default function () {
    const layout = new DocumentFragment();

    const profile: HTMLElement = document.createElement('div');
    profile.innerHTML = `
        <br>
        <button id="logout">logout</button>
        <br>
        <br>
        <div id="yourPersonalInfo"></div>
        <br>
        <button id="showLogin">show your login</button>
        <div id="yourLogin"></div>
    `;
    layout.appendChild(profile);
    layout.getElementById('logout').addEventListener('click', async () => {
        const response = await fetch(STATISTICS_URI + '/errors', {
            method: 'POST',
            credentials: credentials,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                lat: getVariable('lat'),
                lng: getVariable('lng'),
            }),
        });
        if (response) {
            await logout();
            history.push('/');
            location.reload();
        }
    });

    layout.getElementById('showLogin').addEventListener('click', () => {
        const getUsersPromise = async () => {
            const response = await fetch(BASE_URI + '/users', {
                method: 'GET',
                credentials: credentials,
                headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
                },
            });
            return response.json();
        };

        getUsersPromise().then((users: userType[]) => {
            const currentUser: userType = users.find((user: userType) => {
                return user.id.toString() === sessionStorage.getItem('userId');
            })
            if (currentUser.email) {
                const output: string = 'Your login is: ' + currentUser.email;
                document.getElementById('yourLogin').innerText = output;
            }
        });
    });


    const getPersonalinfoPromise = async () => {
        const response = await fetch(BASE_URI + '/personal', {
            method: 'GET',
            credentials: credentials,
            headers: {
                Authorization: `Bearer ${window.sessionStorage.getItem('bearer')}`,
            },
        });
        return response.json();
    };

    getPersonalinfoPromise().then((personalInfo: personalInfoType[]) => {
        const info: personalInfoType = personalInfo.find((infoItem: personalInfoType) => {
            return infoItem.id.toString() === sessionStorage.getItem('userId');
        })
        if (info.info) {
            const parsedInfo: any = JSON.parse(info.info);
            const output: string = `
                    Salary: ${parsedInfo.salary}, 
                    Bonuses count: ${parsedInfo.bonuses}, 
                    Toxic rating: ${parsedInfo.toxicRating}
                `;
            document.getElementById('yourPersonalInfo').textContent = output;
        }
    });

    const logout = async () => {
        const result = await fetch(BASE_URI + logoutUrl, {
            method: 'POST',
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

    return layout;
};
