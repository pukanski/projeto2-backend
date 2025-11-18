const express = require('express');
const app = express();
const port = 8081; 

const sequelize = require('./config/configSequelize');


try {
  sequelize.authenticate();
  console.log('Conexão com o bd estabelecida com sucesso.');
} catch (error) {
  console.error('Não foi possível conectar ao banco de dados:', error);
  process.exit(1);
}

app.use(express.json());

// rotas

app.listen(port, () => {
  console.log(`Servidor no http://localhost:${port}`);
});