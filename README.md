## 🔖  Sobre
Esse é um exemplo de como utilizar o NodeJS em conjunto com o Insomnia para criar uma aplicação que cria, lista, filtra, atualiza e deleta projetos, conhecida como CRUD.

## 🚀 Tecnologias utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias
* NodeJS
* Express
* uuidv4
* Nodemon
* Insomnia

## 🗂 Testar essa aplicação utilizando esse projeto
Caso você queira utilizar esse repositório e testar a aplicação, execute os seguintes passos, e depois vá direto para a
[configuração do Insomnia](#ambiente-de-testes-no-insomnia).
    
    // Clonar o repositório
    $ git clone https://github.com/dxwebster/nivel-01-back-end-com-nodejs

    // Entrar no diretório
    $ cd nivel-01-back-end-com-nodejs

    // Instalar as dependências
    $ yarn install

    // Iniciar o projeto
    $ yarn start


## 🗂 Como criar essa aplicação do zero
Abaixo você vai encontrar todas a informações de como criar essa aplicação do zero.
Primeiro passo é instalar o Node no seu computador:

**Faça o download em [https://nodejs.org/en/]**

## Instalação das bibliotecas

**Instalar o yarn**: `npm install -g yarn`

Criar uma pasta 'server' que vai conter nossa aplicação.

**Iniciar o node na pasta** _(cria o arquivo 'package.json')_: `yarn init -y`

**Instalar o Express** _(cria a pasta 'node_modules' e o arquivo 'package-lock.json')_: `yarn add express -D`

**Instalar a definição de tipos do Express**: `yarn add @types/express -D`
    
**Instalar o Nodemon** _(vai detectar toda a alteração do código e reiniciar o servidor)_: `yarn add nodemon -D`

**Instalar o uuidv4** _(vai nos trazer ids diferentes para cada item criado)_: `yarn add uuidv4`

**Instalar o cors** _(configuração para uma futura conexão com front-end)_: `yarn add cors`

Criar uma nova pasta 'src'e um arquivo 'index.js' dentro dessa pasta. Vamos escrever nossos códigos nesse arquivo index.js.

## Primeiros códigos

As primeiras linhas de código são as importações das bibliotecas que serão utilizadas na aplicação.

```js
const express = require('express'); //importa a biblioteca express
const {uuid} = require('uuidv4'); // importa a biblioteca uuidv4
const cors = require('cors'); // importa a biblioteca cors
```

Cria uma const que vai armazenar o express e depois indico pro express que vamos utilizar objetos .json na aplicação.

```js
const app = express(); // armaenza o express

app.use(cors()); // usa o cors para conectar com o front futuramente
app.use(express.json()); //fala pro express que vai usar json
```
    
Como estamos em ambiente de desenvolvimento e não temos banco de dados, vamos utilizar uma técnica que armazena uma variável na memória da aplicação.
Vamos criar uma variável com valor vaizo. Enquanto a aplicação estiver sendo executada as informações contidas na variável vão estar disponíveis pra todo o projeto. 
Se a aplicação fechar ou reiniciar, ela volta ao seu valor vazio.

```js
const projects = [];
```

A última linha de código será uma função que vai executar o node através de uma porta HTTP para que possamos fazer os testes.
O primeiro parâmetro é a porta, nesse caso 3333, e o segundo parâmetro é uma função que vai exibir algo no terminal para que saibamos que o servidor está funcionando.

```js
app.listen(3333, () => {console.log('Back-end started!');});
```

Nossas rotas que irão listar, criar, deletar, e atualizar projetos vão ficar sempre antes dessa linha de código que acabamos de criar. O arquivo então terá o seguinte formato

```
[Importação das bibliotecas]
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

## Configuração para rodar o servidor

Para executar a aplicação, é necessário iniciar o servidor. Podemos executar o comando `node src/index.js`, mas podemos gerar um script para deixar esse comando mais curto. No arquivo package.json, setar `"main": "src/index.js"` e criar um script para o nodemon: `"dev": "nodemon"`. Lembrando que o nodemon vai reiniciar o servidor automaticamente a cada alteração que eu salvar no meu arquivo.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_1_ekrklS_ID4.png" width="300"/>

Feito isso, executar o comando `yarn dev`.

## Ambiente de testes no Insomnia

O Insomnia vai nos ajudar a testar cada rota que vamos criar. Ele vai conectar na nossa aplicação já criada pela porta 3333, para executar as rotas.
Para baixar o Insomnia, acessar o site https://insomnia.rest/

Lá no Insommina vamos começar criando uma pasta com nome Projects

<img src="https://ik.imagekit.io/dxwebster/Untitled_q7XD78vzL.png"/>

Vou em Manager Enviroments para criar uma variável para base_url

<img src="https://ik.imagekit.io/dxwebster/Screenshot_2_kC6CPpExS.png"/>

Na rota Create, eu consigo inserir um objeto em formato json no corpo da requisição na aba body.
Assim que eu dou Send, ele cria o novo projeto.

<img src="https://ik.imagekit.io/dxwebster/Screenshot_1_iSnHgDwls.png" width="700"/>

Na rota List, posso listar todos os projetos existentes.

<img src="https://ik.imagekit.io/dxwebster/list_arzBjWOAa.png" width="700"/>

Na aba Query, eu posso inserir um filtro para minha listagem. No exemplo abaixo, ele lista só os projetos que contém "React" no título.

<img src="https://ik.imagekit.io/dxwebster/list-filter_93Vs9fZpJR.png" width="700"/>

Na rota delete ou update, e através do id passado na URL, posso apagar ou atualizar apenas 1 projeto específico

<img src="https://ik.imagekit.io/dxwebster/update_J9Xxv--MO.png" width="700"/>
