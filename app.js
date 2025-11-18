const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const port = 8081; 
const db = require('./models');
const auth = require('./middleware/auth');

app.use(cors());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// routes
app.use('/', require('./routes/routeAuth'));
app.use('/clientes', auth, require('./routes/routeCliente'));
app.use('/quartos', auth, require('./routes/routeQuarto'));
app.use('/reservas', auth, require('./routes/routeReserva'));

db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o bd estabelecida com sucesso.');
    
    db.sequelize.sync(); 
    
    app.listen(port, () => {
      console.log(`Servidor no http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });