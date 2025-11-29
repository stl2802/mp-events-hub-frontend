const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');
const registerSuccess = document.getElementById('registerSuccess');
const registerSubmitBtn = document.getElementById('registerSubmitBtn');

// TODO: на втором шаге регистрации, можно сохранять этот id в localStorage (или еще куда)
// и использовать ее в новой форме confirm_code по API: /api/auth/confirm
let registeredUserId = null;

// Тулза для состояния кнопки
// function setButtonLoading(button, isLoading, loadingText) {
//     if (!button) {
//         return;
//     }

//     if (isLoading) {
//         button.disabled = true;
//         button.dataset.originalText = button.textContent;
//         button.textContent = loadingText;
//     } else {
//         button.disabled = false;
//         if (button.dataset.originalText) {
//             button.textContent = button.dataset.originalText;
//             delete button.dataset.originalText;
//         }
//     }
// }

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    registerError.textContent = '';
    registerSuccess.textContent = '';

    const email = registerForm.elements['email'].value.trim();
    const firstName = registerForm.elements['first_name'].value.trim();
    const lastName = registerForm.elements['last_name'].value.trim();
    const password = registerForm.elements['password'].value;

    // if (!email || !firstName || !lastName || !password) {
    //     registerError.textContent = 'Пожалуйста, заполните все поля.';
    //     return;
    // }

    const payload = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password
    };

    try {
        // setButtonLoading(registerSubmitBtn, true, 'Отправляем...');

        // TODO: использовать нужный API когда захостят бэк
        // переменная находится в .env файле
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const body = await res.json().catch(() => null);

        if (res.status === 200) {
            if (body && body.user_id) {
                registeredUserId = body.user_id;
                
                localStorage.setItem('registeredUserId', String(registeredUserId));
                console.log('Зарегистрирован пользователь с user_id:', registeredUserId);
            } else {
                console.log('Ответ /auth/register без user_id:', body);
            }

            // registerSuccess.textContent = 'Регистрация прошла успешно. Проверьте почту, мы отправили код подтверждения.';

            window.location.href = './secondStep/confirmCode.html';
        } else {
            // const message =
            //     (body && body.message) ||
            //     (body && body.detail) ||
            //     'Не удалось завершить регистрацию. Проверьте данные и попробуйте ещё раз.';
            // registerError.textContent = message;

            console.log('Не удалось завершить регистрацию. Проверьте данные и попробуйте ещё раз.')
        }
    } catch (error) {
        console.error('Ошибка при запросе /api/auth/register:', error);

        // registerError.textContent = 'Проблема с подключением к серверу. Попробуйте ещё раз.';
    } finally {
        setButtonLoading(registerSubmitBtn, false);
    }
});
