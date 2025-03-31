const BASE_URL = 'http://localhost:8080/';

// ฟังก์ชันสำหรับการล็อกอิน
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();  

    let submitButton = document.getElementById('submitButton');
    let tel = document.getElementById("phone").value;  // ใช้ id="phone"
    let password = document.getElementById("password").value;  // ใช้ id="password"
    let messageDOM = document.getElementById('message');  // ต้องมี div ที่แสดงข้อความ

    try {
        

        // ส่งข้อมูลการล็อกอินไปยังเซิร์ฟเวอร์
        const response = await axios.post(`${BASE_URL}/login`, { tel, password });

        const userData = response.data.user;

        messageDOM.innerText = "เข้าสู่ระบบสำเร็จ";
        messageDOM.className = "message success";

        localStorage.setItem('user', JSON.stringify(userData));  // เก็บข้อมูลผู้ใช้ใน localStorage

        // เปลี่ยนหน้าไปตามบทบาทของผู้ใช้
        if (userData.role === "admin") {
            window.location.href = "admin_db.html";  // ไปที่หน้า admin
        } else {
            window.location.href = "Home_p.html";  // ไปที่หน้า user
        }

    } catch (error) {
        console.log('Error:', error);

        // แสดงข้อความข้อผิดพลาดเมื่อเข้าสู่ระบบไม่สำเร็จ
        messageDOM.innerHTML = `<div>${error.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}</div>`;
        messageDOM.className = "message danger";

        submitButton.style.display = "block";  // แสดงปุ่ม Submit อีกครั้ง
    }
});
