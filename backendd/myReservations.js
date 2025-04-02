// ดึง book_id จาก URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('book_id');

// ดึงชื่อหนังสือจาก server และแสดงบนหน้าเว็บ
const bookTitleElement = document.getElementById('bookTitle');

async function fetchBookTitle() {
    try {
        const response = await axios.get(`http://localhost:8080/books/${bookId}`);
        bookTitleElement.textContent = response.data.title; // แสดงชื่อหนังสือ
    } catch (error) {
        console.error('Error fetching book title:', error);
        bookTitleElement.textContent = 'ไม่พบข้อมูลหนังสือ';
    }
}

// เรียกฟังก์ชันดึงชื่อหนังสือ
fetchBookTitle();

// ฟังก์ชันแปลงวันที่ให้แสดงเฉพาะ YYYY-MM-DD
function formatDate(dateString) {
    return new Date(dateString).toISOString().split('T')[0]; 
}

// ตรวจสอบและกำหนดค่าขั้นสูงสุดของวันที่คืน
document.getElementById('borrowDate').addEventListener('change', function () {
    const borrowDate = new Date(this.value);
    if (isNaN(borrowDate)) return;

    let maxReturnDate = new Date(borrowDate);
    maxReturnDate.setDate(maxReturnDate.getDate() + 20); // กำหนดวันสูงสุดเป็น 20 วัน

    document.getElementById('returnDate').min = formatDate(borrowDate);
    document.getElementById('returnDate').max = formatDate(maxReturnDate);
});

// ส่งข้อมูลการจองไปยัง server
const reservationForm = document.getElementById('reservationForm');
reservationForm.onsubmit = async (event) => {
    event.preventDefault();

    const borrowDate = document.getElementById('borrowDate').value;
    const returnDate = document.getElementById('returnDate').value;

    // ตรวจสอบว่าผู้ใช้เลือกวันที่คืนภายใน 20 วัน
    let maxReturnDate = new Date(borrowDate);
    maxReturnDate.setDate(maxReturnDate.getDate() + 20);

    if (new Date(returnDate) > maxReturnDate) {
        alert('คุณสามารถยืมหนังสือได้ไม่เกิน 20 วัน');
        return;
    }

    try {
        const response = await axios.post('http://localhost:8080/reservations', {
            book_id: bookId,
            borrow_date: new Date(borrowDate).toISOString(),//เวลาที่ส่งมาจากผู้ใช้
            return_date: new Date(returnDate).toISOString()//เวลาที่ผู้ใช้คืนหนังสือ
        });

        alert('บันทึกข้อมูลการยืมสำเร็จ');
        console.log(response.data);
    } catch (error) {
        console.error('Error saving reservation:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
};