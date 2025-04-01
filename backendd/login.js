const BASE_URL = 'http://localhost:8080';

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Loaded!"); // ตรวจสอบว่า DOM ถูกโหลดแล้ว

    document.getElementById("loginForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // ป้องกันการ submit แบบปกติ
        await check_info();
    });
});

const check_info = async () => {
    const tel = document.getElementById("tel").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginButton = document.getElementById("loginButton");

    if (!tel || !password) {
        alert("กรุณากรอกเบอร์โทรและรหัสผ่าน");
        return;
    }

    try {
        loginButton.disabled = true;
        loginButton.innerText = "กำลังเข้าสู่ระบบ...";

        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tel, password })
        });

        const data = await response.json();
        console.log("Response:", data); // ตรวจสอบข้อมูลจาก Backend

        if (data.success) {
            alert(data.message);
            localStorage.setItem("user", JSON.stringify(data.user)); // ⭐ เก็บข้อมูลผู้ใช้

            // เช็คว่าเป็น Admin หรือ User
            const redirectPage = data.isAdmin ? 'home.html' : 'FH.html';
            console.log(`Redirecting to ${redirectPage}...`);
            window.location.href = redirectPage;
        } else {
            alert(data.message || 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง!');
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ:', error);
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
        loginButton.disabled = false;
        loginButton.innerText = "เข้าสู่ระบบ";
    }
};
