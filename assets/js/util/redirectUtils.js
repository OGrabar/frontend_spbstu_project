export function goToLogin() {
    window.location.replace('login.html')
}

export function goToResults(userName) {
    window.location.replace('results.html?username=' + userName);
}

export function goToGame(userName) {
    window.location.replace('game.html?username=' + userName);
}