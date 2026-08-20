# LionStock

LionStock é uma API backend para um sistema de gerenciamento de inventário projetado para pequenos negócios. Este projeto fornece uma base sólida e bem organizada para que equipes de desenvolvimento implementem suas funcionalidades de forma escalável e colaborativa.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de requisições entre domínios
- **Nodemon** - Ferramenta de desenvolvimento para restart automático

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- MongoDB Atlas (ou MongoDB local)

## 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/LionStock.git
   cd LionStock/backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster.mongodb.net/database
   JWT_SECRET=sua_chave_secreta
   JWT_EXPIRES_IN=24h
   ```

## ▶️ Executando o Projeto

### Modo Desenvolvimento
```bash
npm run dev
```
A API estará disponível em `http://localhost:3000`

### Modo Produção
```bash
npm start
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (banco de dados, etc)
│   ├── controllers/      # Controllers (lógica de requisição/resposta)
│   ├── middlewares/      # Middlewares customizados
│   ├── models/           # Modelos de dados (Mongoose schemas)
│   ├── routes/           # Definição de rotas
│   ├── services/         # Lógica de negócio
│   ├── utils/            # Funções utilitárias
│   ├── validators/       # Validadores de dados
│   ├── constants/        # Constantes da aplicação
│   └── app.js            # Configuração da aplicação Express
│
├── server.js             # Arquivo de entrada do servidor
├── package.json          # Dependências do projeto
├── .env                  # Variáveis de ambiente (local)
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore            # Arquivos ignorados pelo Git
└── README.md             # Este arquivo

```

## 🔗 Endpoints Disponíveis

### Status da API

**GET** `/`
```json
{
  "success": true,
  "message": "LionStock API",
  "data": {
    "project": "LionStock API",
    "status": "running"
  }
}
```

**GET** `/health`
```json
{
  "success": true,
  "message": "API funcionando corretamente.",
  "data": {
    "timestamp": "2026-01-20T10:30:00.000Z"
  }
}
```

## 📋 Padrão de Respostas

### Sucesso
```json
{
  "success": true,
  "message": "Descrição da ação",
  "data": {}
}
```

### Erro
```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": ["Detalhes do erro"]
}
```

## 👥 Integrantes

Este projeto foi estruturado para permitir que múltiplos desenvolvedores trabalhem simultaneamente em diferentes módulos mantendo a coesão da arquitetura.

- **Arquiteto de Software** - Estruturação e padrão do projeto

## 📝 Convenções de Código

### Nomenclatura de Arquivos
- Controllers: `resource.controller.js` (ex: user.controller.js)
- Services: `resource.service.js` (ex: user.service.js)
- Models: `resource.model.js` (ex: user.model.js)
- Middlewares: `middleware-name.middleware.js` (ex: auth.middleware.js)
- Validators: `resource.validator.js` (ex: user.validator.js)

### Estrutura de Controllers
```javascript
const method = async (req, res) => {
  try {
    // Validar entrada
    // Chamar service
    // Retornar resposta
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro na operação',
      errors: [error.message],
    });
  }
};
```

## 🚀 Próximos Passos

1. Implementar autenticação JWT
2. Criar modelos de dados específicos do negócio
3. Implementar CRUD para cada entidade
4. Adicionar validações robustas
5. Criar testes automatizados

## 📜 Licença

MIT

## 💡 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

