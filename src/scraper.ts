import puppeteer from 'puppeteer';
import axios from 'axios';


interface Product {
  title: string;
  price: string;
  image: string;
}

interface CategoryProducts {
  category: string;
  products: Product[];
}

export async function scrapeProducts(): Promise<CategoryProducts[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // página de bestsellers da Amazon
  await page.goto('https://www.amazon.com.br/bestsellers', { waitUntil: 'domcontentloaded' });

  // Aguarda o carregamento dos contêineres das categorias
  await page.waitForSelector('[id^="CardInstance"]', { timeout: 120000 });

  // Extrai os produtos por categoria
  const productsByCategory = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[id^="CardInstance"]')).map(container => {
      const categoryNameElement = container.querySelector('.a-carousel-heading');
      const categoryName = categoryNameElement instanceof HTMLElement
        ? categoryNameElement.innerText.trim()
        : 'Categoria Desconhecida';

      const products = Array.from(container.querySelectorAll('.zg-carousel-general-faceout'))
        .slice(0, 3) 
        .map(item => {
          const titleElement = item.querySelector('.p13n-sc-truncate-desktop-type2');
          const priceElement = item.querySelector('span._cDEzb_p13n-sc-price_3mJ9Z');
          const imageElement = item.querySelector('img.a-dynamic-image.p13n-sc-dynamic-image.p13n-product-image');

          return {
            title: titleElement instanceof HTMLElement ? titleElement.innerText.trim() : 'Sem titulo',
            price: priceElement instanceof HTMLElement ? priceElement.innerText.trim() : 'Preço indisponivel',
            image: imageElement instanceof HTMLImageElement ? imageElement.src : 'Sem imagem',
          };
        });

      return products.length > 0 ? { category: categoryName, products } : null;
    }).filter(Boolean) as CategoryProducts[];
  });

  await browser.close();

  // envia os produtos coletados para a API
  /* try {
    const response = await axios.post('https://dbqle43khh.execute-api.us-east-1.amazonaws.com/dev/produtos', {
      id: new Date().toISOString(),
      products: productsByCategory,
    });

    console.log('Produtos enviados para o DynamoDB com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao enviar produtos para o DynamoDB:', error);
  }
*/
  return productsByCategory;
}

// Executa o scraper
scrapeProducts()
  .then(categories => console.log(JSON.stringify(categories, null, 2)))
  .catch(err => console.error('Erro ao buscar produtos:', err));
