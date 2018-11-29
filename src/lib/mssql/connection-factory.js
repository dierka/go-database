const mssql = require('mssql');

module.exports = {

    createConnection(dbConfig) {

        return new Promise((resolve) => {

            new mssql.ConnectionPool(dbConfig).connect().then((pool) => {

                console.debug("Conectado ao banco de dados.");

                global['odin-database-connection'] = pool;

                return resolve();

            }).catch((err) => {

                console.error("Não foi possivel se conectar ao banco de dados.", err);
                throw Error("Não foi possivel se conectar ao banco de dados.");

            });

        });
    },

    closeConnection() {

        let connection = global['odin-database-connection'];

        return new Promise((resolve) => {

            try {
                connection.close();
                console.debug("Conexão fechada.");
                return resolve();
            } catch (err) {
                console.error("Não foi possível fechar a conexão.", err);
                throw Error("Não foi possível fechar a conexão.");
            }
        });

    }
}