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

async function fixConstraint() {
  try {
    // Verificar constraints da coluna produto_id
    const [constraints] = await sequelize.query(`
      SELECT conname, contype
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
      WHERE t.relname = 'pedidos' 
      AND a.attname = 'produto_id'
      AND c.contype = 'n'
    `);
    
    console.log('Constraints encontradas:', constraints);
    
    if (constraints.length > 0) {
      // Remover constraint NOT NULL
      for (const constraint of constraints) {
        console.log(`Removendo constraint: ${constraint.conname}`);
        await sequelize.query(`
          ALTER TABLE pedidos DROP CONSTRAINT "${constraint.conname}"
        `);
      }
    }
    
    // Alterar coluna para permitir NULL
    console.log('Alterando coluna para permitir NULL...');
    await sequelize.query(`
      ALTER TABLE pedidos ALTER COLUMN produto_id DROP NOT NULL
    `);
    
    // Verificar status da coluna
    const [columnStatus] = await sequelize.query(`
      SELECT column_name, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pedidos' AND column_name = 'produto_id'
    `);
    
    console.log('Status da coluna produto_id:', columnStatus[0]);
    
    await sequelize.close();
  } catch (error) {
    console.error('Erro:', error);
    await sequelize.close();
  }
}

fixConstraint(); 