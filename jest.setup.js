import { readFileSync } from 'fs';
import { join } from 'path';
import {jest} from "@jest/globals";

const productsData = JSON.parse(
    readFileSync(join(__dirname, '/public/liste_produits_quotidien.json'), 'utf8')
);

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        status: 200,
        json: async () => productsData,
    })
);
