# 🔍 CPF Lookup Service

## ✨ Funcionalidades

- 🔐 Autenticação segura com credenciais
- 📡 Consulta de informações pessoais por CPF
- 🔁 Tratamento de múltiplas tentativas de requisição
- 🛡️ Manipulação de erros robusta

## 🛠️ Requisitos Técnicos

| Tecnologia | Versão Mínima |
|------------|---------------|
| Node.js    | 14.x          |
| TypeScript | 4.x           |
| npm        | 6.x           |

## 🚀 Instalação

### Passo a Passo

1. Clone o repositório
```bash
git clone https://github.com/lalaio1/InfoSUS_API
cd InfoSUS_API
```

2. Instale as dependências
```bash
npm install
```

3. Configuração das Credenciais
- Abra o arquivo `index.ts`
- Substitua `SEU_EMAIL_AQUI` e `SUA_SENHA_AQUI` com suas credenciais

## 🔧 Configuração

Crie um arquivo `tsconfig.json` na raiz do projeto:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## 💻 Scripts de Execução

| Script         | Comando                | Descrição                                  |
|----------------|------------------------|-------------------------------------------|
| Desenvolvimento| `npm run dev`          | Inicia o servidor em modo de desenvolvimento |
| Compilar       | `npm run build`        | Compila o TypeScript para JavaScript       |
| Iniciar        | `npm start`            | Inicia o servidor de produção              |

## 🌐 Uso da API

### Consulta de CPF

```
GET /cpf?cpf=NUMERODOCPF
```

#### Exemplo de Requisição
```bash
curl http://localhost:3000/cpf?cpf=12345678900
```

## 📊 Estrutura de Resposta

| Campo           | Tipo    | Descrição                            |
|-----------------|---------|--------------------------------------|
| nome            | string  | Nome completo                        |
| dataNascimento  | string  | Data de nascimento                   |
| sexo            | string  | Sexo                                 |
| nomeMae         | string  | Nome da mãe                          |
| ativo           | boolean | Status de atividade                  |
| racaCor         | string  | Raça/Cor                             |

## 🚧 Tratamento de Erros

- ❌ CPF não informado: Retorna erro 400
- 🔒 Falha de autenticação: Retorna erro de login
- 📭 Dados não encontrados: Retorna mensagem específica
