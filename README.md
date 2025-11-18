# Requisitos

## Requisitos Funcionais (Usuário Autenticado)
| Código | Descrição |
| :--- | :--- |
| **RF-AUTH01** | Fazer Login: O usuário deve poder se autenticar no sistema (via JWT) para acessar as funcionalidades de gerenciamento. |
| **RF-AUTH02** | Rotas Protegidas: O acesso aos módulos de gerenciamento (Clientes, Quartos, Reservas) deve ser restrito a usuários autenticados. |
| **RF-CLI01** | Gerenciar Clientes: O usuário deve poder cadastrar, listar, editar e excluir os dados dos hóspedes (Clientes). |
| **RF-QTO01** | Gerenciar Quartos: O usuário deve poder cadastrar, listar, editar e excluir Quartos. |
| **RF-QTO02** | Detalhar Quartos: O gerenciamento de quartos deve incluir controle sobre o tipo do quarto, valor da diária e disponibilidade (ou status). |
| **RF-RES01** | Gerenciar Reservas: O usuário deve poder criar, listar, editar e excluir Reservas. |
| **RF-RES02** | Associar Reservas: Uma reserva deve obrigatoriamente associar um Cliente a um Quarto para um período específico. |
| **RF-SIS01** | Cálculo de Valor: O sistema deve calcular automaticamente o valor total da reserva com base no quarto selecionado e no período (datas). |

---

# Banco de dados

## Relacional
### Usuário
| Atributo | Tipo de Dado | Restrições / Observações |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Chave Primária, Auto-incremento |
| `nome` | `VARCHAR(255)` | Obrigatório |
| `email` | `VARCHAR(255)` | Obrigatório, Único (usado para login) |
| `senha_hash` | `VARCHAR(255)` | Obrigatório (armazenar hash com bcrypt) |

### Cliente
| Atributo | Tipo de Dado | Restrições / Observações |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Chave Primária, Auto-incremento |
| `nome_completo`| `VARCHAR(255)` | Obrigatório |
| `email` | `VARCHAR(255)` | Opcional, Único |
| `telefone` | `VARCHAR(50)` | Opcional |
| `cpf` | `VARCHAR(14)` | Opcional, Único |

### Quarto
| Atributo | Tipo de Dado | Restrições / Observações |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Chave Primária, Auto-incremento |
| `numero` | `VARCHAR(10)` | Obrigatório, Único (ex: "101A", "205") |
| `tipo` | `ENUM('Standard', 'Deluxe', 'Suíte')` | Obrigatório (ref. "tipo") |
| `preco_diaria` | `DECIMAL(10, 2)` | Obrigatório (ref. "valor da diária") |
| `status` | `ENUM('Disponível', 'Ocupado', 'Manutenção')` | Obrigatório (ref. "controle de disponibilidade") |

### Reserva
| Atributo | Tipo de Dado | Restrições / Observações |
| :--- | :--- | :--- |
| `id` | `INTEGER` | Chave Primária, Auto-incremento |
| `cliente_id` | `INTEGER` | Chave Estrangeira (`Cliente.id`) |
| `quarto_id` | `INTEGER` | Chave Estrangeira (`Quarto.id`) |
| `data_checkin` | `DATE` | Obrigatório (ref. "período", "datas") |
| `data_checkout` | `DATE` | Obrigatório (ref. "período", "datas") |
| `valor_total` | `DECIMAL(10, 2)` | Obrigatório (calculado pelo sistema) |
| `status_reserva`| `ENUM('Pendente', 'Confirmada', 'Cancelada')` | Obrigatório |

# Roteiro de Verificação

**Pré-requisitos:**

1. Rode `node seed.js` (para limpar e popular o banco).
2. Inicie o servidor `node app.js`.
3. Configure o `Bearer Token` no Insomnia (você vai obtê-lo na Fase 1).

### Fase 1: Autenticação (A Porta) (3 Testes)

- [x]  **1. `POST /login` (Sucesso 200)**
    - **Body:** `{ "email": "admin@hotel.com", "senha": "123" }`
    - **Verificar:** Recebe `200 OK` e um `token`.
    - **Ação:** Copie o token e configure-o como Bearer Token na Coleção.
