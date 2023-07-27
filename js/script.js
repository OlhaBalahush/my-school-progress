import { navigateTo } from "./routers.js";

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

async function decryptMessage(encryptedDataBase64, ivBase64, keyHex) {
    const encryptedData = new Uint8Array([...atob(encryptedDataBase64)].map(char => char.charCodeAt(0)));
    const iv = new Uint8Array([...atob(ivBase64)].map(char => char.charCodeAt(0)));
    const keyBytes = new Uint8Array(keyHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const key = await crypto.subtle.importKey('raw', keyBytes, 'AES-GCM', true, ['encrypt', 'decrypt']);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}