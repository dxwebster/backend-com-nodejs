## 🔖  Sobre
Essa aplicação é um exemplo de como utilizar o NodeJS em conjunto com o Insomnia para criar um CRUD que cria, lista, filtra, atualiza e deleta projetos.

## 🚀 Tecnologias utilizadas
O projeto foi desenvolvido utilizando as seguintes tecnologias
NodeJS
Express
UUIDV4
Nodemon
Insomnia

## 🗂 Como baixar o projeto
```
// Clonar o repositório
$ git clone https://github.com/dxwebster/nivel-01-desafio-conceitos-nodejs.git

// Entrar no diretório
$ cd back-end

// Instalar as dependências
$ yarn init

// Iniciar o projeto
$ yarn start
```

## 🗂 Como criar esse projeto do zero

### Instalação das bibliotecas

Instalar o Node 
    
    Fazer o donwload em https://nodejs.org/en/

Instalar o yarn

    npm install -g yarn

Criar uma pasta server Iniciar o node na pasta (cria o arquivo 'package.json')

    yarn init -y

Instalar o Express (cria a pasta 'node_modules' e o arquivo 'package-lock.json')
    
    yarn add express -D

Instalar a definição de tipos do Express

    yarn add @types/express -D
    
Instalar o Nodemon que vai detectar toda a alteração do código e reiniciar o servidor

    yarn add nodemon -D

No arquivo package.json, criar um script 'dev' para encurtar o comando de execução da aplicação

    "dev": nodemon src/index.js"

Instalar uma biblioteca que vai nos trazer ids diferentes para cada item criado

    yarn add uuidv4

Criar uma nova pasta 'src'e um arquivo 'index.js' dentro dessa pasta. Vamos escrever nossos códigos nesse arquivo index.js.

### Primeiros códigos

As primeiras linhas de código são as importações das bibliotecas que serão utilizadas na aplicação.

    const express = require('express'); //importa a biblioteca express
    const {uuid} = require('uuidv4'); // importa a biblioteca uuidv4

Cria uma const que vai armazenamr o express e depois fala pro express que vmaos utilizar objetos json na aplicação

    const app = express(); // armaenza o express
    app.use(express.json()); //fala pro express que vai usar json
    
Como estamos em ambiente de desenvolvimento e não temos banco de dados, vamos utilizar uma técnica que armazena uma variável na memória da aplicação.
Enquanto a aplicação estiver sendo executada as informações contidas na variável vão estar disponíveis pra todo o projeto. 
Se a aplicação fechar ou reiniciar, ela volta no valor vazio

    const projects = [];

Agora vamos escrever a primeira rota de listagem de usuários

## Listar projeto com filtros

```
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

```
app.post('/projects', (request, response) => {
    const {title, owner} = request.body;
    
    const project = {id: uuid(), title, owner} // cria um novo projeto
    projects.push(project); // inclui no array projects o novo projeto

    //exibe o projeto recém criado
    return response.json(project); 
})
```

## Atualiza um projeto 

```tsx
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


```tsx
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

//adiciona a porta para executar o node 
app.listen(3333, () => { // segundo parâmetro é uma função para mostrar algo no terminal
    console.log('Back-end started!');
});
```
## Ambiente de testes feito no Insomnia

<img src="https://ik.imagekit.io/dxwebster/Untitled_4BH-4e4_yB.png"/>

<img src="https://ik.imagekit.io/dxwebster/Untitled__2__6VfmNg0GZ.png"/>

<img src="https://ik.imagekit.io/dxwebster/Untitled__3__hTuakvkyur.png"/>

<img src="https://ik.imagekit.io/dxwebster/Untitled__1__W3v46apHx.png"/>