- [x]  **2. `POST /login` (Falha 401 - Senha Errada)**
    - **Body:** `{ "email": "admin@hotel.com", "senha": "senhaerrada" }`
    - **Verificar:** Recebe `401 Unauthorized`.
- [x]  **3. `POST /login` (Falha 400 - Validação Manual)**
    - **Body:** `{}` (JSON Vazio)
    - **Verificar:** Recebe `400 Bad Request` ("Email e senha são obrigatórios.").

### Fase 1.5: Recuperação de Senha (Novos - Opcional/Simulado)

- [x]  **1b. `POST /esqueciSenha` (Sucesso)**
    - **Body:** `{ "email": "admin@hotel.com" }`
    - **Verificar:** Recebe `200 OK`.
    - **Ação:** **OLHE O TERMINAL/CONSOLE DO SEU BACKEND**. Copie o token.
- [x]  **1c. `POST /resetarSenha` (Falha - Token Inválido)**
    - **Body:** `{ "token": "token-falso-123", "novaSenha": "novasenha123" }`
    - **Verificar:** Recebe `400 Bad Request`.
- [x]  **1d. `POST /resetarSenha` (Sucesso)**
    - **Body:** `{ "token": "COLE_O_TOKEN_DO_CONSOLE_AQUI", "novaSenha": "novasenha123" }`
    - **Verificar:** Recebe `200 OK` ("Senha alterada com sucesso").
- [x]  **1e. `POST /login` (Teste da Nova Senha)**
    - **Body:** `{ "email": "admin@hotel.com", "senha": "novasenha123" }`
    - **Verificar:** Recebe `200 OK` e um novo token JWT.

### Fase 2: Proteção (A Tranca) (2 Testes)

- [x]  **4. `GET /quartos` (Falha 401 - Sem Token)**
    - **Ação:** Desabilite o Bearer Token.
    - **Verificar:** Recebe `401 Unauthorized`.
    - **Ação:** Reabilite o Bearer Token.
- [x]  **5. `GET /quartos` (Sucesso 200 - Com Token)**
    - **Verificar:** Recebe `200 OK` e o JSON array com os 3 quartos do *seed*.

### Fase 3: Módulo Clientes (CRUD + Validação) (12 Testes)

- [x]  **6. `POST /clientes` (Falha 400 - Validação Vazia)**
    - **Body:** `{}`
    - **Verificar:** Recebe `400 Bad Request` com a lista de erros.
- [x]  **7. `POST /clientes` (Falha 400 - Validação Inválida)**
    - **Body:** `{ "nome": "ab", "email": "nao-e-um-email", "cpf": "123" }`
    - **Verificar:** Recebe `400 Bad Request`.
- [x]  **8. `POST /clientes` (Falha 409 - Conflito de CPF)**
    - **Body:** `{ "nome": "Outra Ana", "email": "outro@email.com", "cpf": "111.111.111-11" }` (CPF do *seed*).
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **9. `POST /clientes` (Sucesso 201)**
    - **Body:** `{ "nome": "Cliente Teste", "email": "teste@valido.com", "cpf": "999.999.999-99" }`
    - **Verificar:** Recebe `201 Created`. (Guarde o ID, ex: 3).
- [x]  **10. `GET /clientes/999` (Falha 404 - Não Encontrado)**
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **11. `PUT /clientes/999` (Falha 404 - Não Encontrado)**
    - **Body:** `{ "nome": "Fantasma", "email": "fantasma@teste.com", "cpf": "000.000.000-00" }`
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **12. `PUT /clientes/1` (Falha 400 - Validação Inválida)**
    - **Body:** `{ "nome": "OK", "email": "email-invalido", "cpf": "123" }`
    - **Verificar:** Recebe `400 Bad Request`.
- [x]  **13. `PUT /clientes/1` (Falha 409 - Conflito de CPF)**
    - **Body:** `{ "nome": "Ana Silva", "email": "ana.silva@teste.com", "cpf": "222.222.222-22" }` (CPF do *seed*).
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **14. `PUT /clientes/1` (Sucesso 200)**
    - **Body:** `{ "nome": "Ana Silva ATUALIZADA", "email": "ana.silva@teste.com", "cpf": "111.111.111-11" }`
    - **Verificar:** Recebe `200 OK`.
