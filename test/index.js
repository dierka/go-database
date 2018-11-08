const lib = require('../src/lib/index');
const config = require('./db-config');
const scripts = require('./db-script');

let transaction;
let connection;

lib.mssql.connectionFactory.createConnection(config).then((c) => {

    connection = c;

    console.log('Connection established.');

    return dropTables();

}).then(() => {

    return createTables();

}).then(() => {

    return insertOneRecord();

}).then((data) => {

    return getOneRecord(data);

}).then(() => {

    return dropTables();

}).catch((err) => {

    return lib.mssql.transactionFactory.rollbackTransaction(transaction).then(() => {

        console.log('Rollback performed.');

    });

});

function createTables() {

    return lib.mssql.transactionFactory.createTransaction(connection).then((t) => {

        console.log('Transaction established.');

        transaction = t;

        return lib.mssql.databaseOperation.executeInstruction(scripts.createTables, [], transaction);

    }).then(() => {

        console.log('Tables are created.');

        return lib.mssql.transactionFactory.commitTransaction(transaction);

    });
}

function dropTables() {

    return lib.mssql.transactionFactory.createTransaction(connection).then((t) => {

        console.log('Transaction established.');

        transaction = t;

        return lib.mssql.databaseOperation.executeInstruction(scripts.dropTables, [], transaction);

    }).then(() => {

        console.log('Tables are dropped.');

        return lib.mssql.transactionFactory.commitTransaction(transaction);

    });

}

function insertOneRecord() {

    return lib.mssql.transactionFactory.createTransaction(connection).then((t) => {

        console.log('Transaction established.');

        transaction = t;

        return lib.mssql.databaseOperation.insertObject(scripts.insertRecord, {ds_livro: 'Meu livro'}, transaction);

    }).then((data) => {

        console.log('Record are inserted.');

        return lib.mssql.transactionFactory.commitTransaction(transaction).then(() => {

            return data;

        });

    });

}

function insertListRecords() {

    // todo - necesśario implementar.
}

function getOneRecord(filter) {

    return lib.mssql.transactionFactory.createTransaction(connection).then((t) => {

        console.log('Transaction established.');

        transaction = t;

        return lib.mssql.databaseOperation.getObject(scripts.getRecord, filter, transaction);

    }).then((data) => {

        console.log('Loaded record is: %j', data);

        return lib.mssql.transactionFactory.commitTransaction(transaction);

    });

}