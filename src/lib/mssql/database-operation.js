const mssql = require('mssql');

module.exports = {

    executeInstruction(sqlInstruction, parameters, transaction) {

        return new Promise((resolve, reject) => {

            let statement = new mssql.PreparedStatement(transaction);

            sqlInstruction.parameters.forEach((parameter) => {
                statement.input(parameter.fieldName, parameter.type);
            });

            statement.prepare(sqlInstruction.sqlCommand).then((preparedStatement) => {

                if (!Array.isArray(parameters)) {
                    parameters = [parameters];
                }

                if (parameters.length == 0) {
                    parameters.push({});
                }

                return parameters.reduce((promiseChain, parameter) => {
                    return promiseChain.then(chainResults =>
                        preparedStatement.execute(parameter).then(result =>
                            [ ...chainResults, result ]
                        )
                    );
                }, Promise.resolve([])).then(arrayOfResults => {

                        preparedStatement.unprepare().then(() => {

                            return resolve(arrayOfResults);

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

                if (data.length == 0 || data[0].recordset.length == 0) {

                    return reject('Nenhum resultado.');

                } else if (data.length > 1 || data[0].recordset.length > 1) {

                    return reject('Encontrado mais de um resultado.');

                } else {

                    return resolve(data[0].recordset[0]);

                }

            }).catch((err) => {

                return reject(err);

            });

        });

    },

    getList(sqlInstruction, parameters, transaction) {

        return new Promise((resolve, reject) => {

            return this.executeInstruction(sqlInstruction, parameters, transaction).then((data) => {

                let output = [];

                data.map(a => {
                    output.push(...a.recordset)
                });

                if (output.length == 1) {
                    output = output[0];
                }

                return resolve(output);

            }).catch((err) => {

                return reject(err);

            });

        });

    },

    insert(sqlInstruction, parameters, transaction) {

        return new Promise((resolve, reject) => {

            this.executeInstruction(sqlInstruction, parameters, transaction).then((data) => {

                let output = [];

                data.map(a => {
                    output.push(...a.recordset)
                });

                if (output.length == 1) {
                    output = output[0];
                }

                return resolve(output);

            }).catch((err) => {

                return reject(err);

            })

        });

    }

};