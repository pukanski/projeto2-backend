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
