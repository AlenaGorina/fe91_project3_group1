const avatar = document.getElementById('avatar'); 
const modal = document.getElementById('profile-modal');
const closeButton = document.getElementById('close-modal');

// Функция для получения данных пользователя
const getUserData = async () => {  //export
  try {
    const response = await fetch('http://localhost:3000/users/1');
    await handleFetchError(response);

    const userData = await response.json();
    document.getElementById('name').value = userData.name;
    document.getElementById('email').value = userData.email;
    document.getElementById('address').value = userData.address;
  } catch (error) {
    showErrorNotification(error.message); //обработка ошибок
  }
};

// Функция для обновления данных пользователя
const updateUserData = async () => {  //export 
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;

  if (!name || !email || !address) {
    showErrorNotification("Please fill out all fields.");  //проверка заполнены ли все поля
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/users/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        name,
        email,
        address,
      }),
    });

    await handleFetchError(response); //обработка ошибок ответа от сервера 
    showSuccessNotification("Profile updated successfully!");  //уведомление об успехе
  } catch (error) {
    showErrorNotification(error.message);  //обработка возможных ошибок 
  }
};

// Функция для отображения уведомлений об ошибках
const showErrorNotification = (message) => {
  const notification = document.createElement('div');
  notification.classList.add('notification', 'error');
  notification.innerText = `Error: ${message}`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
};

// Функция для отображения уведомлений об успехе
const showSuccessNotification = (message) => {
  const notification = document.createElement('div');
  notification.classList.add('notification', 'success');
  notification.innerText = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
};

// Функция для обработки ошибок ответа
const handleFetchError = async (response) => {
  if (!response.ok) {
    if (response.status === 404) {
      showErrorNotification('The requested resource was not found (404).');
    } else if (response.status === 500) {
      showErrorNotification('Server error occurred (500).');
    } else {
      showErrorNotification(`Error: ${response.status}`);
    }
    throw new Error(`Error: ${response.status}`);
  }
};

// Открытие модального окна
avatar.addEventListener('click', () => {
  modal.classList.add('show');
  getUserData();
});

// Закрытие модального окна
closeButton.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Обработка кнопок внутри модального окна
document.body.addEventListener('click', (event) => {
  if (event.target.matches('#edit-profile')) {
    updateUserData();
  } else if (event.target.matches('#logout')) {
    // Логика для выхода
  }
});
