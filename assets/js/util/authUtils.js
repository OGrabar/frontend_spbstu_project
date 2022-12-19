export const getCurrentUserName = () => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const itemString = localStorage.getItem(key);
        let item = JSON.parse(itemString);
        if (item.authorized) {
            return key;
        }
    }
}

export function unauthorizedOtherUsers() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const itemString = localStorage.getItem(key);
        let item = JSON.parse(itemString);
        if (item.authorized) {
            localStorage.setItem(key, JSON.stringify({authorized: false}));
        }
    }
}

export function unauthorizedUser(username) {
    const userData = localStorage.getItem(username);
    const userDataParsed = JSON.parse(userData);
    if (userDataParsed.authorized) {
        userDataParsed.authorized = false;
        localStorage.setItem(username, JSON.stringify(userDataParsed));
    }

}

export function authUser(username) {
    const userData = localStorage.getItem(username);
    let userDataParsed;
    if (userData) {
        userDataParsed = JSON.parse(userData);
        userDataParsed.authorized = true;
    } else {
        userDataParsed = { authorized: true };
    }

    localStorage.setItem(username, JSON.stringify(userDataParsed));

    window.location.replace('game.html');
}