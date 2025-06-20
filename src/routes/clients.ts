import { Router } from 'express';
import { body, param, query } from 'express-validator';
import ClienteController from '../controllers/ClienteController';

const router = Router();
const clienteController = new ClienteController();

// Listar clientes
router.get('/clients',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limite deve ser um número inteiro positivo'),
    query('search').optional().isString()
  ],
  clienteController.index
);

// Buscar cliente por ID
router.get('/clients/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  clienteController.show
);

// Criar cliente
router.post('/clients',
  [
    body('nome').notEmpty().trim().withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 200 }).withMessage('Nome deve ter entre 2 e 200 caracteres'),
    body('email').isEmail().withMessage('Email deve ser válido'),
    body('telefone').optional().isString().withMessage('Telefone deve ser uma string'),
    body('endereco').optional().isString().withMessage('Endereço deve ser uma string'),
    body('cpf').optional().isString().withMessage('CPF deve ser uma string'),
    body('produtos').optional().isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.store
);

// Atualizar cliente
router.put('/clients/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Nome deve ter entre 2 e 200 caracteres'),
    body('email').optional().isEmail().withMessage('Email deve ser válido'),
    body('telefone').optional().isString().withMessage('Telefone deve ser uma string'),
    body('endereco').optional().isString().withMessage('Endereço deve ser uma string'),
    body('cpf').optional().isString().withMessage('CPF deve ser uma string'),
    body('ativo').optional().isBoolean().withMessage('Ativo deve ser um valor booleano'),
    body('produtos').optional().isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.update
);

// Remover cliente (soft delete)
router.delete('/clients/:id',
  [param('id').isInt().withMessage('ID deve ser um número inteiro')],
  clienteController.delete
);

// Adicionar produtos a um cliente
router.post('/clients/:id/produtos',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('produtos').isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.addProdutos
);

// Remover produtos de um cliente
router.delete('/clients/:id/produtos',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('produtos').isArray().withMessage('Produtos deve ser um array')
  ],
  clienteController.removeProdutos
);

export default router; 