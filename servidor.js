var express = require('express'); // requisita a biblioteca para a criacao dos serviços web.
var pg = require("pg"); // requisita a biblioteca pg para a comunicacao com o banco de dados.

var sw = express(); // iniciliaza uma variavel chamada app que possitilitará a criação dos serviços e rotas.

sw.use(express.json());//padrao de mensagens em json.
//permitir o recebimento de qualquer origem, aceitar informações no cabeçalho e permitir o métodos get e post
sw.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    next();
});

const config = {
    host: 'localhost',
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432
};

//definia conexao com o banco de dados.
const postgres = new pg.Pool(config);

//definicao do primeiro serviço web.
sw.get('/', (req, res) => {  //http://localhost:4000
    res.send('Hello, world! meu primeiro teste.  #####');
})

sw.get('/teste', (req, res) => {
    res.status(201).send('meu teste');
})

sw.get('/listendereco', function (req, res, next) {

    postgres.connect(function (err, client, done) {

        if (err) { //se em algum momento tiver erro de comunicação vai aparecer essa mensagem:

            console.log("Nao conseguiu acessar o  BD " + err);
            res.status(400).send('{' + err + '}'); //400: erro interno
        } else {

            var q = 'select codigo , complemento, cep, nicknamejogador' + 'from tb_endereco order by codigo asc';

            client.query(q, function (err, result) { //o q pode dar erro ou resultado
                done(); // fecha a conexão;
                if (err) {
                    console.log('retornou 400 no listendereco');
                    console.log(err);

                    res.status(400).send('{' + err + '}'); //400: codigo de erro
                } else {

                    //console.log('retornou 201 no /listendereco');
                    res.status(201).send(result.rows); //200 e 201: código de sucesso 
                }
            });
        }
    });
});





sw.get('/teste', (req, res) => { //http://localhost:4000/teste
    res.send('meu teste');
})

sw.listen(4000, function () {
    console.log('Server is running.. on Port 4000');
});

