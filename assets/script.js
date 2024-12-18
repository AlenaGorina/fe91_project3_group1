const slider = document.getElementById("spicy");


let image = document.querySelector(".product-card__img-picture");
let cardTitle = document.querySelector(".product-card__h1");
let cardDescription = document.querySelector(".product-card__description-p");
let cardQuantity = document.querySelector(".number");
let cardPrice = document.querySelector(".product-card__setting-price")

// Получаем данные по товару из сервера
let dbUrl = "http://localhost:3000/products/1";
fetch(dbUrl)
.then(response => response.json())
.then(data => {
    image.src = data.imageSrc,
    cardTitle.textContent = data.title,
    cardDescription.textContent = data.description,
    cardQuantity.textContent = data.quantity,
    slider.value = data.spicy,
    cardPrice.textContent = data.price
})
.catch(error => {
    console.error('Произошла ошибка:', error);
  });

  // Обновляем текущее значение при изменении ползунка
  slider.oninput = function() {
        // output.innerText = this.value;
        slider.value = this.value;
        console.log(slider.value);
        return slider.value;
        };
   

// Функция увеличения количества товара
function increaseQuantity() {
    cardQuantity.textContent++;
    console.log(`Текущее количество товара: ${cardQuantity.textContent}`);
    document.querySelector('.number').textContent = cardQuantity.textContent;
    return cardQuantity.textContent;
}

// Функция уменьшения количества товара
function decreaseQuantity() {
    if (cardQuantity.textContent > 0) {
        cardQuantity.textContent--;
        console.log(`Текущее количество товара: ${cardQuantity.textContent}`);
        document.querySelector('.number').textContent = cardQuantity.textContent;
        return cardQuantity.textContent;
    }
}

let removeButton = document.querySelector('.product-card__button1');
let addButton = document.querySelector('.product-card__button2');

addButton.addEventListener('click', increaseQuantity);
removeButton.addEventListener('click', decreaseQuantity);



// // Отправляем данные на сервер по клику на кнопку
// let orderButton = document.querySelector('.product-card__setting-order');
// orderButton.addEventListener('click', function() {

// const url = 'http://localhost:3000/cart';
// fetch(url, {
//     method: "POST",
//     headers: {
//         'Content-Type': 'application/json' 
//     },
//     body: JSON.stringify({
//         id:"1",
//         quantity:cardQuantity.textContent, 
//         spicy:slider.value}) 
// })
// .then(response => response.json())
// .then(data => console.log('Ответ от сервера:', data))
// .catch(error => console.error('Ошибка:', error));
// });


// Функция для проверки наличия товара в корзине
async function checkProductInCart(productId) {
    try {
        const cartUrl = 'http://localhost:3000/cart'; 
        const response = await fetch(cartUrl); 
        const cartItems = await response.json(); 

        return cartItems.some(item => item.id === productId); 
    } catch (error) {
        console.error('Ошибка при проверке корзины:', error);
        return false; 
    }
}

// Обработчик события для кнопки добавления товара в корзину
let orderButton = document.querySelector('.product-card__setting-order');
orderButton.addEventListener('click', async function() {
    const productId = "1"; // ID продукта

    // Проверка наличия товара в корзине
    const isInCart = await checkProductInCart(productId);

    if (isInCart) {
        // Если товар уже в корзине, обновляем его количество
        updateProductQuantity(productId);
    } else {
        // Если товара нет в корзине, добавляем новый товар
        addNewProductToCart(productId);
    }
});

// Функция для обновления количества товара в корзине
async function updateProductQuantity(productId) {
    try {
        const cartUrl = 'http://localhost:3000/cart'; 
        const response = await fetch(cartUrl + '/' + productId, { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                quantity: cardQuantity.textContent,
                spicy:slider.value
            }) 
        });

        const updatedItem = await response.json();
        console.log('Обновленный товар:', updatedItem);
    } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
    }
}

// Функция для добавления нового товара в корзину
async function addNewProductToCart(productId) {
    try {
        const cartUrl = 'http://localhost:3000/cart';
        const response = await fetch(cartUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: productId,
                quantity: cardQuantity.textContent,
                spicy: slider.value
            })
        });

        const newItem = await response.json();
        console.log('Новый товар добавлен:', newItem);
    } catch (error) {
        console.error('Ошибка при добавлении товара:', error);
    }
}



