let  tbody = document.getElementById('tbody');

window.onload = () => {
    let localStorageEntries = Object.entries(localStorage).sort((a, b) => {
        a = JSON.parse(a[1])['maxScore'];
        b = JSON.parse(b[1])['maxScore'];
        return b - a;
    });

    for (const [username, userData] of localStorageEntries) {
        const userDataParsed = JSON.parse(userData);
        console.log(username, userDataParsed, localStorage.length)


        let tr = "<tr>";
        const maxScore = userDataParsed.maxScore ? userDataParsed.maxScore : 0;
        const lastScore = userDataParsed.lastScore ? userDataParsed.lastScore : 0;
        tr += `<td>${username}</td>`;
        tr += `<td>${maxScore}</td>`;
        tr += `<td>${lastScore}</td>`;
        tbody.innerHTML += tr;

    }
  /*  $(document).ready(function () {
        $('#results_table').DataTable({
            language: {
                url: '/localisation/fr_FR.json'
            }
        });
    });*/
/*    $(document).ready(function () {
        $('#results_table').DataTable({
            language: {
                url: 'dataTables.ru.json'
            }
        });
    });*/


}



