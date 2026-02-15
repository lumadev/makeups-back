# 🔐 Security Policy

Este documento descreve as práticas de segurança implementadas no servidor backend desenvolvido com Express.js.  
O objetivo é reduzir a superfície de ataque da aplicação, mitigar vulnerabilidades comuns e proteger usuários e dados sensíveis.

---

## 🛡️ Camadas de Proteção Implementadas

### 1. Controle de CORS (Cross-Origin Resource Sharing)

O servidor restringe explicitamente quais origens podem acessar a API.

- **Desenvolvimento:**  
  - http://localhost:5173  
  - http://localhost:5174  

- **Produção:**  
  - Apenas a URL definida na variável de ambiente `FRONTEND_URL`.

Essa configuração previne que domínios não autorizados façam requisições autenticadas à API, reduzindo riscos como:

- Uso indevido da API por aplicações externas
- Exploração de endpoints autenticados por origens maliciosas

O uso de `credentials: true` permite envio de cookies autenticados apenas para origens confiáveis.

---

### 2. Proteção de Headers HTTP com Helmet

O middleware `helmet` adiciona automaticamente diversos headers de segurança HTTP.

Esses headers ajudam a prevenir:

- Clickjacking  
- MIME sniffing  
- Ataques básicos de XSS  
- Exposição de informações sensíveis do servidor  
- Ataques de downgrade para HTTP  

Essa camada reforça como o navegador deve interpretar as respostas do servidor.

---

### 3. Prevenção de HTTP Parameter Pollution (HPP)

O middleware `hpp` impede que múltiplos parâmetros com o mesmo nome sejam enviados na query string.

Exemplo de tentativa maliciosa:
/user?id=1&id=2&id=3

Esse tipo de manipulação pode causar comportamento inesperado na aplicação.

Com o HPP ativado:

- Apenas um valor é considerado
- Reduz risco de bypass de validação
- Evita manipulação lógica indevida

---

### 4. Limitação do Tamanho do Payload

O servidor limita o corpo das requisições JSON a **10kb**.

Isso ajuda a prevenir:

- Ataques de negação de serviço (DoS) via payload excessivo  
- Sobrecarga de memória  
- Envio de dados desnecessariamente grandes  

---

### 5. Rate Limiting (Controle de Requisições)

A aplicação utiliza dois níveis de limitação de requisições.

#### 🔹 Rate Limiter Global

Aplicado a todas as rotas.

Protege contra:

- Flood de requisições  
- Ataques automatizados  
- Tentativas de DoS  
- Scraping agressivo  

Limita o número de requisições por IP dentro de um intervalo de tempo.

---

#### 🔹 Rate Limiter para Login

Aplicado especificamente na rota `/auth/login`.

Protege contra:

- Ataques de força bruta  
- Credential stuffing  
- Tentativas automatizadas de adivinhar senha  

Essa proteção é essencial para endpoints de autenticação.

---

### 6. Cookies e Autenticação

A aplicação utiliza `cookie-parser` para manipulação de cookies.

Recomenda-se que cookies de autenticação sejam configurados com:

- `httpOnly` → impede acesso via JavaScript  
- `secure` → envio apenas via HTTPS em produção  
- `sameSite` → reduz risco de CSRF  

Essas configurações ajudam a evitar roubo de tokens e uso indevido de sessões.

---

### 7. Validação de Variáveis de Ambiente

A função `validateEnv()` garante que todas as variáveis de ambiente obrigatórias estejam definidas antes da aplicação iniciar.

Isso previne:

- Inicialização com configuração insegura  
- Execução sem chaves secretas  
- Erros silenciosos em produção  

A aplicação falha imediatamente caso algo crítico esteja ausente.

---

### 8. Trust Proxy

A configuração:

app.set('trust proxy', 1)

É necessária quando a aplicação está atrás de:

- Proxy reverso  
- Load balancer  
- Serviços como Nginx, Cloudflare ou plataformas PaaS  

Isso garante:

- Identificação correta do IP real do cliente  
- Funcionamento adequado do rate limit  
- Compatibilidade com cookies `secure`

---

### 9. Tratamento Centralizado de Erros

A aplicação possui um middleware global de tratamento de erros.

Isso garante que:

- Stack traces não sejam expostos em produção  
- Respostas de erro sejam padronizadas  
- Informações internas da aplicação não vazem  

Erros são tratados de forma controlada e segura.

---

## 🔒 Boas Práticas Recomendadas

Além das medidas já implementadas, as seguintes medidas são aplicadas:

- Utilização HTTPS obrigatório em produção  
- Dependências sempre atualizadas  
- Execução de auditorias periódicas (`npm audit`)  
- Adicionado tempo de expiração ao token de 8 horas
