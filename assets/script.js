// Функция для отображения/скрытия фильтров при нажатии на кнопку "Фильтры"
document.getElementById('filter-button').addEventListener('click', function() {
    const filterOptions = document.getElementById('filter-options');
    filterOptions.style.display = (filterOptions.style.display === 'block') ? 'none' : 'block';
});

  // Закрытие фильтров, если кликнуть вне блока фильтров
document.addEventListener('click', function(event) {
    const filterContainer = document.querySelector('.filter-container');
    const filterOptions = document.getElementById('filter-options');
    if (!filterContainer.contains(event.target)) {
        filterOptions.style.display = 'none';
    }
});

  // Функция для применения фильтров при нажатии на кнопки фильтров
document.querySelectorAll('.filter-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        const filterType = this.getAttribute('data-filter');
        const filterOptions = document.querySelectorAll('.filter-options input');

        filterOptions.forEach(function(option) {
            if (option.value === filterType) {
            option.checked = !option.checked;
            }
        });
    });
});
