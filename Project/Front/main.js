window.addEventListener("load", function () {
    document.getElementById("containerALL").style.display = 'none';
    this.document.getElementById("btn-logout").style.display = "none";
    this.document.getElementById("search-label").style.display = "none";
    this.document.getElementById("search-input").style.display = "none";
    this.document.getElementById("btn-search").style.display = "none";
    this.document.getElementById("myAudio").style.display = "none"

})
var songs = [];
async function login() {
    if(document.getElementById("username").value == ""  || document.getElementById("password").value == "" ){
        alert("Password or Username fields are empty ");
    }
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username.trim() != "" && password.trim() != "") {
        let res = await fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => res.json());
        console.log(res)
        if (res.message) { // not connected
            let error = document.createElement('label');
            error.classList = "error-message";
            error.innerHTML = res.message;
            document.getElementById("input-credentials").appendChild(error);
        } else { // connected 
            sessionStorage.setItem('usersession', res.token);
            loadTableSong();
            loadTablePlaylist();
            document.getElementById("containerALL").style.display = 'block'; // display the container all after login 
            this.document.getElementById("btn-logout").style.display = "block"; // display logout button 
            this.document.getElementById("btn-submit").style.display = "none";
            this.document.getElementById("username").style.display = "none";
            this.document.getElementById("password").style.display = "none";
            this.document.getElementById("input1").style.display = "none";
            this.document.getElementById("input2").style.display = "none";
            this.document.getElementById("first-message").style.display = "none";
            this.document.getElementById("search-label").style.display = "block";
            this.document.getElementById("search-input").style.display = "inline-block";
            this.document.getElementById("btn-search").style.display = "block";
            this.document.getElementById("myAudio").style.display = "block"


        }
    }
}
function clearplaylistsongs(){
    var tb2 = document.getElementById('myPlaylistTable');
    while (tb2.rows.length > 1) {
        tb2.deleteRow(1);
    }
}
function clearAfterLogOut() {
    var tb = document.getElementById('mySongTable');
    while (tb.rows.length > 1) {
        tb.deleteRow(1);
    }
    var tb2 = document.getElementById('myPlaylistTable');
    while (tb2.rows.length > 1) {
        tb2.deleteRow(1);
    }
}
async function logout() {
    document.getElementById("containerALL").style.display = 'none'; // display the container all after login 
    this.document.getElementById("btn-logout").style.display = "none"; // display logout button 
    this.document.getElementById("btn-submit").style.display = "inline-block";
    this.document.getElementById("username").style.display = "inline-block";
    this.document.getElementById("password").style.display = "inline-block";
    this.document.getElementById("input1").style.display = "inline-block";
    this.document.getElementById("input2").style.display = "inline-block";
    this.document.getElementById("first-message").style.display = "inline-block";
    this.document.getElementById("search-label").style.display = "none";
    this.document.getElementById("search-input").style.display = "none";
    this.document.getElementById("btn-search").style.display = "none";


    //clean table rown after logout 
    clearAfterLogOut();
}


async function loadTableSong() {
    //document.getElementById("error-message").innerText = "";
     songs = await fetch("http://localhost:4000/songs", {
        method: "GET"
    }).then(res => res.json());
    for (let song of songs) {
        addRow(song.idsong, song.titlesong, song.releasedatesong);
    }
}
function addRow(id, title, date) {
    var table = document.getElementById("mySongTable");
    // console.log(table)
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    row.insertCell(0).innerHTML = id;
    row.insertCell(1).innerHTML = title;
    row.insertCell(2).innerHTML = date;
    row.insertCell(3).innerHTML = '<button style="width: 70px" onclick="addSongToPlaylist(' + id + ')">+</button>';

}
async function deletefromPlaylist(id){
    await fetch("http://localhost:4000/playlist/"+id, {
        method: "DELETE"
    }).then(res => {
        loadTablePlaylist();
        return res.json();
    });
}

async function addSongToPlaylist(id){
     await fetch("http://localhost:4000/playlist/"+id, {
        method: "POST"
    }).then(res => {
        loadTablePlaylist();
        return res.json();
    });
}
// this one for searching 
async function searchByTitle(){
    let title = document.getElementById('search-input').value;
    let res =await fetch("http://localhost:4000/songs/search/"+title, {
        method: "GET"
    }).then(res => res.json());
   console.log(res);
   //loadTableSong();
    //document.getElementById("error-message").innerText = "";
    var tb = document.getElementById('mySongTable');
    while (tb.rows.length > 1) {
        tb.deleteRow(1);
    }console.log("tkherbi9a ",res)
    for (let song of res) {
        addRow(song.idsong, song.titlesong, song.releasedatesong);
    }

}


async function loadTablePlaylist() { //-------------------------------------------
    //document.getElementById("error-message").innerText = "";
    clearplaylistsongs();
    let psongs = await fetch("http://localhost:4000/playlist", {
        method: "GET"
    }).then(res => res.json());
    for (let song of psongs) {
        console.log(song)
        addRowPlaylist(song.idsong, song.titlesong);
    }
}
function addRowPlaylist(id, title) {
    var table = document.getElementById("myPlaylistTable");
    // console.log(table)
    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);
    row.insertCell(0).innerHTML = id;
    row.insertCell(1).innerHTML = title;
    row.insertCell(2).innerHTML = '<button style="width: 70px" onclick="deletefromPlaylist(' + id + ')">-</button> <button onclick="playMusic(' + id + ')" style="width: 70px" ><></button>';
}


function playMusic(id) {
    let song = songs.filter(s => s.idsong == id)[0];
    console.log("hello " , song,songs,id)
    document.getElementById("myAudio").src = song.onlineSource;

}


