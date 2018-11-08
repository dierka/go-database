const mssql = require('mssql');

module.exports = {

    executeInstruction(sqlInstruction, parameters, transaction) {

        return new Promise((resolve, reject) => {

            let statement = new mssql.PreparedStatement(transaction);

            sqlInstruction.parameters.forEach((parameter) => {
                statement.input(parameter.fieldName, parameter.type);
            });

            statement.prepare(sqlInstruction.sqlCommand).then((preparedStatement) => {

                preparedStatement.execute(parameters).then((data) => {

                    preparedStatement.unprepare().then(() => {

                        return resolve(data);

                    });

                }).catch((err) => {

                    return reject(err);

                });

            }).catch((err) => {

                return reject(err);

            })

        });

    },

    getObject(sqlInstruction, parameters, transaction) {

        return new Promise((resolve, reject) => {

            this.executeInstruction(sqlInstruction, parameters, transaction).then((data) => {

                if (data.recordset.length == 0) {

                    return reject('Nenhum resultado.');

                } else if (data.recordset.length > 1) {

                    return reject('Encontrado mais de um resultado.');

                } else {

                    return resolve(data.recordset[0]);

                }

            }).catch((err) => {

                return reject(err);

            });

        });

    },

    getList(sqlInstruction, parameters, transaction) {

        return this.executeInstruction(sqlInstruction, parameters, transaction);

    },

    insertObject(sqlInstruction, parameters, transaction) {

        return new Promise((resolve, reject) => {

            this.executeInstruction(sqlInstruction, parameters, transaction).then((data) => {

                if (data.rowsAffected == 0) {

                    return reject('Nenhum registro afetado');

                } else if (!data.recordset || data.recordset.length == 0) {

                    return reject('Nenhum output foi definido');

                } else if (data.rowsAffected > 1 || data.recordset.length > 1) {

                    return reject('Mais de um registro foi afetado.');

                } else {

                    return resolve(data.recordset[0]);

                }

            }).catch((err) => {

                return reject(err);

            })

        });

    },

    insertList(sqlInstruction, parameters, transaction) {

        // todo - criar operação que aproveite o mesmo statement.
    }

};