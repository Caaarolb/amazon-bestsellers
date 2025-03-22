import * as AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// GET /produtos - Lista todos os produtos
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

// GET /produtos/{id} - Busca um produto específico
export const getById: AWSLambda.APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters || {};

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ message: "ID é obrigatório" }) };
  }

  const params = {
    TableName: 'Produtos',
    Key: { id }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return { statusCode: 404, body: JSON.stringify({ message: "Produto não encontrado" }) };
    }
    return { statusCode: 200, body: JSON.stringify(result.Item) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Erro ao buscar produto", error }) };
  }
};

// POST /produtos - Adiciona um novo produto
export const post: AWSLambda.APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'O corpo da requisição não pode ser vazio' }),
    };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
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

// PUT /produtos/{id} - Atualiza um produto
export const update: AWSLambda.APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters || {};
  if (!id || !event.body) {
    return { statusCode: 400, body: JSON.stringify({ message: "ID e corpo da requisição são obrigatórios" }) };
  }

  let requestBody;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ message: "Erro ao processar o corpo da requisição", error }) };
  }

  const params = {
    TableName: 'Produtos',
    Key: { id },
    UpdateExpression: "set products = :products",
    ExpressionAttributeValues: { ":products": requestBody.products },
    ReturnValues: "UPDATED_NEW"
  };

  try {
    await dynamoDb.update(params).promise();
    return { statusCode: 200, body: JSON.stringify({ message: "Produto atualizado com sucesso!" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: "Erro ao atualizar produto", error }) };
  }
};

// DELETE /produtos/{id} - Remove um produto
export const deleteProduto: AWSLambda.APIGatewayProxyHandler = async (event) => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "ID do produto é obrigatório" }),
    };
  }

  const productId = event.pathParameters.id;

  const params = {
    TableName: "Produtos",
    Key: { id: productId },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Produto deletado com sucesso!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erro ao deletar produto", error }),
    };
  }
};