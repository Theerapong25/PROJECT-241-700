const BASE_URL = "http://localhost:8080";

// ✅ ดึงข้อมูลการจองจากตาราง reservations
async function fetchReservations() {
    axios.get(`${BASE_URL}/reservations`)
        .then(response => {
            const reservations = response.data;
            const tbody = document.getElementById("reservation-list");
            tbody.innerHTML = "";

            if (reservations.length === 0) {
                tbody.innerHTML = "<tr><td colspan='6'>❌ ไม่มีข้อมูลการจอง</td></tr>";
                return;
            }

            // ฟังก์ชันแปลงวันที่
            const formatDate = (dateString) => {
                return dateString ? new Date(dateString).toISOString().split("T")[0] : "📌 ยังไม่คืน";
            };

            reservations.forEach(reservation => {
                const returnDate = formatDate(reservation.return_date);
                const isReturned = reservation.return_date !== null;
                
                const row = `
                    <tr>
                        <td>${reservation.book_id}</td>
                        <td>${formatDate(reservation.borrow_date)}</td>
                        <td>${formatDate(reservation.due_date)}</td>
                        <td>${reservation.status}</td>
                        <td>${returnDate}</td>
                        <td>
                            ${isReturned ? "✅ คืนแล้ว" : `<button onclick="returnBook(${reservation.id}, '${reservation.due_date}')">📌 คืนหนังสือ</button>`}
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML("beforeend", row); // ใช้ insertAdjacentHTML แทน innerHTML +=
            });
        })
        .catch(error => {
            console.error("🚨 Error fetching reservations:", error);
            document.getElementById("reservation-list").innerHTML = "<tr><td colspan='6'>❌ โหลดข้อมูลล้มเหลว</td></tr>";
        });
}

async function returnBook(reservationId, dueDate) {
    // 📌 ให้แอดมินเลือกวันที่คืนเอง
    const returnDate = prompt("📅 กรุณากรอกวันที่คืนหนังสือ (YYYY-MM-DD):");

    if (!returnDate) {
        alert("❌ กรุณากรอกวันที่คืนหนังสือ!");
        return;
    }

    // ✅ ตรวจสอบรูปแบบของวันที่ที่กรอก
    const datePattern = /^\d{4}-\d{2}-\d{2}$/; // รูปแบบ "YYYY-MM-DD"
    if (!datePattern.test(returnDate)) {
        alert("❌ กรุณากรอกวันที่ในรูปแบบที่ถูกต้อง (YYYY-MM-DD)!");
        return;
    }

    // ✅ ตรวจสอบวันที่ที่กรอกเป็นวันที่ที่ถูกต้อง
    const returnDateObj = new Date(returnDate);
    if (isNaN(returnDateObj)) {
        alert("❌ วันที่ที่กรอกไม่ถูกต้อง!");
        return;
    }

    // ✅ เปรียบเทียบวันที่คืนกับกำหนดคืน
    const dueDateObj = new Date(dueDate);
    const status = returnDateObj > dueDateObj ? "overdue" : "returned";

    try {
        const response = await axios.put(`${BASE_URL}/reservations/${reservationId}`, {
            return_date: returnDate,
            status: status
        });

        alert("✅ อัปเดตสถานะคืนหนังสือสำเร็จ!");
        fetchReservations(); // โหลดข้อมูลใหม่
    } catch (error) {
        console.error("🚨 Error updating return status:", error);
        alert("❌ เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
}


// ✅ โหลดข้อมูลเมื่อหน้าเว็บเปิดขึ้น
document.addEventListener("DOMContentLoaded", fetchReservations);
