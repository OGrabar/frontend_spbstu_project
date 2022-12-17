import {showModal, toggleModal} from "./util/modalUtils.js";

const authButton = document.getElementById('sumbit-btn');
const username = document.getElementById('name');

const userExistModalId = '#user_exist_modal';
const sameUserButton = document.getElementById('same_user_button')
sameUserButton.onclick = () => {
    let userDataParsed = {
        'authorized': true
    }

    localStorage.setItem(
        `${username.value}`,
        `${JSON.stringify(userDataParsed)}`
    );

    window.location.replace('game.html');
}

const newUserButton = document.getElementById('new_user_button')
newUserButton.onclick = () => {
    username.value = ''
    toggleModal(userExistModalId)
}

authButton.onclick = () => {
    unauthorizedOtherUsers();
    const userData = localStorage.getItem(username.value);
    let userDataParsed = JSON.parse(userData);

    if (userDataParsed == null) {
        userDataParsed = {
            'authorized': true
        }

        localStorage.setItem(
            `${username.value}`,
            `${JSON.stringify(userDataParsed)}`
        );
    } else {
        showModal(userExistModalId)

    }
}

function unauthorizedOtherUsers() {
    for(let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(0);
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