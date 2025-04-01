import liste from '../public/liste_produits_quotidien.json';

document.addEventListener('DOMContentLoaded', () => {
    const compteurProduits = document.getElementById('compteur-produits');
    const listeProduits = document.getElementById('liste-produits');
    const tri = document.getElementById('tri');
    const resetFiltres = document.getElementById('reset-filtres');
    const recherche = document.getElementById('recherche');
    const localStorage = window.localStorage;

    const products = liste;

    products.forEach((product) => {
        createProduct(product);
    });

    resetFiltres.addEventListener('click', () => {
        tri.value = '';
        recherche.value = '';
    });

    tri.addEventListener('change', (event) => {
        const value = event.target.value;
        let produits = liste;

        // tri par prix croissant
        if (value === 'prix') {
            produits = produits.sort((a, b) => a.prix_unitaire - b.prix_unitaire);
        }

        // tri par nom
        if (value === 'nom') {
            produits = produits.sort((a, b) => a.nom.localeCompare(b.nom));
        }

        listeProduits.innerHTML = '';

        produits.forEach((product) => {
            createProduct(product);
        });
    });

    recherche.addEventListener('input', (event) => {
        const elements = listeProduits.querySelectorAll('li');
        const value = event.target.value.toLowerCase();

        elements.forEach((element) => {
            const title = element.querySelector('h2').textContent.toLowerCase();
            if (title.includes(value)) {
                element.style.display = 'inherit';
            } else {
                element.style.display = 'none';
            }
        });
    });

    compteurProduits.textContent = liste.length + ' produits';

    function createProduct(produit) {
        const li = document.createElement('li');
        li.classList.add('bg-white', 'p-2', 'flex', 'flex-col', 'gap-2', 'border', 'border-gray-300', 'rounded-lg', 'w-1/5');
        const title = document.createElement('h2');
        title.classList.add('text-lg', 'font-bold', 'text-center');
        const quantity = document.createElement('span');
        const price = document.createElement('span');
        const addToBasket = document.createElement('button');

        addToBasket.addEventListener('click', () => {
            const basket = JSON.parse(localStorage.getItem('basket')) || [];
            const product = basket.find((p) => p.nom === produit.nom);
            if (!product) {
                basket.push({
                    nom: produit.nom,
                    price: produit.prix_unitaire,
                    quantity: 1,
                });
            } else {
                product.quantity += 1;
            }
            localStorage.setItem('basket', JSON.stringify(basket));
        });

        addToBasket.textContent = 'Ajouter au panier';
        addToBasket.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'duration-300', 'hover:cursor-pointer');
        addToBasket.dataset.id = produit.nom;

        title.innerHTML = `<span class="font-bold">${produit.nom}</span>`;
        quantity.innerHTML = `<span class="font-bold">Quantité en stock</span>: ${produit.quantite_stock}`;
        price.innerHTML = `<span class="font-bold">Prix unitaire</span>: ${produit.prix_unitaire} €`;

        li.appendChild(title);
        li.appendChild(quantity);
        li.appendChild(price);
        li.appendChild(addToBasket);

        listeProduits.appendChild(li);
    }
});

