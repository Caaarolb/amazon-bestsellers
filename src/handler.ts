import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Função para o método GET
export const get: AWSLambda.APIGatewayProxyHandler = async () => {
  const params = {
    TableName: 'Produtos',
  };

  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao recuperar produtos', error }),
    };
  }
};

// Função para o método POST
export const post: AWSLambda.APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'O corpo da requisição não pode ser vazio' }),
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body); // Tenta fazer o parse do corpo da requisição
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Erro ao processar o corpo da requisição', error }),
    };
  }

  const { id, products } = requestBody;

  const params = {
    TableName: 'Produtos',
    Item: {
      id: id || new Date().toISOString(),
      products: products,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Produto adicionado com sucesso!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao adicionar produto', error }),
    };
  }
};