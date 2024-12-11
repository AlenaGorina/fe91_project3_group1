const slider = document.getElementById("spicy");

        // Обновляем текущее значение при изменении ползунка
        slider.oninput = function() {
            // output.innerText = this.value;
            console.log(this.value);
        };

        let quantity = 0;

// Функция увеличения количества товара
function increaseQuantity() {
    quantity++;
    console.log(`Текущее количество товара: ${quantity}`);
    document.querySelector('.number').textContent = quantity;
}

// Функция уменьшения количества товара
function decreaseQuantity() {
    if (quantity > 0) {
        quantity--;
        console.log(`Текущее количество товара: ${quantity}`);
        document.querySelector('.number').textContent = quantity;
    }
}


let addButton = document.querySelector('button2');
let removeButton = document.querySelector('button1');

addButton.addEventListener('click', increaseQuantity());
removeButton.addEventListener('click', decreaseQuantity());

// Отправляем данные на сервер
const url = 'http://localhost:3000/posts';
fetch(url, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify(quantity) 
})
.then(response => response.json())
.then(data => console.log('Ответ от сервера:', data))
.catch(error => console.error('Ошибка:', error));


