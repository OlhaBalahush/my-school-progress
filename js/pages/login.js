import { navigateTo } from "../routers.js";

export function generateLogin() {
    let token = localStorage.getItem('JWToken')
    if (token != null && token != undefined) {
        navigateTo('/')
    }

    while (document.body.firstChild) {
        document.body.removeChild(document.body.firstChild)
    }

    let bodyContiner = document.createElement('div')
    bodyContiner.setAttribute('id', 'body-container')
    let container = document.createElement('div')
    container.className = 'container'
    bodyContiner.append(container)
    document.body.append(bodyContiner)

    let title = document.createElement('h2');
    title.innerHTML = 'Login'

    let loginForm = document.createElement('form')
    loginForm.setAttribute('id', 'loginForm')
    container.append(title, loginForm)

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // cahange it on just button or loading stuff

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Base64 encode the credentials
        const credentials = btoa(`${await decryptMessage('Pq2UsVR0ar3vkwNvrnLOXU/QWmU=', 'r40owCgBYjHy6Fg/', 'ca1be660b76670797503e5aa392e62fd2b4e2516014c98e32056b8dde5bc772b')}:${await decryptMessage('HZfAz1OBvwH3x5aJ9OcKg1bFmzF6bA1G5dY=', '3+d3J5d55WKYTnII', '43af42102b964b39ffed6e611bb07062e690808bedf80901cbb672d5a0af20d1')}`);

        try {
            const response = await fetch('https://01.kood.tech/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Store the JWT in local storage or session in local storage
                localStorage.setItem('JWToken', data);
                navigateTo('/');
            } else {
                usernameInput.value = ''
                passwordInput.value = ''
                if (response.status === 403) {
                    alert('Incorrect password');
                } else {
                    alert(`User doesn't exist`);
                }
            }
        } catch (error) {
            console.error('An error occurred:', error);
            // Handle other errors (e.g., network issues)
            alert('An error occurred. Please try again later.');
        }
    });

    let usernameFG = document.createElement('div')
    usernameFG.className = 'form-group'

    let usernameLB = document.createElement('label')
    usernameLB.setAttribute('for', 'username')
    usernameLB.innerHTML = 'Username:'

    let usernameInput = document.createElement('input')
    usernameInput.setAttribute('type', 'text')
    usernameInput.setAttribute('id', 'username')
    usernameInput.setAttribute('name', 'username')
    usernameInput.setAttribute('placeholder', 'Enter your username')
    usernameInput.required = true

    usernameFG.append(usernameLB, usernameInput)

    let passwordFG = document.createElement('div')
    passwordFG.className = 'form-group'

    let passwordLB = document.createElement('label')
    passwordLB.setAttribute('for', 'password')
    passwordLB.innerHTML = 'Password:'

    let passwordInput = document.createElement('input')
    passwordInput.setAttribute('type', 'password')
    passwordInput.setAttribute('id', 'password')
    passwordInput.setAttribute('name', 'password')
    passwordInput.setAttribute('placeholder', 'Enter your password')
    passwordInput.required = true

    passwordFG.append(passwordLB, passwordInput)

    let submitFG = document.createElement('div')
    submitFG.className = 'form-group'

    let submitBtn = document.createElement('input')
    submitBtn.setAttribute('type', 'submit')
    submitBtn.value = 'Login'
    submitFG.appendChild(submitBtn)

    loginForm.append(usernameFG, passwordFG, submitFG)
}

async function decryptMessage(encryptedDataBase64, ivBase64, keyHex) {
    const encryptedData = new Uint8Array([...atob(encryptedDataBase64)].map(char => char.charCodeAt(0)));
    const iv = new Uint8Array([...atob(ivBase64)].map(char => char.charCodeAt(0)));
    const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', true, ['encrypt', 'decrypt']);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}