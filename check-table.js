const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_FrTI0ZqmBl3t', {
  host: 'ep-raspy-sun-ac0dgrh6-pooler.sa-east-1.aws.neon.tech',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function checkTable() {
  try {
    // Verificar se a tabela existe
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'produto_fornecedores'
    `);
    
    console.log('Tabela produto_fornecedores existe:', results.length > 0);
    
    if (results.length > 0) {
      // Verificar estrutura da tabela
      const [columns] = await sequelize.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'produto_fornecedores' 
        ORDER BY ordinal_position
      `);
      
      console.log('Estrutura da tabela:');
      console.log(columns);
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('Erro:', error);
    await sequelize.close();
  }
}

checkTable(); 