document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('liste-course-body');
    const resetList = document.getElementById('vider-liste');
    const totalAmount = document.getElementById('total-general');
    const localStorage = window.localStorage;
    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    let total = 0;

    basket.forEach((product) => {
        const tr = document.createElement('tr');
        const name = document.createElement('td');
        const quantity = document.createElement('td');
        const price = document.createElement('td');
        const totalPrice = document.createElement('td');
        const remove = document.createElement('button');

        name.textContent = product.nom;
        quantity.innerHTML = `<input type="number" value="${product.quantity}" />`;
        price.textContent = product.price;
        totalPrice.textContent = parseFloat(product.price * product.quantity).toFixed(2);
        remove.textContent = 'Supprimer';

        quantity.addEventListener('change', (event) => {
            product.quantity = parseInt(event.target.value, 10);
            localStorage.setItem('basket', JSON.stringify(basket));
            totalPrice.textContent = parseFloat(product.price * product.quantity).toFixed(2);
            total = basket.reduce((acc, p) => parseFloat(acc + p.price * p.quantity).toFixed(2), 0);
            totalAmount.textContent = total;
        });

        remove.addEventListener('click', () => {
            const index = basket.findIndex((p) => p.nom === product.nom);
            basket.splice(index, 1);
            localStorage.setItem('basket', JSON.stringify(basket));
            tr.remove();
            total -= parseFloat(product.price * product.quantity).toFixed(2);
            totalAmount.textContent = total;
        });

        tr.appendChild(name);
        tr.appendChild(price);
        tr.appendChild(quantity);
        tr.appendChild(totalPrice);
        tr.appendChild(remove);

        tableBody.appendChild(tr);

        total +=  parseFloat(product.price * product.quantity).toFixed(2);
    });

    totalAmount.textContent = parseFloat(total).toFixed(2);

    resetList.addEventListener('click', () => {
        localStorage.removeItem('basket');
        tableBody.innerHTML = '';
        totalAmount.textContent = '0.00';
    });
});