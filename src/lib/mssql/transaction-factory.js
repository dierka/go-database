const connectionFactory = require('./connection-factory');

module.exports = {

    createTransaction(retry = true) {

        let connection = global['odin-database-connection'];

        return new Promise((resolve) => {

            try {

                let transaction = connection.transaction();

                this.isAlive(transaction).then(() => {

                    transaction.begin().then((beginTransaction) => {

                        return resolve(beginTransaction);

                    }).catch((err) => {

                        throw Error(err);

                    });

                }, (err) => {

                    if (retry) {

                        connectionFactory.createConnection(connection.config).then(() => {

                            connection = global['odin-database-connection'];

                            return resolve(getTransaction(connection, false));
                        });

                    }

                    console.error("Não foi possível obter a transação.", err);
                    throw Error("Não foi possível obter a transação.");

                });

            } catch (err) {

                console.error("Não foi possível obter a transação.", err);
                throw Error("Não foi possível obter a transação.");

            }

        });

    },

    isAlive(transaction) {

        return new Promise((resolve) => {

            try {

                transaction.begin((err) => {
                    if (err) {

                        throw Error(err);

                    } else {

                        transaction.request().query("SELECT 1", (err) => {

                            if (err) {

                                throw Error(err);

                            } else {

                                transaction.rollback(() => {
                                    return resolve();
                                });

                            }

                        });

                    }
                });

            } catch (err) {

                throw Error(err);

            }

        });
    },

    commitTransaction(transaction) {

        return new Promise((resolve) => {

            transaction.commit().then(() => {

                return resolve();

            }).catch(() => {

                return resolve();

            });

        });

    },

    rollbackTransaction(transaction) {

        return new Promise((resolve) => {

            transaction.rollback().then(() => {

                return resolve();

            }).catch(() => {

                return resolve();

            });

        });

    }


}