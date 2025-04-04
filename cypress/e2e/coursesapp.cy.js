describe('shoppingList index page tests', () => {
    beforeEach(() => {
        cy.visit('/index.html');
    })

    it('should load index.html', () => {
        cy.title().should('include', 'shoppingList');
        cy.document().should('exist');
    });

    it('should load products list', () => {
        cy.get('#liste-produits').should('exist').and('contain.html', 'li');
    });

    it('should load products count', () => {
        cy.get('#compteur-produits').should('exist').and('contain.text', ' produits');
    });

    it('should search products', () => {
        cy.get('#recherche').type('Lait');

        cy.get('#liste-produits li').then((titlesElement) => {
            expect(titlesElement.length).to.equal(3);
        });
    });

    it('should sort products by name', () => {
        cy.get('#tri').select('nom');

        cy.get('#liste-produits li h2 span', ).then((titlesElement) => {
            const titles = titlesElement.toArray().map(titleElement => titleElement.textContent);
            const sortedTitles = titles.sort((a, b) => a.localeCompare(b));

            expect(titles).to.deep.eq(sortedTitles);
        });
    });

    it('should sort products by price', () => {
        cy.get('#tri').select('prix');

        cy.get('#liste-produits > li').then((productCardElements) => {
            const prices = productCardElements.toArray().map(productCard => {
                const priceText = productCard.getElementsByTagName('span').item(2).textContent;
                return parseFloat(priceText.replace(':', '').replace('€', '').trim());
            });

            const sortedPrices = prices.sort((a, b) => a - b);

            expect(prices).to.deep.eq(sortedPrices);
        });
    });

    it('should reset filters', () => {
        cy.get('#recherche').type('Lait');
        cy.get('#tri').select('prix');

        cy.get('#reset-filtres').click();

        cy.get('#recherche').should('have.value', '');
        cy.get('#tri').should('have.value', null);
        cy.get('#liste-produits').children().should('have.length.greaterThan', 2);
    });

    it('should add a product to basket', () => {
        cy.clearAllLocalStorage();

        cy.get('[data-id=Pomme]').click();

        cy.window().then(win => {
            const basket = JSON.parse(win.localStorage.getItem('basket'));
            expect(basket).to.exist;

        });
    });

    it('should have a defined structure', () => {
        cy.clearAllLocalStorage();

        cy.get('[data-id=Pomme]').click();

        cy.window().then(win => {
            const basket = JSON.parse(win.localStorage.getItem('basket'));
            expect(basket[0]).to.have.property('nom', 'Pomme');
            expect(basket[0]).to.have.property('price', 12.74);
            expect(basket[0]).to.have.property('quantity', 1);
        });
    });

})

describe('shoppingList liste page tests', () => {
    beforeEach(() => {
        cy.clearAllLocalStorage();
        cy.visit('/index.html');
        cy.get('[data-id=Pomme]').click();
        cy.get('[data-id=Pomme]').click();
        cy.get('[data-id=Sel]').click();
        cy.get('[data-id=Carotte]').click();
        cy.visit('/liste.html');

    });

    it('should load index.html', () => {
        cy.document().should('exist');
    });

    it('should display selected products', () => {
        cy.get('#liste-course-body').children().should('have.length', 3);
    });

    it('should have total price amount', () => {
        cy.get('#total-general', ).invoke('text').should('match', /^\d+.\d{2}/);
    });

    it('should modify a products quantity', () => {
        cy.get('input[type="number"]').first().clear().type('1');
        cy.get('body').click();
        cy.get('input[type="number"]').first().should('have.value', 1);
        cy.get('#liste-course-body').children('tr').first().children('td').then(cells => {
            expect(cells[3].textContent).to.eq('12.74');
        });
    });

    it('should modify a products subtotal', () => {
        cy.get('input[type="number"]').first().clear().type('1');
        cy.get('body').click();
        cy.get('#liste-course-body').children('tr').first().children('td').then(cells => {
            expect(cells[3].textContent).to.eq('12.74');
        });
    });

    it('should modify total', () => {
        cy.get('input[type="number"]').first().clear().type('1');
        cy.get('body').click();
        cy.get('#total-general', ).should('contain.text', '29.28');
    });

    it('should delete a product from list', () => {
        cy.get('#liste-course-body').children('tr').first().children('td').last().children().click();
        cy.get('#liste-course-body').children('tr').should('have.length', '2');
    });

    it('should delete a product from storage', () => {
        cy.get('#liste-course-body').children('tr').first().children('td').last().children().click();
        cy.window().then(win => {
            const basket = JSON.parse(win.localStorage.getItem('basket'));
            expect(basket.length).to.be.eq(2);
        })
    });

    it('should delete all products', () => {
        cy.get('#vider-liste').click();
        cy.get('#liste-course-body').children().should('have.length', 0);
    });

    it('should delete have total of 0', () => {
        cy.get('#vider-liste').click();
        cy.get('#total-general').should('contain.text', '0');
    });
});