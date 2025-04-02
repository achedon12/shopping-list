import {describe, expect, jest, test} from '@jest/globals';
import {fetchProducts, trier, rechercher, gererLocalStorage} from '../src/main.js';

describe('afficherProduits', () => {
    test('fetchProducts retourne un tableau de produits', async () => {
        const products = await fetchProducts();
        expect(Array.isArray(products)).toBe(true);
    });
    test('fetchProducts retourne un tableau de produits non vide', async () => {
        const products = await fetchProducts();
        expect(products.length).toBeGreaterThan(0);
    });
    test('fetchProducts retourne un tableau de produits avec des objets', async () => {
        const products = await fetchProducts();
        expect(products[0]).toEqual(expect.objectContaining({
            nom: expect.any(String),
            prix_unitaire: expect.any(Number),
            quantite_stock: expect.any(Number),
        }));
    });
    test('fetchProducts retourne un tableau de 98 produits', async () => {
        const products = await fetchProducts();
        expect(products.length).toBe(98);
    });
});

describe('Tri', () => {

    test('trie les produits par nom', () => {
        const products = [
            {nom: 'Produit 1'},
            {nom: 'Produit 3'},
            {nom: 'Produit 2'},
        ];
        const sortedProducts = trier(products, 'nom');
        expect(sortedProducts).toEqual([
            {nom: 'Produit 1'},
            {nom: 'Produit 2'},
            {nom: 'Produit 3'},
        ]);
    });

    test('trie les produits par prix', () => {
        const products = [
            {nom: 'Produit 1', prix_unitaire: 10},
            {nom: 'Produit 3', prix_unitaire: 30},
            {nom: 'Produit 2', prix_unitaire: 20},
        ];
        const sortedProducts = trier(products, 'prix');
        expect(sortedProducts).toEqual([
            {nom: 'Produit 1', prix_unitaire: 10},
            {nom: 'Produit 2', prix_unitaire: 20},
            {nom: 'Produit 3', prix_unitaire: 30},
        ]);
    });
});

describe('Recherche', () => {
    test('recherche des produits par nom', () => {
        const products = [
            {nom: 'Produit 1'},
            {nom: 'Produit 3'},
            {nom: 'Produit 2'},
        ];
        const filteredProducts = rechercher(products, 'Produit 1');
        expect(filteredProducts).toEqual([{nom: 'Produit 1'}]);
    });
});

describe('Ajout au localStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('ajoute un produit au localStorage', () => {
        const product = {nom: 'Produit 1', prix_unitaire: 10, quantite_stock: 5};
        gererLocalStorage(product);

        const basket = JSON.parse(localStorage.getItem('basket'));
        expect(basket).toHaveLength(1);
        expect(basket[0].nom).toBe('Produit 1');
        expect(basket[0].price).toBe(10);
        expect(basket[0].quantity).toBe(1);
    });

    test('met à jour la quantité du produit dans localStorage s\'il est déjà présent', () => {
        const product = {nom: 'Produit 1', prix_unitaire: 10, quantite_stock: 5};
        gererLocalStorage(product);
        gererLocalStorage(product);

        const basket = JSON.parse(localStorage.getItem('basket'));
        expect(basket).toHaveLength(1);
        expect(basket[0].nom).toBe('Produit 1');
        expect(basket[0].price).toBe(10);
        expect(basket[0].quantity).toBe(2);
    });
});
