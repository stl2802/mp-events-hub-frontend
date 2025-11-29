const confirmForm = document.getElementById('confirmForm');
const confirmCodeInput = document.getElementById('confirm-code');
const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
const confirmError = document.getElementById('confirmError');
const confirmSuccess = document.getElementById('confirmSuccess');
const infoText = document.getElementById('infoText');

const registeredUserId = localStorage.getItem('registeredUserId');

// Тулза для кнопки
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

// Если user_id не найден
// if (!registeredUserId) {
    // infoText.textContent = 'Не найден идентификатор пользователя. Пожалуйста, пройдите регистрацию ещё раз.';
//     confirmForm.style.display = 'none';
// } else {
//     infoText.textContent = 'Мы отправили код подтверждения на вашу почту. Введите его ниже, чтобы завершить регистрацию.';
// }

confirmForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    confirmError.textContent = '';
    confirmSuccess.textContent = '';

    if (!registeredUserId) {
        // confirmError.textContent = 'Не найден идентификатор пользователя. Вернитесь на страницу регистрации.';
        console.log('Не найден идентификатор пользователя. Вернитесь на страницу регистрации.')
        return;
    }

    const confirmCode = confirmCodeInput.value.trim();

    if (!confirmCode) {
        // confirmError.textContent = 'Введите код подтверждения.';
        console.log('Введите код подтверждения.')
        return;
    }

    const payload = {
        user_id: registeredUserId,
        confirm_code: confirmCode
    };

    try {
        // setButtonLoading(confirmSubmitBtn, true, 'Проверяем...');

        // TODO: использовать нужный API когда захостят бэк
        // переменная находится в .env файле
        const res = await fetch(`${API_URL}/api/auth/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const body = await res.json().catch(() => null);

        if (res.status === 201) {
            // confirmSuccess.textContent = 'Регистрация успешно подтверждена. Теперь вы можете войти в систему.';
            console.log('Регистрация успешно подтверждена. Теперь вы можете войти в систему.', body);

            localStorage.removeItem('registeredUserId');

            // TODO: редирект на главную
            // window.location.href = '../index.html';
        } else {
            // const message =
            //     (body && body.message) ||
            //     (body && body.detail) ||
            //     'Неверный или просроченный код подтверждения. Попробуйте ещё раз.';
            // confirmError.textContent = message;

            console.log('Ошибка подтверждения:', res.status, body);
        }
    } catch (error) {
        // confirmError.textContent = 'Проблема с подключением к серверу. Попробуйте ещё раз.';
        console.error('Ошибка при запросе /api/auth/confirm:', error);
    } finally {
        // setButtonLoading(confirmSubmitBtn, false);
    }
});
