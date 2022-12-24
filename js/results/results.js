import {getAuthUserName} from "../util/authUtils.js";
import {goToGame, goToLogin} from "../util/redirectUtils.js";

const targetUsername = getAuthUserName();

const gameOverButton = document.getElementById("game_over_button");
gameOverButton.onclick = function () { goToLogin(); }

const newGameButton = document.getElementById("new_game_button");
newGameButton.onclick = function () { goToGame(targetUsername); }

function sortPlayers() {
    return Object.entries(localStorage).sort((a, b) => {
        a = JSON.parse(a[1])['maxScore'];
        b = JSON.parse(b[1])['maxScore'];
        return b - a;
    });
}

window.onload = () => {

    let tbody = document.getElementById('tbody');

    let localStorageEntries = sortPlayers();

    for (const [username, userData] of localStorageEntries) {
        const userDataParsed = JSON.parse(userData);

        let tr;
        if (username === targetUsername) {
            tr = '<tr bgcolor="red">'
        } else {
            tr = '<tr>'
        }
        const maxScore = userDataParsed.maxScore ? userDataParsed.maxScore : 0;
        const lastScore = userDataParsed.lastScore ? userDataParsed.lastScore : 0;
        tr += `<td>${username}</td>`;
        tr += `<td>${maxScore}</td>`;
        tr += `<td>${lastScore}</td>`;
        tbody.innerHTML += tr;
    }
}



