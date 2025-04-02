const BASE_URL = 'http://localhost:8080';

window.onload = async () => {
    await loadData();
    checkEditMode();
};

// ข้อมูลหนังสือ
const loadData = async () => {
    console.log('Book management page loaded');

    try {
        const response = await axios.get(`${BASE_URL}/books`);
        console.log(response.data);

        const bookDOM = document.getElementById('book-id');

        let htmlData = "";
        for (let book of response.data) {
            htmlData += `
                <tr>
                    <td>${book.book_id}</td>
                    <td>${book.title}</td>
                    <td>${book.category}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>
                        <a href="mgbook.html?book_id=${book.book_id}">
                            <button>Edit</button>
                        </a>
                    </td>
                </tr>`;
        }

        bookDOM.innerHTML = htmlData;

        
        const deleteButtons = document.querySelectorAll('.delete');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const book_id = event.target.dataset.id;
                if (confirm("Are you sure you want to delete this book?")) {
                    try {
                        await axios.delete(`${BASE_URL}/books/${book_id}`);
                        loadData(); 
                    } catch (error) {
                        console.error('Error deleting book:', error);
                    }
                }
            });
        });
    } catch (error) {
        console.error('Error loading book data:', error);
    }
};

let mode = 'CREATE'; 
let selectedID = null; 
const checkEditMode = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const book_id = urlParams.get('book_id');
    console.log('ID:', book_id);

    if (book_id) {
        mode = 'EDIT';
        selectedID = book_id;

        try {
            const response = await axios.get(`${BASE_URL}/books/${book_id}`);
            const book = response.data;

            document.querySelector('input[name=title]').value = book.title;
            document.querySelector('input[name=author]').value = book.author;
            document.querySelector('input[name=category]').value = book.category;
            document.querySelector('input[name=isbn]').value = book.isbn;

        } catch (error) {
            console.log('Error fetching book data:', error);
        }
    }
};


const validateBookData = (bookData) => {
    let errors = [];

    if (!bookData.title) {
        errors.push('กรุณากรอกชื่อหนังสือ');
    }
    if (!bookData.author) {
        errors.push('กรุณากรอกชื่อผู้เขียน');
    }
    if (!bookData.category) {
        errors.push('กรุณากรอกประเภทหนังสือ');
    }
    if (!bookData.isbn) {
        errors.push('กรุณากรอก ISBN');
    }
    return errors;
};

// ฟังก์ชันส่งข้อมูลหนังสือ
const submitData = async () => {
    let titleDOM = document.querySelector('input[name=title]');
    let authorDOM = document.querySelector('input[name=author]');
    let categoryDOM = document.querySelector('input[name=category]');
    let isbnDOM = document.querySelector('input[name=isbn]');
    
    let messageDOM = document.getElementById('message');

    try {
        let bookData = {
            title: titleDOM.value,
            author: authorDOM.value,
            category: categoryDOM.value,
            isbn: isbnDOM.value,
        };

        let message = 'บันทึกข้อมูลสำเร็จ';
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/books`, bookData); // ส่งข้อมูล POST
        } else {
            await axios.put(`${BASE_URL}/books/${selectedID}`, bookData); // ส่งข้อมูล PUT
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