const BASE_URL = 'http://localhost:8080';

    
    const loadPopularBooks = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/books`);
            const books = response.data;
            const bookListDOM = document.getElementById('book-list');

            let htmlData = '';
            for (let book of books) {
                htmlData += `
                    <div class="book-card">
                        <h3>${book.title}</h3>
                        <p>ผู้เขียน: ${book.author}</p>
                        <p>ประเภท: ${book.category}</p>
                        <button class="book-reserve-btn" data-book-id="${book.book_id}" onclick="reserveBook(${book.book_id})">
                        จองหนังสือ
                    </button>
                    </div>
                `;
            }
            bookListDOM.innerHTML = htmlData;
        } catch (error) {
            console.error('Error loading books:', error);
        }
    };
    const reserveBook = async (bookId) => {
        try {
            const response = await axios.post(`${BASE_URL}/reservations`, { book_id: bookId });
            alert('คุณได้ทำการจองหนังสือสำเร็จ!');
            console.log(response.data);
    
            
            window.location.href = 'myReservations.html?book_id=' + bookId;
    
        } catch (error) {
            console.error('Error reserving book:', error);
            alert('เกิดข้อผิดพลาดในการจองหนังสือ');
        }
    };
    

    const searchBooks = () => {
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        const bookCards = document.querySelectorAll('.book-card'); 
    
        bookCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('p').textContent.toLowerCase();
    
            if (title.includes(searchQuery) || author.includes(searchQuery)) {
                card.style.display = ''; 
            } else {
                card.style.display = 'none'; 
            }
        });
    };
    

    window.onload = loadPopularBooks;