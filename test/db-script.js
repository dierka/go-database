const mssql = require('mssql');

module.exports = {

    createTables: {
        sqlCommand: `
        
            create table dbo.livro (
              id_livro int identity primary key,
              ds_livro varchar(255) not null
            )
        
        `,
        parameters: []
    },

    dropTables: {
        sqlCommand: `
        
            drop table if exists livro;
        
        `,
        parameters: []
    },

    insertRecord: {
        sqlCommand: `
        
            insert into dbo.livro (ds_livro)
            output inserted.id_livro
            values (@ds_livro)
            
        `,
        parameters: [
            {
                fieldName: 'ds_livro',
                type: mssql.VarChar(50)
            }
        ]
    },

    getRecord: {
        sqlCommand: `
        
            select
                id_livro,
                ds_livro
            from dbo.livro
            where id_livro = @id_livro
            
        `,
        parameters: [
            {
                fieldName: 'id_livro',
                type: mssql.Int
            }
        ]
    }

};