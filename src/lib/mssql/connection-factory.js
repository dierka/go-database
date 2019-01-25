const mssql = require('mssql');

module.exports = {

    createConnection(dbConfig) {

        return new Promise((resolve, reject) => {

            new mssql.ConnectionPool(dbConfig).connect().then((connection) => {

                console.debug("Conectado ao banco de dados.");

                global['go-database-connection'] = connection;

                return resolve();

            }).catch((err) => {

                console.error("Não foi possivel se conectar ao banco de dados.", err);
                return reject("Não foi possivel se conectar ao banco de dados.");

            });

        });
    },

    getConnection() {

        return global['go-database-connection'];

    },

    closeConnection() {

        let connection = global['go-database-connection'];

        return new Promise((resolve, reject) => {

            try {
                connection.close();
                console.debug("Conexão fechada.");
                return resolve();
            } catch (err) {
                console.error("Não foi possível fechar a conexão.", err);
                return reject("Não foi possível fechar a conexão.");
            }
        });

    }
}