import { TestRunner } from 'nodejsdev'; // для тестирования
import assert from 'assert';   // для утверждений в тестах
import { JSDOM } from 'jsdom'; // для работы с DOM в тестах

// Подключаем основной JavaScript файл
const scriptPath = './assets/userprofile.js'; 

// Первый тест — проверка открытия модального окна
TestRunner.create('Modal and User Data Tests')
  .test('should open modal when avatar is clicked', async () => {
    const dom = await JSDOM.fromFile('./index.html'); // Загружаем HTML файл в JSDOM
    const { window } = dom; // Получаем объект window из JSDOM
    const { document } = window; // Получаем объект document, который позволяет манипулировать DOM

    const avatar = document.getElementById('avatar'); // Ищем элемент с id 'avatar'
    const modal = document.getElementById('profile-modal'); // Ищем элемент с id 'profile-modal'
    
    assert.strictEqual(modal.classList.contains('show'), false); // Проверяем, что модальное окно не отображается
    
    avatar.click(); // Имитируем клик по аватару (это должно открыть модальное окно)
    
    assert.strictEqual(modal.classList.contains('show'), true); // Проверяем, что после клика модальное окно появилось
  }) 
  .test('should fetch user data correctly', async () => {   // Второй тест — проверка получения данных пользователя
    const dom = await JSDOM.fromFile('./index.html');
    const { window } = dom;
    const { document } = window;

    globalThis.fetch = async (url) => {
      assert.strictEqual(url, 'http://localhost:3000/users/1');  // Проверяем, что запрос отправляется на правильный URL
      return {
        ok: true,
        json: async () => ({
          name: 'John Doe',
          email: 'johndoe@example.com',
          address: '123 Main St',
        }),
      };
    };

    const { getUserData } = await import(scriptPath);  // Импортируем функцию getUserData  основного скрипта
    
    await getUserData(); // Вызываем функцию, которая должна сделать запрос и обновить DOM
    
    assert.strictEqual(document.getElementById('name').value, 'John Doe'); // Проверяем, что данные были корректно загружены
    assert.strictEqual(document.getElementById('email').value, 'johndoe@example.com');
    assert.strictEqual(document.getElementById('address').value, '123 Main St');
  })
  .test('should update user data successfully', async () => {
    const dom = await JSDOM.fromFile('./index.html');
    const { window } = dom;
    const { document } = window;

    globalThis.fetch = async (url, options) => {
      assert.strictEqual(url, 'http://localhost:3000/users/1');
      assert.strictEqual(options.method, 'PUT');  // Проверяем, что запрос имеет метод PUT
      assert.deepStrictEqual(JSON.parse(options.body), {  // Проверяем, что тело запроса соответствует ожидаемым данным
        id: 1,
        name: 'Jane Doe',
        email: 'janedoe@example.com',
        address: '456 Elm St',
      });
      return { ok: true };
    };

    const { updateUserData } = await import(scriptPath);  

    document.getElementById('name').value = 'Jane Doe';
    document.getElementById('email').value = 'janedoe@example.com';
    document.getElementById('address').value = '456 Elm St';

    await updateUserData(); // Вызываем функцию, которая должна отправить обновлённые данные на сервер
    
    assert.strictEqual(document.getElementById('name').value, 'Jane Doe'); // Проверяем, что данные были обновлены
    assert.strictEqual(document.getElementById('email').value, 'janedoe@example.com');
    assert.strictEqual(document.getElementById('address').value, '456 Elm St');
  })
  .run();
