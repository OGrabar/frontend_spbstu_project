const authBtn = document.getElementById('sumbit-btn');
const form = document.getElementById('login-form');
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

    window.location.replace('../index.html');

}

const newUserButton = document.getElementById('new_user_button')
newUserButton.onclick = () => {
    username.value = ''
    $(userExistModalId).modal('toggle');
}

const pathIfRequestIsSuccessful = 'index.html';

authBtn.onclick = () => {
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
        $(userExistModalId).modal({backdrop: 'static', keyboard: false});

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