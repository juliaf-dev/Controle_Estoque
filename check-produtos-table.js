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

async function checkProdutosTable() {
  try {
    // Verificar estrutura da tabela produtos
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'produtos' 
      ORDER BY ordinal_position
    `);
    
    console.log('Estrutura da tabela produtos:');
    console.log(columns);
    
    // Verificar se existe o campo precoVenda
    const precoVendaColumn = columns.find(col => col.column_name === 'precoVenda');
    console.log('\nCampo precoVenda existe:', !!precoVendaColumn);
    
    if (precoVendaColumn) {
      console.log('Detalhes do campo precoVenda:', precoVendaColumn);
    }
    
    // Verificar dados de um produto
    const [produtos] = await sequelize.query(`
      SELECT id, nome, valor, "precoVenda"
      FROM produtos 
      LIMIT 3
    `);
    
    console.log('\nDados de produtos:');
    console.log(produtos);
    
    await sequelize.close();
  } catch (error) {
    console.error('Erro:', error);
    await sequelize.close();
  }
}

checkProdutosTable(); 