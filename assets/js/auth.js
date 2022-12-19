import {showModal, toggleModal} from "./util/modalUtils.js";
import {authUser, unauthorizedOtherUsers} from "./util/authUtils.js";

const authButton = document.getElementById('sumbit-btn');
const username = document.getElementById('name');

const userExistModalId = '#user_exist_modal';
const sameUserButton = document.getElementById('same_user_button')

sameUserButton.onclick = function () {
    authUser(username.value);
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
        authUser(username.value);
    } else {
        showModal(userExistModalId)
    }
}