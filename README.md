# Atividade guiada · API CRUD de tarefas com Spring Boot

API REST para controle de tarefas, feita a partir do roteiro da aula 01 de Frameworks 2
(Unilavras). Dá para criar, listar, buscar, atualizar e excluir tarefas. Os dados ficam numa
lista em memória, então somem quando a aplicação é reiniciada.

**Página de teste (Vercel):** https://atividade-spring-boot-frames-2.vercel.app

## Configuração do projeto

Gerado no Spring Initializr com:

- Project: Maven
- Group: `com.example`
- Artifact: `task-api`
- Packaging: Jar
- Language: Java (17)
- Spring Boot: 4.1.1
- Dependência: Spring Web

## Estrutura

```
src/main/java/com/example/task_api/
  TaskApiApplication.java        classe principal
  model/Task.java                modelo da tarefa (id, title, description, dueDate)
  repository/TaskRepository.java lista em memória com @Repository
  controller/TaskController.java endpoints REST em /tasks
postman/                         coleção pronta para importar no Postman
web/                             página publicada na Vercel para testar a API
```

## Endpoints

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/tasks` | lista todas as tarefas |
| GET | `/tasks/{id}` | busca uma tarefa (404 se não existir) |
| POST | `/tasks` | cria uma tarefa (201) |
| PUT | `/tasks/{id}` | atualiza a tarefa com esse id |
| DELETE | `/tasks/{id}` | exclui a tarefa (204, ou 404 se não existir) |

Exemplo de corpo para o POST:

```json
{
  "title": "Casa",
  "description": "Organizar as tarefas de casa",
  "dueDate": "2026-12-31"
}
```

Se o `id` não for enviado, a API gera um sozinha.

## Rodando

Precisa de Java 17 ou mais novo. Abrir o projeto na IDE e rodar `TaskApiApplication`, ou pelo
terminal:

```bash
mvn spring-boot:run
```

A API sobe em `http://localhost:8080/tasks`.

## Testando

- **Postman:** importar `postman/task-api.postman_collection.json`. Tem uma requisição para cada
  operação do roteiro.
- **Página na Vercel:** com a API rodando na máquina, abrir o link lá em cima. A página faz as
  requisições para `http://localhost:8080` e mostra o que foi enviado e o que voltou. Por isso
  o controller tem `@CrossOrigin`. Funciona no Chrome, Edge e Firefox (o Chrome pode pedir
  permissão para acessar a rede local).

## Diferenças em relação ao código do roteiro

- O pacote do modelo ficou `model`.
- O `createTask` do roteiro estava sem `@PostMapping`, então o POST não funcionava. Coloquei.
- O `dueDate` virou `LocalDate`. Com `LocalDateTime`, o JSON de exemplo do roteiro
  (`"2026-12-31"`, só a data) dava erro 400.
- Quando o POST manda um `id` (como no exemplo do roteiro), o gerador de ids pula esse número,
  senão a próxima tarefa criada sem id podia ficar com o mesmo id.
- GET por id e DELETE devolvem 404 quando a tarefa não existe, em vez de resposta vazia.
- A lista do repositório é uma `CopyOnWriteArrayList`, porque o Spring atende requisições em
  paralelo e a `ArrayList` não é segura para isso.
