# Authentication API

O authentication-api é um projeto desenvolvido com NestJS que oferece funcionalidades de autenticação de usuário, além de operações CRUD (Create, Read, Update, Delete) relacionadas aos usuários.

## Autenticação

#### Autentica o usuário e retorna um token JWT

```http
 POST /auth/login
```

| Parâmetro | Tipo   | Descrição                                    |
| --------- | ------ | -------------------------------------------- |
| login     | string | **Obrigatório**. Nome de usuário para login. |
| password  | string | **Obrigatório**. Senha do usuário.           |

**Respostas**:

- 201: Login bem-sucedido.
- 401: Credenciais inválidas.

---

#### Realiza logout do usuário

```http
POST /auth/logout
```

| Parâmetro     | Tipo   | Descrição                                |
| ------------- | ------ | ---------------------------------------- |
| Authorization | string | Obrigatório. Bearer token JWT no header. |

**Respostas**:

- 200: Logout bem-sucedido.
- 400: No token provided.

## API de Usuário

#### Obtém todos os usuários

```http
GET /users
```

| Parâmetro     | Tipo   | Descrição                                |
| ------------- | ------ | ---------------------------------------- |
| Authorization | string | Obrigatório. Bearer token JWT no header. |

**Respostas**:

- 200: Lista de todos os usuários.

---

#### Obtém os dados do usuário logado

```http
GET /users/me
```

| Parâmetro     | Tipo   | Descrição                                |
| ------------- | ------ | ---------------------------------------- |
| Authorization | string | Obrigatório. Bearer token JWT no header. |

**Respostas**:

- 200: Dados do usuário logado.

---

#### Obtém o total de usuários

```http
GET /users/count
```

**Respostas**:

- 200: Total de usuários.

---

#### Obtém detalhes de um usuário pelo ID

```http
GET /users/${id}
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Detalhes do usuário obtidos com sucesso.
- 404: Usuário não encontrado.

---

#### Cria um novo usuário

```http
POST /users
```

| Parâmetro | Tipo   | Descrição                      |
| --------- | ------ | ------------------------------ |
| username  | string | Obrigatório. Nome de usuário.  |
| password  | string | Obrigatório. Senha do usuário. |
| email     | string | Obrigatório. Email do usuário. |

**Respostas**:

- 201: Usuário criado com sucesso.

---

#### Atualiza a senha do usuário

```http
PATCH /users/${id}/password
```

| Parâmetro   | Tipo   | Descrição                           |
| ----------- | ------ | ----------------------------------- |
| id          | string | Obrigatório. O ID do usuário.       |
| newPassword | string | Obrigatório. Nova senha do usuário. |

**Respostas**:

- 200: Senha atualizada com sucesso.

---

#### Atualiza a imagem de perfil do usuário

```http
PATCH /users/${id}/profile-image**
```

| Parâmetro | Tipo   | Descrição                       |
| --------- | ------ | ------------------------------- |
| id        | string | Obrigatório. O ID do usuário.   |
| file      | file   | Obrigatório. Arquivo de imagem. |

**Respostas**:

- 200: Imagem de perfil atualizada com sucesso.

---

#### Deleta um usuário pelo ID

```http
DELETE /users/\${id}
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário deletado com sucesso.

---

#### Cria um nome de usuário

```http
POST /users/username/${userId}/\${username}/\${organizationId}
```

| Parâmetro      | Tipo   | Descrição                                             |
| -------------- | ------ | ----------------------------------------------------- |
| userId         | string | Obrigatório. O ID do usuário.                         |
| username       | string | Obrigatório. Nome de usuário.                         |
| organizationId | string | Obrigatório. O ID da organização.                     |
| password       | string | Obrigatório. Senha do usuário no corpo da requisição. |

**Respostas**:

- 201: Nome de usuário criado com sucesso.
- 409: Nome de usuário já existe na organização.

---

#### Ativa um usuário

```http
PATCH /users/${id}/enable
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário ativado com sucesso.

---

#### Desativa um usuário

```http
PATCH /users/${id}/disable
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário desativado com sucesso.

---

#### Bloqueia um usuário

```http
PATCH /users/${id}/block
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário bloqueado com sucesso.

---

#### Desbloqueia um usuário

```http
PATCH /users/${id}/unblock
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário desbloqueado com sucesso.

---

#### Bane um usuário

```http
PATCH /users/${id}/ban
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário banido com sucesso.

---

#### Desbane um usuário

```http
PATCH /users/${id}/unban
```

| Parâmetro | Tipo   | Descrição                     |
| --------- | ------ | ----------------------------- |
| id        | string | Obrigatório. O ID do usuário. |

**Respostas**:

- 200: Usuário desbanido com sucesso.

---

#### Deleta um nome de usuário

```http
DELETE /users/username/\${id}
```

| Parâmetro | Tipo   | Descrição                             |
| --------- | ------ | ------------------------------------- |
| id        | string | Obrigatório. O ID do nome de usuário. |

**Respostas**:

- 200: Nome de usuário deletado com sucesso.

---
