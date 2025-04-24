let listeProduits;
let compteurProduits;
let tri;
let resetFiltres;
let recherche;
let products;

document.addEventListener('DOMContentLoaded', async () => {
    initDOMElements(document);
    products = await fetchProducts();
    afficherProduits(products);
    ajouterEcouteurs();
});

export const fetchProducts = async () => {
    try {
        const response = await fetch('/liste_produits_quotidien.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export function initDOMElements(doc) {
    listeProduits = doc.getElementById('liste-produits');
    compteurProduits = doc.getElementById('compteur-produits');
    tri = doc.getElementById('tri');
    resetFiltres = doc.getElementById('reset-filtres');
    recherche = doc.getElementById('recherche');
}

export function afficherProduits(produits) {
    listeProduits.innerHTML = '';
    produits.forEach((product) => {
        createProduct(product);
    });
    compteurProduits.textContent = `${produits.length} produits`;
}

export function ajouterEcouteurs() {
    resetFiltres.addEventListener('click', () => {
        tri.value = '';
        recherche.value = '';
        afficherProduits(products);
    });

    tri.addEventListener('change', (event) => {
        const value = event.target.value;
        const produitsTries = trier(products, value);
        afficherProduits(produitsTries);
    });

    recherche.addEventListener('input', (event) => {
        const value = event.target.value.toLowerCase();
        const produitsFiltres = rechercher(products, value);
        afficherProduits(produitsFiltres);
    });
}

export function trier(produits, critere) {
    if (critere === 'prix') {
        return produits.sort((a, b) => a.prix_unitaire - b.prix_unitaire);
    }
    if (critere === 'nom') {
        return produits.sort((a, b) => a.nom.localeCompare(b.nom));
    }
    return produits;
}

export function rechercher(produits, valeur) {
    return produits.filter((produit) => produit.nom.toLowerCase().includes(valeur.toLowerCase()));
}

export function gererLocalStorage(produit) {
    const localStorage = window.localStorage;
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
    return basket;
}

function createProduct(produit) {
    const li = document.createElement('li');
    li.classList.add('bg-white', 'p-2', 'flex', 'flex-col', 'gap-2', 'border', 'border-gray-300', 'rounded-lg', 'w-full', 'md:w-1/5', 'h-52', 'justify-between');
    const title = document.createElement('h2');
    title.classList.add('text-lg', 'font-bold', 'text-center');
    const quantity = document.createElement('span');
    const price = document.createElement('span');
    const addToBasket = document.createElement('button');

    addToBasket.addEventListener('click', () => {
        const basket = gererLocalStorage(produit);
        const product = basket.find((p) => p.nom === produit.nom);
        let quantityStock = produit.quantite_stock - product.quantity;
        quantity.innerHTML = `<span class="font-bold">Quantité en stock</span>: ${quantityStock}`;
        if (quantityStock <= 0) {
            addToBasket.disabled = true;
            addToBasket.classList.remove('bg-blue-500', 'hover:bg-blue-700');
            addToBasket.classList.add('bg-gray-500');
            li.classList.add('opacity-50');
        }
    });

    addToBasket.textContent = 'Ajouter au panier';
    addToBasket.classList.add('bg-blue-500', 'text-white', 'p-2', 'rounded-lg', 'hover:bg-blue-700', 'transition-colors', 'duration-300', 'hover:cursor-pointer');
    addToBasket.dataset.id = produit.nom;

    title.innerHTML = `<span class="font-bold">${produit.nom}</span>`;

    const basket = JSON.parse(localStorage.getItem('basket')) || [];
    let quantityStock = produit.quantite_stock;
    const product = basket.find((p) => p.nom === produit.nom);
    quantityStock -= product ? product.quantity : 0;

    if (quantityStock <= 0) {
        addToBasket.disabled = true;
        addToBasket.classList.remove('bg-blue-500', 'hover:bg-blue-700', 'hover:cursor-pointer');
        addToBasket.classList.add('bg-gray-500');
        li.classList.add('opacity-50');
    }

    quantity.innerHTML = `<span class="font-bold">Quantité en stock</span>: ${quantityStock}`;
    price.innerHTML = `<span class="font-bold">Prix unitaire</span>: ${produit.prix_unitaire} €`;

    li.appendChild(title);
    li.appendChild(quantity);
    li.appendChild(price);
    li.appendChild(addToBasket);

    listeProduits.appendChild(li);
}