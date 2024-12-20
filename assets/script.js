// // Функция для отображения/скрытия фильтров при нажатии на кнопку "Фильтры"
// document.querySelector('.filter-button').addEventListener('click', function() {
//     const filterOptions = document.querySelector('.filter-options');
//     filterOptions.style.display = (filterOptions.style.display === 'block') ? 'none' : 'block';
// });

//   // Закрытие фильтров, если кликнуть вне блока фильтров
// document.addEventListener('click', function(event) {
//     const filterContainer = document.querySelector('.filter-container');
//     const filterOptions = document.getElementById('filter-options');
//     //проверка, кликнули ли вне блока фильтров
//     if (!filterContainer.contains(event.target)) {
//         filterOptions.style.display = 'none';
//     }
// });

//   // Функция для применения фильтров при нажатии на кнопки фильтров
// document.querySelectorAll('.filter-btn').forEach(function(button) {
//     button.addEventListener('click', function() {
//         const filterType = this.getAttribute('data-filter');
//         const filterOptions = document.querySelectorAll('.filter-options input');

//         filterOptions.forEach(function(option) {
//             if (option.value === filterType) {
//             option.checked = !option.checked; //переключаем состояние флажка
//             }
//         });
//     });
// });


// Карточки товара
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const slider = document.getElementById("spicy");

let image = document.querySelector(".product-card__img-picture");
let cardTitle = document.querySelector(".product-card__h1");
let cardDescription = document.querySelector(".product-card__description-p");
let cardQuantity = document.querySelector(".number");
let cardPrice = document.querySelector(".product-card__setting-price");
let cardRaiting = document.querySelector('.product-card__raiting-points-p');
let cardDeliveryTime = document.querySelector('.product-card__raiting-points-mins-p')

// Получаем данные по товару из сервера
let dbUrl = `http://localhost:3000/products/${productId}`;
fetch(dbUrl)
.then(response => response.json())
.then(data => {
    image.src = data.imageSrc,
    cardTitle.textContent = data.title,
    cardDescription.textContent = data.description,
    cardQuantity.textContent = data.quantity,
    slider.value = data.spicy,
    cardPrice.textContent = data.price,
    cardRaiting.textContent = data.raiting,
    cardDeliveryTime.textContent = data.delivery
})
.catch(error => {
    console.error('Произошла ошибка:', error);
    window.location.href = '../404.html'
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


// Считаем общее кол-во товаров
orderButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/cart'); 
            const products = await response.json();

            let totalQuantity = 0;
            for (let i = 0; i < products.length; i++) {
                // Преобразуем строку в число
                totalQuantity += parseInt(products[i].quantity);
            }

            console.log(`Общее количество товаров: ${totalQuantity}`);
        } catch (error) {
            console.error('Произошла ошибка:', error);
            alert('Не удалось получить данные. Проверьте соединение с сервером.');
        }
    });


// Карточки товара end