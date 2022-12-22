export function authUser(username) {
    const userData = localStorage.getItem(username);

    if (!userData) {
        const userDataParsed = {
            maxScore: 0,
            lastScore: 0
        };
        localStorage.setItem(username, JSON.stringify(userDataParsed));
    }
}

export function getAuthUserName() {
    return decodeURI(document.location.href.split('?')[1]).split('=')[1]
}