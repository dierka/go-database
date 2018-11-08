module.exports = {
    mssql: {
        connectionFactory: require('./mssql/connection-factory'),
        transactionFactory: require('./mssql/transaction-factory'),
        databaseOperation: require('./mssql/database-operation')
    }
};