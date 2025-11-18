const express = require('express');
const cors = require('cors');
const app = express();
const port = 8081; 
const db = require('./models');

app.use(cors());
app.use(express.json());

// routes
app.use('/auth', auth, require('./routes/routeAuth'));
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