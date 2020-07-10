## 🔖  Sobre
Essa aplicação é um exemplo de como utilizar o NodeJS em conjunto com o Insomnia para criar um CRUD que cria, lista, filtra, atualiza e deleta projetos.

## 🚀 Tecnologias utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias
NodeJS
Express
UUIDV4
Nodemon
Insomnia

## 🗂 Como criar esse projeto do zero

## Instalação das bibliotecas

**Instalar o Node**
    
    Fazer o donwload em https://nodejs.org/en/

**Instalar o yarn**

    npm install -g yarn

**Criar uma pasta server e iniciar o node na pasta** (cria o arquivo 'package.json')

    yarn init -y

**Instalar o Express** (cria a pasta 'node_modules' e o arquivo 'package-lock.json')
    
    yarn add express -D

**Instalar a definição de tipos do Express**

    yarn add @types/express -D
    
**Instalar o Nodemon**, que vai detectar toda a alteração do código e reiniciar o servidor

    yarn add nodemon -D

No arquivo package.json, criar um script 'dev' para encurtar o comando de execução da aplicação

    "dev": nodemon src/index.js"

**Instalar o uuidv4**, uma biblioteca que vai nos trazer ids diferentes para cada item criado

    yarn add uuidv4

Criar uma nova pasta 'src'e um arquivo 'index.js' dentro dessa pasta. Vamos escrever nossos códigos nesse arquivo index.js.

## Primeiros códigos

As primeiras linhas de código são as importações das bibliotecas que serão utilizadas na aplicação.

```js
const express = require('express'); //importa a biblioteca express
onst {uuid} = require('uuidv4'); // importa a biblioteca uuidv4
```

Cria uma const que vai armazenamr o express e depois fala pro express que vamos utilizar objetos json na aplicação

```js
const app = express(); // armaenza o express
app.use(express.json()); //fala pro express que vai usar json
```
    
Como estamos em ambiente de desenvolvimento e não temos banco de dados, vamos utilizar uma técnica que armazena uma variável na memória da aplicação.
Vamor criar uma variável de valor vaizo. Enquanto a aplicação estiver sendo executada as informações contidas na variável vão estar disponíveis pra todo o projeto. 
Se a aplicação fechar ou reiniciar, ela volta ao seu valor vazio.

```js
const projects = [];
```

A última linhas de código será uma função que vai executar o node através de uma porta HTTP para que possamos fazer os testes.
O primeiro parâmetro é a porta, nesse caso 3333, e o segundo parâmetro é uma função que vai exibir algo no terminal para que saibamos que o servidor está funcionando.

```js
app.listen(3333, () => {console.log('Back-end started!');});
```

Nossas rotas que irão listar, criar, deletar, e atualizar projetos vão ficar sempre antes dessa linha de código que acabamos de criar. O arquivo então terá o seguinte formato

```
[Códigos de imports]
[Rotas]
[Código app.listen()]
```

## Listar projeto com filtros
Com o método get, consigo gerar uma lista de todos os projetos que existem. E com o método filter() consigo fazer filtros, ou seja, buscar um projeto que tem uma palavra específica no título.

```js
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
    // Se tiver algo a ser buscado, a variável results vai receber algum filtro do array projects
    // para cada um dos projetos filtrados, verifica se no título do projeto inclui a palavra especificada
    ? projects.filter(project => project.title.includes(title)) 
    : projects; // se não tiver nada a ser buscado, lista o array projects
    
    return response.json(results);
});
```

## Criação de um projeto 
Através do método post que consigo criar novos projetos. 

```js
app.post('/projects', (request, response) => {
    const {title, owner} = request.body;
    
    const project = {id: uuid(), title, owner} // cria um novo projeto
    projects.push(project); // inclui no array projects o novo projeto

    return response.json(project); //exibe o projeto recém criado
})
```

## Atualiza um projeto 
Através do método put eu consigo atualizar um projeto já existente.

```js
app.put('/projects/:id', (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;
    
    // percorre o 'projects' e retorna na variável 'project' o resultado
    // toda vez que satisfizer a condição project.id é igual ao id recebido na rota
    const projectIndex = projects.findIndex(project => project.id == id); 
   
    if (projectIndex < 0){ // se não encontrar, ou seja, o índice for abaixo de zero
        return response.status(400).json({error: 'Project not found'}) // retorna com status 400
    }
    
    // se encontrar, crio as atualizações do projeto, com as informações vinda do corpo
    const project = { 
        id,
        title,
        owner,
    };

    // no array projects eu procuro na posição projectIndex e...
    // ...substituo a posição pelas atualizações de projeto que acabei de criar
    projects[projectIndex] = project;
    
    // retorno o projeto atualizado
    return response.json(project); 
});
```

## Deleta um projeto 
Através do método delete, eu consigo excluir um projeto existente.

```js
app.delete('/projects/:id', (request, response) => {
    const {id} = request.params;
    
    // percorre o 'projects' e retorna na variável 'project' o resultado
    // toda vez que satisfizer a condição project.id é igual ao id recebido na rota
    const projectIndex = projects.findIndex(project => project.id == id); 
   
    if (projectIndex < 0){ // se não encontrar, ou seja, o índice for abaixo de zero
        return response.status(400).json({error: 'Project not found'}) // retorna com status 400
    }

    projects.splice(projectIndex, 1); // caso encontre, remova a informação do índice projectIndex

    return response.status(204).send(); // retorna em branco, geralmente envia com o status 204
});
```



## Ambiente de testes feito no Insomnia
O Insomnia vai nos ajudar a testar cada rota que vamos criar. Ele vai conectar na nossa aplicação já criada pela porta 3333, para executar as rotas
Baixar o Insomnia no site https://insomnia.rest/

Para executar os testes, é necessário iniciar o servidor com  o comando:

```
yarn dev
```

Lá no Insommina vamos começar criando uma pasta com nome Projects

<img src="https://ik.imagekit.io/dxwebster/Untitled_q7XD78vzL.png"/>

Vou em Manager Enviroments para criar uma variável para base_url

<img src="https://ik.imagekit.io/dxwebster/Screenshot_2_kC6CPpExS.png"/>

Na rota Create, eu consigo inserir um objeto em formato json no corpo da requisição na aba body.
Assim que eu dou Send, ele cria o novo projeto.

<img src="https://ik.imagekit.io/dxwebster/Untitled__1__W3v46apHx.png"/>

Crio a rota List, para listar todos os projetos. Na aba Query, eu posso inserir um filtro para minha listagem.
No exemplo abaixo, ele lista só os projetos que contém "React" no título.

<img src="https://ik.imagekit.io/dxwebster/Untitled_4BH-4e4_yB.png"/>

Crio a rota delete ou update, e através do id passado na URL, posso apagar ou atualizar apenas 1 projeto específico

<img src="https://ik.imagekit.io/dxwebster/Untitled__2__6VfmNg0GZ.png"/><img src="https://ik.imagekit.io/dxwebster/Untitled__3__hTuakvkyur.png"/>



