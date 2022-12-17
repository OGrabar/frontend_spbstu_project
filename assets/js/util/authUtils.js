export const getCurrentUserName = () => {
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const itemString = localStorage.getItem(key);
        let item = JSON.parse(itemString);
        if (item.authorized) {
            return key;
        }
    }
}

export function unauthorizedOtherUsers() {
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const itemString = localStorage.getItem(key);
        let item = JSON.parse(itemString);
        if (item.authorized) {
            localStorage.setItem(
                `${key}`,
                `${JSON.stringify({'authorized': false})}`
            );
        }
    }
}

export function authUser(username) {
    let userDataParsed = {
        'authorized': true
    }

    localStorage.setItem(
        `${username}`,
        `${JSON.stringify(userDataParsed)}`
    );

    window.location.replace('game.html');
}