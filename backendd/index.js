const BASE_URL = 'http://localhost:8080'
let mode = 'CREATE' // default mode
let selectedID = ''

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('ID', id)
    if (id) {
        mode = 'EDIT'
        selectedID = id
        // ดึงข้อมูล user ที่ต้องการแก้ไข
        try{
            const response = await axios.get(`${BASE_URL}/users/${id}`)
            const user = response.data


        // เราจะนำข้อมูล user ที่ดึงมาใส่ใน input  ที่เรามี
        let firstNameDOM = document.querySelector('input[name = firstname]');
        let lastNameDOM = document.querySelector('input[name = lastname]');
        let passwordDOM = document.querySelector('input[name = password]');
        let addressDOM = document.querySelector('input[name = address]');
        let telDOM = document.querySelector('input[name = tel]')

        firstNameDOM.value = user.firstname
        lastNameDOM.value = user.lastname
        passwordDOM.value = user.password
        addressDOM.value = user.address
        telDOM.value =user.tel

        let roleDOMs = document.querySelectorAll('input[name = role]') ;
       
        //เช็คเพศที่เราเลือกไว้
        for(let i = 0; i < roleDOMs.length; i++){
            if(roleDOMs[i].value == user.role){
                roleDOMs[i].checked = true
            }
        } 
        }catch(error){
            console.log('error',error)
        }
    }
}

const validateData = (userData) => {
    let errors = []

    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastname) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.tel) {
        errors.push('กรุณากรอกเบอร์ติดต่อ')
    }
    if (!userData.role) {
        errors.push('กรุณาเลือกตำเเหน่ง')
    }
    if(!userData.address){
        errors.push('กรุณากรอกที่อยู่')
    }
    if(!userData.password){
        errors.push('กรุณากรอกรหัสผ่าน')
    }
    return errors
}

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name = firstname]');
    let lastNameDOM = document.querySelector('input[name = lastname]');
    let telDOM = document.querySelector('input[name = tel]');
    let roleDOM = document.querySelector('input[name = role]:checked') || {};
    let addressDOM = document.querySelector('input[name = address]');
    let passwordDOM = document.querySelector('input[name = password]');

    let messageDOM = document.getElementById('message');
    try {
        let userData = {
            firstname: firstNameDOM.value,
            lastname: lastNameDOM.value,
            tel : telDOM.value,
            role: roleDOM.value,
            address: addressDOM.value,
            password: passwordDOM.value
        }
        console.log("submitData", userData);
        
        let message = 'บันทึกข้อมูลสำเร็จ';
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/users`, userData);
        } else {
            await axios.put(`${BASE_URL}/users/${selectedID}`, userData);
            message = 'แก้ไขข้อมูลสำเร็จ';
        }
        messageDOM.innerText = message;
        messageDOM.className = "message success";
        
        // เปลี่ยนหน้าไปยัง home_User.html หลังจากส่งข้อมูลสำเร็จ
        window.location.href = 'login.html';
    } catch (error) {
        console.log('error message', error.message)
        console.log('error', error.errors)
        if (error.response) {
            console.log(error.response)
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }
        let htmlData = '<div>'
        htmlData += `<div>${error.message}</div>`
        htmlData += '<ul>'
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += `<li>${error.errors[i]}</li>`
        }
        htmlData += '</ul>'
        htmlData += '</div>'

        messageDOM.innerHTML = htmlData
        messageDOM.className = 'message danger' 
    }
}