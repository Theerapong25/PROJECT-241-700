document.getElementById('logout').addEventListener('click', function() {
    alert('ออกจากระบบสำเร็จ!');
    window.location.href = 'login.html';
});

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "login.html";
    } else {
        document.getElementById("username").textContent = user.firstname + " " + user.lastname;
    }
});