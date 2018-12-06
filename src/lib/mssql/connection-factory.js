const mssql = require('mssql');

module.exports = {

    createConnection(dbConfig) {

        return new Promise((resolve, reject) => {

            new mssql.ConnectionPool(dbConfig).connect().then((pool) => {

                console.debug("Conectado ao banco de dados.");

                global['odin-database-connection'] = pool;

                return resolve();

            }).catch((err) => {

                console.error("Não foi possivel se conectar ao banco de dados.", err);
                return reject("Não foi possivel se conectar ao banco de dados.");

            });

        });
    },

    getConnection() {

        return global['odin-database-connection'];

    },

    closeConnection() {

        let connection = global['odin-database-connection'];

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