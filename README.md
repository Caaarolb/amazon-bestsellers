# 📦 Web Scraping de Best-Sellers da Amazon com AWS

Este projeto realiza **Web Scraping** dos produtos mais vendidos da **Amazon Brasil** e armazena os dados no **AWS DynamoDB**. Os dados são disponibilizados via **API Serverless** usando **AWS Lambda** e **API Gateway**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Puppeteer** para Web Scraping
- **AWS DynamoDB** para armazenamento
- **AWS Lambda** e **API Gateway** para a API
- **Serverless Framework** para implantação

---

## 📌 Funcionalidades

✔️ Coleta os **3 produtos mais vendidos** de cada categoria na Amazon  
✔️ Armazena os dados no **DynamoDB** com IDs sequenciais  
✔️ Disponibiliza uma **API REST** para acesso aos produtos  
✔️ Implementação usando **arquitetura Serverless**  

---

## 📂 Estrutura do Projeto

    📁 amazon-bestsellers
    │── 📂 src
    │   ├── 📜 scraper.ts         # Código de Web Scraping com Puppeteer
    │   ├── 📜 handler.ts         # Funções da API (CRUD no DynamoDB)
    │── 📜 serverless.yml         # Configuração do Serverless Framework
    │  ── 📜 package.json           # Dependências do projeto
    │── 📜 tsconfig.json          # Configuração do TypeScript
    │── 📜 README.md              # Documentação do projeto


---

## 🛠 Como Executar o Projeto

### 1️⃣ **Clonar o repositório**
```bash
git clone https://github.com/Caaarolb/amazon-bestsellers
cd amazon-bestsellers
```
2️⃣ Instalar as dependências
```
npm install
```

3️⃣ Executar o Web Scraper
```
ts-node src/scraper.ts
```
4️⃣ Deploy para AWS Lambda
```
serverless deploy
```
🔗 Endpoints da API

Após o deploy, a API estará disponível no API Gateway.

Listar produtos (GET)
```
GET https://seu-endpoint.amazonaws.com/dev/produtos
```
Cadastrar produtos manualmente (POST)
```
POST https://seu-endpoint.amazonaws.com/dev/produtos
Content-Type: application/json

{
  "categoria": "Eletrônicos",
  "produtos": [
    {
      "idproduto": 1,
      "titulo": "Fone de Ouvido Bluetooth",
      "preco": "R$ 199,90",
      "imagem": "https://link-da-imagem.jpg"
    }
  ]
}
```
⚡ Exemplo de Retorno da API
```
[
  {
    "categoria": "Livros",
    "idcategoria": 1,
    "produtos": [
      {
        "idproduto": 1,
        "titulo": "O Poder do Hábito",
        "preco": "R$ 34,90",
        "imagem": "https://link-da-imagem.jpg"
      }
    ]
  }
]
```

📝 Observações
O ID da categoria é gerado automaticamente no backend.

O ID dos produtos inicia em 1 e aumenta de forma sequencial.

O projeto segue as boas práticas de arquitetura Serverless.

## 👨‍💻 Autor

Jeisa Boaventura <br>
[LinkedIn](https://www.linkedin.com/in/-caroline-boaventura/)
[GitHub](https://github.com/Caaarolb)

💼 Desenvolvedora Full-Stack Jr | Node.js | AWS | TypeScript

Se gostou do projeto, deixe uma ⭐ no repositório! 🚀🔥


## Licença
Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.
