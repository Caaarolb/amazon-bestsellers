import { scrapeProducts } from './src/scraper';

scrapeProducts()
  .then(categories => console.log(JSON.stringify(categories, null, 2)))
  .catch(err => console.error('Erro ao buscar produtos:', err));