- [x]  **15. `DELETE /clientes/999` (Falha 404 - Não Encontrado)**
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **16. `DELETE /clientes/1` (Falha 409 - FK Restrict)**
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **17. `DELETE /clientes/3` (Sucesso 204 - Cliente Sem Reservas)**
    - **Ação:** Delete o "Cliente Teste" criado no passo 9 (ID 3).
    - **Verificar:** Recebe `204 No Content`.

### Fase 4: Módulo Quartos (CRUD + Validação) (10 Testes)

- [x]  **18. `POST /quartos` (Falha 400 - Validação Vazia)**
    - **Body:** `{}`
    - **Verificar:** Recebe `400 Bad Request`.
- [x]  **19. `POST /quartos` (Falha 400 - Validação Inválida)**
    - **Body:** `{ "numero": "505", "tipo": "Suite Presidencial", "preco_diaria": "-100", "status": "Livre" }`
    - **Verificar:** Recebe `400 Bad Request`.
- [x]  **20. `POST /quartos` (Falha 409 - Conflito de Número)**
    - **Body:** `{ "numero": "101", "tipo": "Standard", "preco_diaria": "150", "status": "Disponivel" }` (Número do *seed*).
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **21. `POST /quartos` (Sucesso 201)**
    - **Body:** `{ "numero": "102", "tipo": "Standard", "preco_diaria": "150", "status": "Disponivel" }`
    - **Verificar:** Recebe `201 Created`. (Guarde o ID, ex: 4).
- [x]  **22. `GET /quartos/999` (Falha 404 - Não Encontrado)**
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **23. `PUT /quartos/999` (Falha 404 - Não Encontrado)**
    - **Body:** `{ "numero": "999", "tipo": "Standard", "preco_diaria": "100", "status": "Disponivel" }`
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **24. `PUT /quartos/1` (Sucesso 200)**
    - **Body:** `{ "numero": "101", "tipo": "Standard", "preco_diaria": "999.99", "status": "Manutencao" }`
    - **Verificar:** Recebe `200 OK`.
- [x]  **25. `DELETE /quartos/999` (Falha 404 - Não Encontrado)**
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **26. `DELETE /quartos/1` (Falha 409 - FK Restrict)**
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **27. `DELETE /quartos/4` (Sucesso 204 - Quarto Sem Reservas)**
    - **Ação:** Delete o Quarto "102" criado no passo 21 (ID 4).
    - **Verificar:** Recebe `204 No Content`.

### Fase 5: Módulo Reservas (Lógica + Validação) (16 Testes)

- [x]  **28. `POST /reservas` (Falha 400 - Validação de Tipo)**
    - **Body:** `{ "cliente_id": "a", "quarto_id": "b", "data_checkin": "ontem", "data_checkout": "amanha" }`
    - **Verificar:** Recebe `400 Bad Request`.
- [x]  **29. `POST /reservas` (Falha 400 - Lógica de Data)**
    - **Body:** `{ "cliente_id": 1, "quarto_id": 2, "data_checkin": "2025-12-10T14:00:00Z", "data_checkout": "2025-12-09T12:00:00Z" }`
    - **Verificar:** Recebe `400 Bad Request` ("Data de checkout deve ser posterior...").
- [x]  **30. `POST /reservas` (Falha 400 - Bug de Reserva no Passado)**
    - **Body:** `{ "cliente_id": 1, "quarto_id": 1, "data_checkin": "2024-11-20T14:00:00Z", "data_checkout": "2024-11-22T12:00:00Z" }`
    - **Verificar:** Recebe `400 Bad Request` ("Não é possível criar reservas para datas passadas.").
- [x]  **31. `POST /reservas` (Falha 400/404 - Lógica de FK)**
    - **Body:** `{ "cliente_id": 1, "quarto_id": 999, "data_checkin": "2025-12-10T14:00:00Z", "data_checkout": "2025-12-12T12:00:00Z" }`
    - **Verificar:** Recebe `400` ou `404` ("Quarto não encontrado").
