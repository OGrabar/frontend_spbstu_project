window.onload = () => {
    let tbody = document.getElementById('tbody');

    let localStorageEntries = Object.entries(localStorage).sort((a, b) => {
        a = JSON.parse(a[1])['maxScore'];
        b = JSON.parse(b[1])['maxScore'];
        return b - a;
    });

    const targetUsername = document.location.href.split('?')[1].split('=')[1]

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



