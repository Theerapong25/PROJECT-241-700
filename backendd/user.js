const BASE_URL = 'http://localhost:8080';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('User management page loaded');

    try {
        // 1. โหลดข้อมูลผู้ใช้จาก API
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);

        const userDOM = document.getElementById('user');

        // 2. แสดงผลเป็นตาราง
        let htmlData = `
        <table border="1" cellspacing="0" cellpadding="8">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Tel</th>
                    <th>Actions</th>
                    
                </tr>
            </thead>
            <tbody>`;

        for (let user of response.data) {
            htmlData += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstname}</td>
                    <td>${user.lastname}</td>
                    <td>${user.role}</td>
                    <td>${user.tel}</td>
                    <td>
                        <a href="index.html?id=${user.id}">
                            <button>Edit</button>
                        </a>
                        <button class="delete" data-id="${user.id}">Delete</button>
                    </td>
                </tr>`;
        }

        htmlData += `</tbody></table>`;
        userDOM.innerHTML = htmlData;

        // 3. ตั้งค่าให้ปุ่ม Delete ทำงาน
        const deleteButtons = document.getElementsByClassName('delete');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        await axios.delete(`${BASE_URL}/users/${id}`);
                        loadData(); // รีโหลดข้อมูลใหม่หลังจากลบ
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
};