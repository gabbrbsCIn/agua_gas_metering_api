# Água/Gás Metering API

API para verificar medidor de água e/ou gás desenvolvida em Node.js com TypeScript, integrada com a GEMINI IA Vision API.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração

1. Clone o repositório:

```bash
git clone https://github.com/gabbrbsCIn/agua_gas_metering_api
cd agua_gas_metering_api
```

2. Crie um arquivo .env na raiz do projeto com a seguinte variável de ambiente:
  
```bash
GEMINI_API_KEY=<sua_api_key_aqui>
```

## Como Rodar
Para construir e iniciar a aplicação:
```bash
docker-compose up --build
```

OU

```bash
npm install
npm run dev
```

## Observações
Certifique-se de ter uma chave válida para a variável GEMINI_API_KEY.
O projeto usa Prisma para o gerenciamento do banco de dados.
