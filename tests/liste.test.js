import {beforeEach, describe, expect, test} from '@jest/globals';
import {afficherTableau, afficherTotal} from '../src/liste.js';

describe('affichage du tableau', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="w-full flex flex-col items-center justify-center">
        <header class="w-full flex flex-row justify-between items-center p-4 text-base-content">
            <h1 class="text-2xl">📝 Produits disponibles</h1>
        </header>
        <table class="w-[80%]">
            <thead class="bg-base-300 text-base-content">
            <tr class="text-center">
                <th class="p-2">Produit</th>
                <th class="p-2">PU (€)</th>
                <th class="p-2">Quantité</th>
                <th class="p-2">Sous-total</th>
                <th class="p-2">Action</th>
            </tr>
            </thead>
            <tbody id="liste-course-body">
            </tbody>
        </table>
        <footer class="mt-3 w-[80%] flex flex-row justify-between items-center p-4 text-base-content">
            <p class="text-2xl">💰 Total : <span id="total-general">0</span> €</p>
            <button id="vider-liste" class="hover:cursor-pointer p-2 rounded-lg uppercase bg-white border-2 border-red-700 text-red-700">Vider la liste</button>
        </footer>
    </div>
        `;
        localStorage.clear();
    });

    test('nombre de lignes correspond au contenu du localStorage', () => {
        localStorage.setItem('basket', JSON.stringify([{nom: 'Produit 1', price: 10, quantity: 1}, {nom: 'Produit 2', price: 20, quantity: 2}]));
        afficherTableau();
        const rows = document.querySelectorAll('#liste-course-body tr');
        expect(rows.length).toBe(2);
    });

    test('total affiché est correct en fonction des quantités × prix', () => {
        localStorage.setItem('basket', JSON.stringify([{nom: 'Produit 1', price: 10, quantity: 1}, {nom: 'Produit 2', price: 20, quantity: 2}]));
        afficherTotal();
        const total = document.getElementById('total-general').textContent;
        expect(total).toBe('50.00');
    });

    test('le champ <input> modifie bien la valeur en localStorage', () => {
        localStorage.setItem('basket', JSON.stringify([{nom: 'Produit 1', price: 10, quantity: 1}]));
        afficherTableau();
        const input = document.querySelector('#liste-course-body input');
        input.value = 3;
        input.dispatchEvent(new Event('change'));
        const basket = JSON.parse(localStorage.getItem('basket'));
        expect(basket[0].quantity).toBe(3);
    });

    test('un clic sur "Supprimer" retire le produit du tableau ET du localStorage', () => {
        localStorage.setItem('basket', JSON.stringify([{nom: 'Produit 1', price: 10, quantity: 1}]));
        afficherTableau();
        const button = document.querySelector('#liste-course-body button');
        button.click();
        const rows = document.querySelectorAll('#liste-course-body tr');
        expect(rows.length).toBe(0);
        const basket = JSON.parse(localStorage.getItem('basket'));
        expect(basket.length).toBe(0);
    });

    test('bouton "Vider la liste" supprime tous les éléments et remet total à zéro', () => {
        localStorage.setItem('basket', JSON.stringify([{nom: 'Produit 1', price: 10, quantity: 1}, {nom: 'Produit 2', price: 20, quantity: 2}]));
        afficherTableau();
        const button = document.getElementById('vider-liste');
        button.click();
        const rows = document.querySelectorAll('#liste-course-body tr');
        expect(rows.length).toBe(0);
        const total = document.getElementById('total-general').textContent;
        expect(total).toBe('0.00');
        const basket = JSON.parse(localStorage.getItem('basket'));
        expect(basket).toBeNull();
    });
});