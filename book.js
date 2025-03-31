const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

let conn = null;

// เชื่อมต่อฐานข้อมูล MySQL
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8831
    });
};

// ฟังก์ชันตรวจสอบข้อมูลก่อนเพิ่ม
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
const validateData = (userData) => {
    let errors = []

    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastname) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if(!userData.role){
        errors.push('กรุณากรอกตำเเหน่ง')
    }
    if(!userData.address){
        errors.push('กรุณากรอกที่อยู่')
    }
    if(!userData.password){
        errors.push('กรุณากรอกรหัสผ่าน')
    }
    if(!userData.tel){
        errors.push('กรุุณากรอกเบอร์ติดต่อ')
    }
    return errors
}
// **1. ดึงรายการหนังสือทั้งหมด**
app.get('/books', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM books');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

// **2. เพิ่มหนังสือใหม่**
app.post('/books', async (req, res) => {
    try {
        let book = req.body;
        const errors = validateBookData(book);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        const [results] = await conn.query(
            'INSERT INTO books (title, author, category,isbn ) VALUES (?, ?, ?, ?)',
            [book.title, book.author, book.category, book.isbn]
        );
        res.json({ message: 'เพิ่มหนังสือสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: error.message, errors: error.errors || [] });
    }
});

// **3. ดึงข้อมูลหนังสือตาม ID**
app.get('/books/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM books WHERE book_id = ?', [id]);
        if (results.length == 0) {
            throw { statusCode: 404, message: 'ไม่พบข้อมูลหนังสือ' };
        }
        res.json(results[0]);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// **4. อัปเดตข้อมูลหนังสือตาม ID**
app.put('/books/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateBook = req.body;
        const errors = validateBookData(updateBook);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        const [results] = await conn.query('UPDATE books SET ? WHERE book_id = ?', [updateBook, id]);
        res.json({ message: 'อัปเดตข้อมูลหนังสือสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// **5. ลบหนังสือตาม ID**
app.delete('/books/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM books WHERE book_id = ?', [id]);
        res.json({ message: 'ลบหนังสือสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});
// GET /users - ดึง Users ทั้งหมด
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
});

// POST /users - เพิ่ม Users ใหม่
app.post('/users', async (req, res) => {

    try{
        let user = req.body;
        const errors = validateData(user);
        if(errors.length > 0){
            throw{
                message: 'กรุณากรอกข้อมูลให้ครบ',
                errors: errors
            }
        }
        const results = await conn.query('INSERT INTO users SET ?', user);
        res.json({
                message: 'Create user successfully',
                data: results[0]
    })
    }catch(error){
        const errorMessage = error.message || 'something went wrong';
        const errors = error.errors || [];
        console.error('error :', error.message);
        res.status(500).json({
            message: errorMessage,
            errors: errors
        }
        )} 
});
app.post('/login', async (req, res) => {
    try {
        const { tel, password } = req.body;

        if (!tel || !password) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }
        const [users] = await conn.query('SELECT * FROM users WHERE tel = ? AND password = ?', [tel, password]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const user = users[0];
        delete user.password; 

        res.json({ message: 'เข้าสู่ระบบสำเร็จ', user });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
});

// GET /users/:id - ดึง Users ตาม ID
app.get('/users/:id', async (req, res) => {
    try{
       let id = req.params.id;
       const results = await conn.query('SELECT * FROM users WHERE id = ?', id);
       if(results[0].length == 0){
        throw {statusCode: 404, message: 'user not found'}
       }    
        res.json(results[0][0])
    }catch(error){
        console.error('error :', error.message);
        let statusCode = error.statusCode || 500;
        res.status(500).json({
            message:'something went wrong',
            errorMessage: error.message
        }
        )
    }
});

// PUT /users/:id - อัปเดตข้อมูล Users ตาม ID
app.put('/users/:id', async (req, res) => {
    try{
        let id = req.params.id;
    let updateUser = req.body;
        let user = req.body;
        const results = await conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id]);
        res.json({
                message: 'Update user successfully!!',
                data: results[0]
    })
    }catch(error){
        console.error('error :', error.message);
        res.status(500).json({
            message:'something went wrong',
            errorMessage: error.message
        }
  )} 
});

   
// DELETE /users/:id - ลบ Users ตาม ID
app.delete('/users/:id', async (req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('DELETE  FROM users  WHERE id = ?', id);
        res.json({
                message: 'Delete user successfully !!',
                data: results[0]
    })
    }catch(error){
        console.error('error :', error.message);
        res.status(500).json({
            message:'something went wrong',
            errorMessage: error.message
        }
  )} 
});
app.post('/reservations', async (req, res) => {
    try {
        let { book_id } = req.body;
        if (!book_id) {
            throw { message: 'กรุณาระบุ book_id' };
        }

        
        let borrowDate = new Date();
        let dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); 

        
        const [results] = await conn.query(
            'INSERT INTO reservations (book_id, borrow_date, due_date, status) VALUES (?, ?, ?, ?)',
            [book_id, borrowDate, dueDate, 'borrowed']
        );

        res.json({ message: 'จองหนังสือสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log(`เซิร์ฟเวอร์ทำงานที่พอร์ต ${port}`); 
});
