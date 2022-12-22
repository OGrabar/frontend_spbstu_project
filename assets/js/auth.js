import {showModal, toggleModal} from "./util/modalUtils.js";
import {authUser} from "./util/authUtils.js";
import {goToGame} from "./util/redirectUtils.js";

const authButton = document.getElementById('sumbit-btn');
const username = document.getElementById('name');

const userExistModalId = '#user_exist_modal';
const sameUserButton = document.getElementById('same_user_button')

sameUserButton.onclick = function () {
    authUser(username.value);
    goToGame(username.value);
}

const newUserButton = document.getElementById('new_user_button')
newUserButton.onclick = () => {
    username.value = ''
    toggleModal(userExistModalId)
}

authButton.onclick = () => {
    const userData = localStorage.getItem(username.value);
    let userDataParsed = JSON.parse(userData);

    if (userDataParsed == null) {
        authUser(username.value);
        goToGame(username.value);
    } else {
        showModal(userExistModalId)
    }
}