- [x]  **32. `POST /reservas` (Falha 409 - Bug de Overbooking)**
    - **Contexto:** O Quarto 303 (do *seed*) tem `status: 'Manutencao'`.
    - **Body:** `{ "cliente_id": 1, "quarto_id": 3, "data_checkin": "2025-12-01T14:00:00Z", "data_checkout": "2025-12-05T12:00:00Z" }`
    - **Verificar:** Recebe `409 Conflict` ("Conflito: Quarto não está disponível").
- [x]  **33. `POST /reservas` (Falha 409 - Bug de Double-Booking)**
    - **Contexto:** A Reserva 1 (do *seed*) existe para o Quarto 1 (20-Nov a 22-Nov).
    - **Body:** `{ "cliente_id": 2, "quarto_id": 1, "data_checkin": "2025-11-21T14:00:00Z", "data_checkout": "2025-11-23T12:00:00Z" }`
    - **Verificar:** Recebe `409 Conflict` ("Conflito: O quarto já está reservado...").
- [x]  **34. `POST /reservas` (Sucesso 201 - TESTE RF-SIS01)**
    - **Body:** `{ "cliente_id": 2, "quarto_id": 2, "data_checkin": "2025-12-01T14:00:00Z", "data_checkout": "2025-12-05T12:00:00Z" }`
    - **Contexto:** Quarto 2 (Deluxe) custa `R$ 250.50` (do *seed*). São 4 dias.
    - **Verificar:** Recebe `201 Created` E o JSON mostra `"valor_total": "1002.00"`.
- [x]  **35. `GET /reservas/999` (Falha 404 - Não Encontrado)**
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **36. `PUT /reservas/999` (Falha 404 - Não Encontrado)**
    - **Body:** `{ "cliente_id": 1, "quarto_id": 1, "data_checkin": "2025-12-01T14:00:00Z", "data_checkout": "2025-12-05T12:00:00Z", "status": "Cancelada" }` (Dados válidos, ID inválido)
    - **Verificar:** Recebe `404 Not Found`.
- [x]  **37. `PUT /reservas/1` (Falha 400 - Lógica de Data)**
    - **Body:** `{ "data_checkin": "2025-11-25T14:00:00Z", "data_checkout": "2025-11-24T12:00:00Z" }`
    - **Verificar:** Recebe `400 Bad Request` (msg: "Data de checkout deve ser posterior...").
- [x]  **38. `PUT /reservas/1` (Falha 400 - Bug de Update para o Passado)**
    - **Body:** `{ "data_checkin": "2024-11-20T14:00:00Z", "data_checkout": "2024-11-22T12:00:00Z" }`
    - **Verificar:** Recebe `400 Bad Request` ("Não é possível mover reservas para datas passadas.").
- [x]  **39. `PUT /reservas/1` (Falha 409 - Bug de Overbooking no Update)**
    - **Contexto:** Mover a Reserva 1 para o Quarto 3 (Manutenção).
    - **Body:** `{ "quarto_id": 3 }`
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **40. `PUT /reservas/2` (Falha 409 - Bug de Double-Booking no Update)**
    - **Contexto:** Mover a Reserva 2 para conflitar com a Reserva 1.
    - **Body:** `{ "quarto_id": 1, "data_checkin": "2025-11-21T14:00:00Z", "data_checkout": "2025-11-23T12:00:00Z" }`
    - **Verificar:** Recebe `409 Conflict`.
- [x]  **41. `PUT /reservas/1` (Sucesso 200 - TESTE RF-SIS01 RECALC)**
    - **Ação:** Mude a Reserva 1 para o Quarto 2.
    - **Body:** `{ "quarto_id": 2 }`
    - **Verificar:** Recebe `200 OK` E o JSON mostra `"valor_total": "501.00"`.
- [x]  **42. `GET /reservas` (Sucesso 200 - Teste de JOIN)**
    - **Verificar:** Recebe `200 OK` E o JSON contém os objetos `cliente` e `quarto` aninhados.
- [x]  **43. `DELETE /reservas/1` (Sucesso 204)**
    - **Verificar:** Recebe `204 No Content`.
