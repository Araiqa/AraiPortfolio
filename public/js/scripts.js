document.addEventListener('DOMContentLoaded', () => {
    const registerContainer = document.getElementById('registerContainer');
    const loginContainer = document.getElementById('loginContainer');

    const showSignInButton = document.getElementById('showSignIn');
    const showSignUpButton = document.getElementById('showSignUp');

    // Переключение на форму входа
    showSignInButton.addEventListener('click', () => {
        registerContainer.classList.add('d-none');
        loginContainer.classList.remove('d-none');
    });

    // Переключение на форму регистрации
    showSignUpButton.addEventListener('click', () => {
        loginContainer.classList.add('d-none');
        registerContainer.classList.remove('d-none');
    });

    // Регистрация
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Registration successful! Please log in.');
                registerContainer.classList.add('d-none');
                loginContainer.classList.remove('d-none');
            } else {
                alert('Error: ' + (result.error || 'Registration failed.'));
            }
        } catch (err) {
            console.error('Error during registration:', err);
        }
    });

    // Вход
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = {
            username: document.getElementById('loginUsername').value,
            password: document.getElementById('loginPassword').value,
            twoFactorCode: document.getElementById('twoFactorCode').value,
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', result.token); // Сохранение токена
                alert('Login successful!');
                window.location.href = 'homepage.html'; // Перенаправление на домашнюю страницу
            } else {
                alert('Error: ' + (result.message || 'Login failed.'));
            }
        } catch (err) {
            console.error('Error during login:', err);
        }
    });
});
