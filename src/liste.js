export const afficherTableau = () => {
    const tableBody = document.getElementById('liste-course-body');
    const localStorage = window.localStorage;
    let basket = JSON.parse(localStorage.getItem('basket')) || [];

    tableBody.innerHTML = '';
    basket.forEach((product) => {
        const tr = document.createElement('tr');
        const name = document.createElement('td');
        const quantity = document.createElement('td');
        const price = document.createElement('td');
        const totalPrice = document.createElement('td');
        const actions = document.createElement('td');
        const remove = document.createElement('button');
        const resetList = document.getElementById('vider-liste');

        tr.classList.add('border-b', 'border-gray-300');

        name.classList.add('p-2', 'text-center');
        quantity.classList.add('p-2', 'text-center');
        price.classList.add('p-2', 'text-center');
        totalPrice.classList.add('p-2', 'text-center');
        actions.classList.add('p-2', 'text-center');

        name.textContent = product.nom;
        quantity.innerHTML = `<input type="number" class="w-full text-center" value="${product.quantity}" />`;
        price.textContent = product.price;
        totalPrice.textContent = parseFloat(product.price * product.quantity).toFixed(2);
        remove.textContent = 'Supprimer';
        remove.classList.add('bg-red-500', 'text-white', 'p-2', 'rounded-lg', 'hover:bg-red-700', 'cursor-pointer');

        quantity.querySelector('input').addEventListener('change', (event) => {
            product.quantity = parseInt(event.target.value, 10);
            localStorage.setItem('basket', JSON.stringify(basket));
            afficherTotal();
            afficherTableau();
        });

        remove.addEventListener('click', () => {
            basket = basket.filter((p) => p.nom !== product.nom);
            localStorage.setItem('basket', JSON.stringify(basket));
            afficherTotal();
            afficherTableau();
        });

        resetList.addEventListener('click', () => {
            localStorage.removeItem('basket');
            afficherTotal();
            afficherTableau();
        });

        tr.appendChild(name);
        tr.appendChild(price);
        tr.appendChild(quantity);
        tr.appendChild(totalPrice);

        actions.appendChild(remove);
        tr.appendChild(actions);

        tableBody.appendChild(tr);
    });
};

export const afficherTotal = () => {
    const totalAmount = document.getElementById('total-general');
    const localStorage = window.localStorage;
    let basket = JSON.parse(localStorage.getItem('basket')) || [];

    const total = basket.reduce((acc, product) => acc + product.price * product.quantity, 0);
    totalAmount.textContent = parseFloat(total).toFixed(2);
};

document.addEventListener('DOMContentLoaded', () => {
    afficherTotal();
    afficherTableau();
});