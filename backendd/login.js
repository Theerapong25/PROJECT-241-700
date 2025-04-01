const BASE_URL = 'http://localhost:8080';

const check_info = async () => {
   const tel = document.getElementById("tel").value.trim();
   const password = document.getElementById("password").value.trim();
   const loginButton = document.getElementById("loginButton");

   // ตรวจสอบค่าเบอร์โทรและรหัสผ่าน
   if (!tel || !password) {
      alert("กรุณากรอกเบอร์โทรและรหัสผ่าน");
      return;
   }

   try {
      // ปิดปุ่มเพื่อป้องกันการคลิกซ้ำ
      loginButton.disabled = true;
      loginButton.innerText = "กำลังเข้าสู่ระบบ...";

      // ส่งข้อมูลไปยัง Backend
      const response = await axios.post(`${BASE_URL}/login`, { tel, password });

      console.log("Response:", response.data); // ตรวจสอบข้อมูลที่ได้จาก Backend

      // ถ้าเข้าสู่ระบบสำเร็จ
      if (response.data.success) {
         alert(response.data.message);

         // เช็คว่าเป็น Admin หรือ User
         if (response.data.isAdmin) {
            console.log("Redirecting to home.html...");
            window.location.href = 'home.html'; // เปลี่ยนหน้าไปที่ home.html
         } else {
            console.log("Redirecting to home_User.html...");
            window.location.href = 'home_User.html'; // เปลี่ยนหน้าไปที่ home_User.html
         }
      } else {
         alert(response.data.message || 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง!');
      }
   } catch (error) {
      console.error('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
   } finally {
      // เปิดปุ่มกลับหลังจากทำงานเสร็จ
      loginButton.disabled = false;
      loginButton.innerText = "เข้าสู่ระบบ";
   }
};

// เพิ่ม Event Listener ให้แน่ใจว่ารอให้ DOM โหลดก่อน
document.addEventListener("DOMContentLoaded", function () {
   console.log("DOM Loaded!"); // ตรวจสอบว่า DOM ถูกโหลด
   document.getElementById("loginForm").addEventListener("submit", async function(event) {
      event.preventDefault(); // ป้องกันการ submit แบบธรรมดา
      await check_info();
   });
});