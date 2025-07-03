import { Router } from 'express';
import { body, param, query } from 'express-validator';
import ProductController from '../controllers/ProductController';
const router = Router();
const productController = new ProductController();

// Listar produtos
router.get('/products',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limite deve ser um número inteiro positivo'),
    query('categoria_id').optional().isInt().withMessage('Categoria deve ser um número inteiro'),
    query('search').optional().isString()
  ],
  productController.index
);

// Buscar produto por ID
router.get('/products/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  productController.show
);

// Criar produto
router.post('/products',
  [
    body('nome').notEmpty().isString().withMessage('Nome é obrigatório'),
    body('categoria_id').isInt().withMessage('Categoria é obrigatória e deve ser inteira'),
    body('quantidade_estoque').isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro >= 0'),
    body('valor').isDecimal().withMessage('Valor é obrigatório e deve ser decimal'),
    body('descricao').optional().isString()
  ],
  productController.store
);

// Atualizar produto
router.put('/products/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().isString(),
    body('categoria_id').optional().isInt(),
    body('quantidade_estoque').optional().isInt({ min: 0 }),
    body('valor').optional().isDecimal(),
    body('descricao').optional().isString(),
    body('ativo').optional().isBoolean()
  ],
  productController.update
);

// Remover produto (soft delete)
router.delete('/products/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  productController.delete
);

// Atualizar estoque
router.patch('/products/:id/estoque',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('quantidade').isInt().withMessage('Quantidade é obrigatória e deve ser inteira'),
    body('tipo').isIn(['entrada', 'saida']).withMessage('Tipo deve ser "entrada" ou "saida"')
  ],
  productController.updateStock
);

// Produtos com estoque baixo
router.get('/products/low-stock',
  [query('limite').optional().isInt({ min: 0 })],
  productController.lowStock
);

// Buscar fornecedores de um produto
router.get('/products/:id/fornecedores',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  productController.getProductSuppliers
);

export default router; 