const express = require('express');//importa o express
const cors = require('cors'); //importa o cors para segurança
const {uuid} = require('uuidv4');
const app = express(); 

app.use(cors());
app.use(express.json()); 

// Armazena uma variável na memória da aplicação (apenas para desenvolvimento)
// Enquanto a aplicação estiver sendo executada, as informações contidas na variável
// vão estar disponíveis pra todo o projeto
// se a aplicação fechar ou reiniciar, ela volta no valor vazio
const projects = [];


// função que vai mostrar no terminal qual rota está sendo chamada no insomnia
function logRequests(request, response, next){
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`; // cria um formato para apresentar as informações

    console.log(logLabel);

    return next(); // faz com que o próximo middleware seja disparado. Se não retornar o next, ele interrompe as execuções
}


app.use(logRequests);


// ---------------------------------------------------------------------- 
// ----------------- Listar projeto com filtros  ------------------------
// ----------------------------------------------------------------------
app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
    // Se tiver algo a ser buscado, a variável results vai receber algum filtro do array projects
    // para cada um dos projetos filtrados, verifica se no título do projeto inclui a palavra especificada
    ? projects.filter(project => project.title.includes(title)) 
    : projects; // se não tiver nada a ser buscado, lista o array projects
    
    return response.json(results);
});



// -------------------------------------------------------------------- 
// ----------------------- Criação de um projeto ---------------------- 
// -------------------------------------------------------------------- 
app.post('/projects', (request, response) => {
    const {title, owner} = request.body;
    
    const project = {id: uuid(), title, owner} // cria um novo projeto
    projects.push(project); // inclui no array projects o novo projeto

    //exibe o projeto recém criado
    return response.json(project); 
})



// -------------------------------------------------------------------- 
// ----------------------- Atualiza um projeto  -----------------------
// --------------------------------------------------------------------   
app.put('/projects/:id', (request, response) => {
    const {id} = request.params;
    const {title, owner} = request.body;
    
    // percorre o 'projects' e retorna na variável 'project' o resultado
    // toda vez que satisfizer a condição project.id é igual ao id recebido na rota
    const projectIndex = projects.findIndex(project => project.id == id); 
   
    if (projectIndex < 0){ // se não encontrar, ou seja, o índice for abaixo de zero
        return response.status(400).json({error: 'Project not found'}) // retorna com status 400
    }
    
    // crio as atualizações do projeto, com as informações vinda do corpo
    const project = { 
        id,
        title,
        owner,
    };

    // no array projects eu procuro na posição projectIndex e substituo a posição pelas atualizações de projeto que acabei de criar
    projects[projectIndex] = project;
    
    // retorno o projeto atualizado
    return response.json(project); 
});



// -------------------------------------------------------------------- 
// ----------------------- Deleta um projeto  -----------------------
// --------------------------------------------------------------------  
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




// -------------------------------------------------------------------- 
// Última execução: adiciona a porta para executar a aplicação 
// -------------------------------------------------------------------- 
app.listen(3333, () => { 
    console.log('Back-end started!');
    // primeiro parâmetro é a porta
    // segundo parâmetro é uma função
});