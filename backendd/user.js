const BASE_URL = 'http://localhost:8080';

window.onload = async () => {
    await loadData();
    checkEditMode();
};

// ฟังก์ชันโหลดข้อมูลผู้ใช้
const loadData = async () => {
    console.log('User management page loaded');

    try {
        const response = await axios.get(`${BASE_URL}/users`);
        console.log(response.data);

        const userDOM = document.getElementById('user');

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
                        <a href="user.html?id=${user.id}">
                            <button>Edit</button>
                        </a>
                        <button class="delete" data-id="${user.id}">Delete</button>
                    </td>
                </tr>`;
        }

        htmlData += `</tbody></table>`;
        userDOM.innerHTML = htmlData;

        // ตั้งค่าปุ่มลบ
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const userId = event.target.dataset.id;
                if (confirm("Are you sure you want to delete this user?")) {
                    try {
                        await axios.delete(`${BASE_URL}/users/${userId}`);
                        loadData(); // รีโหลดข้อมูลหลังจากลบ
                    } catch (error) {
                        console.error('Error deleting user:', error);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading user data:', error);
    }
};

// โหมดการแก้ไขข้อมูล
let mode = 'CREATE'; 
let selectedID = null; 

const checkEditMode = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    console.log('ID:', userId);

    if (userId) {
        mode = 'EDIT';
        selectedID = userId;

        try {
            const response = await axios.get(`${BASE_URL}/users/${userId}`);
            const user = response.data;

            document.querySelector('input[name=firstname]').value = user.firstname;
            document.querySelector('input[name=lastname]').value = user.lastname;
            document.querySelector('input[name=address]').value = user.address;
            document.querySelector('input[name=tel]').value = user.tel;
            document.querySelector('input[name=password]').value = user.password;

            // ตรวจสอบค่าของ role
            const roleDOMs = document.querySelectorAll('input[name="role"]');
            for (let i = 0; i < roleDOMs.length; i++) {
                if (roleDOMs[i].value === user.role) {
                    roleDOMs[i].checked = true;
                }
            }

        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    }
};

// ฟังก์ชันตรวจสอบข้อมูลที่กรอก
const validateUserData = (userData) => {
    let errors = [];

    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastname) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.tel) {
        errors.push('กรุณากรอกเบอร์ติดต่อ');
    }
    if (!userData.role) {
        errors.push('กรุณาเลือกตำแหน่ง');
    }
    if (!userData.address) {
        errors.push('กรุณากรอกที่อยู่');
    }
    if (!userData.password) {
        errors.push('กรุณากรอกรหัสผ่าน');
    }
    return errors;
};

// ฟังก์ชันส่งข้อมูลผู้ใช้
const submitData = async () => {
    const firstnameDOM = document.querySelector('input[name=firstname]');
    const lastnameDOM = document.querySelector('input[name=lastname]');
    const addressDOM = document.querySelector('input[name=address]');
    const telDOM = document.querySelector('input[name=tel]');
    const roleDOM = document.querySelector('input[name="role"]:checked');
    const passwordDOM = document.querySelector('input[name=password]');

    let messageDOM = document.getElementById('message');

    try {
        let userData = {
            firstname: firstnameDOM.value,
            lastname: lastnameDOM.value,
            address: addressDOM.value,
            tel: telDOM.value,
            role: roleDOM.value,
            password: passwordDOM.value
        };

        let message = 'บันทึกข้อมูลสำเร็จ';
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData); // ส่งข้อมูล POST
        } else {
            await axios.put(`${BASE_URL}/users/${selectedID}`, userData); // ส่งข้อมูล PUT
            message = 'แก้ไขข้อมูลสำเร็จ';
        }

        messageDOM.innerText = message;
        messageDOM.className = "message success";

        loadData();

    } catch (error) {
        console.log('Error message:', error.message);

        let errorMessage = error.message;
        let errorList = [];

        if (error.response) {
            errorMessage = error.response.data.message || errorMessage;
            errorList = error.response.data.errors || [];
        }

        let htmlData = `<div>${errorMessage}</div><ul>`;
        errorList.forEach(err => {
            htmlData += `<li>${err}</li>`;
        });
        htmlData += '</ul>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger'; 
    }
};

// ฟังก์ชันค้นหาผู้ใช้
const searchBooks = async () => {
    const searchTerm = document.querySelector('input[name="search-firstname"]').value;
    try {
        const response = await axios.get(`${BASE_URL}/users?search=${searchTerm}`);
        console.log(response.data);

        // แสดงผลการค้นหาผู้ใช้
        loadData(response.data);
    } catch (error) {
        console.error('Error searching for users:', error);
    }
};
