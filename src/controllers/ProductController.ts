import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op, QueryTypes } from 'sequelize';
import { Produto } from '../models/Produto';
import { Categoria } from '../models/Categoria';

class ProductController {
  /**
   * Lista todos os produtos
   */
  async index(req: Request, res: Response): Promise<void> {
    try {
      console.log('Iniciando listagem de produtos...');
      
      const { page = 1, limit = 10, categoria_id, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = { ativo: true };

      // Filtro por categoria
      if (categoria_id) {
        whereClause.categoria_id = categoria_id;
      }

      // Busca por nome ou código
      if (search) {
        whereClause[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows: produtos } = await Produto.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome']
          }
        ],
        order: [['nome', 'ASC']],
        limit: Number(limit),
        offset: offset
      });

      console.log('Produtos encontrados:', produtos.length);

      res.json({
        success: true,
        data: produtos,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Busca um produto específico por ID
   */
  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id, {
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome', 'descricao']
          }
        ]
      });

      if (!produto) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: produto
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Cria um novo produto
   */
  async store(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { nome, categoria_id, quantidade_estoque, valor, vendapreco, descricao } = req.body;

      // Verifica se a categoria existe
      const categoria = await Categoria.findByPk(categoria_id);
      if (!categoria) {
        res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
        return;
      }

      const novoProduto = await Produto.create({
        nome: nome.trim(),
        categoria_id,
        quantidade_estoque: Number(quantidade_estoque) || 0,
        valor: Number(valor),
        vendapreco: Number(vendapreco) || 0,
        descricao: descricao?.trim() || null,
        ativo: true
      });

      // Busca o produto criado com a categoria
      const produtoCriado = await Produto.findByPk(novoProduto.id, {
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: produtoCriado
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  /**
   * Atualiza um produto existente
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const { nome, categoria_id, quantidade_estoque, valor, vendapreco, descricao, ativo } = req.body;

      const produto = await Produto.findByPk(id);

      if (!produto) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
        return;
      }

      // Se a categoria foi alterada, verifica se ela existe
      if (categoria_id && categoria_id !== produto.categoria_id) {
        const categoria = await Categoria.findByPk(categoria_id);
        if (!categoria) {
          res.status(404).json({
            success: false,
            error: 'Categoria não encontrada'
          });
          return;
        }
      }

      await produto.update({
        nome: nome?.trim() || produto.nome,
        categoria_id: categoria_id || produto.categoria_id,
        quantidade_estoque: quantidade_estoque !== undefined ? Number(quantidade_estoque) : produto.quantidade_estoque,
        valor: valor !== undefined ? Number(valor) : produto.valor,
        vendapreco: vendapreco !== undefined ? Number(vendapreco) : produto.vendapreco,
        descricao: descricao?.trim() || produto.descricao,
        ativo: ativo !== undefined ? ativo : produto.ativo
      });

      // Busca o produto atualizado com a categoria
      const produtoAtualizado = await Produto.findByPk(id, {
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome']
          }
        ]
      });

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: produtoAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Remove um produto (soft delete)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
        return;
      }

      // Soft delete - apenas marca como inativo
      await produto.update({ ativo: false });

      res.json({
        success: true,
        message: 'Produto removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualiza o estoque de um produto
   */
  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const { quantidade, tipo } = req.body; // tipo: 'entrada' ou 'saida'

      const produto = await Produto.findByPk(id);

      if (!produto) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
        return;
      }

      let novaQuantidade = produto.quantidade_estoque;

      if (tipo === 'entrada') {
        novaQuantidade += Number(quantidade);
      } else if (tipo === 'saida') {
        novaQuantidade -= Number(quantidade);
        
        if (novaQuantidade < 0) {
          res.status(400).json({
            success: false,
            error: 'Quantidade insuficiente em estoque'
          });
          return;
        }
      } else {
        res.status(400).json({
          success: false,
          error: 'Tipo deve ser "entrada" ou "saida"'
        });
        return;
      }

      await produto.update({ quantidade_estoque: novaQuantidade });

      res.json({
        success: true,
        message: `Estoque atualizado com sucesso. Nova quantidade: ${novaQuantidade}`,
        data: {
          id: produto.id,
          nome: produto.nome,
          quantidade_anterior: produto.quantidade_estoque,
          quantidade_atual: novaQuantidade,
          tipo_movimento: tipo
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Busca produtos com estoque baixo
   */
  async lowStock(req: Request, res: Response): Promise<void> {
    try {
      const { limite = 10 } = req.query;

      const produtos = await Produto.findAll({
        where: {
          ativo: true,
          quantidade_estoque: {
            [Op.lte]: Number(limite)
          }
        },
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nome']
          }
        ],
        order: [['quantidade_estoque', 'ASC']]
      });

      res.json({
        success: true,
        data: produtos,
        total: produtos.length,
        limite_estoque: Number(limite)
      });
    } catch (error) {
      console.error('Erro ao buscar produtos com estoque baixo:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Busca fornecedores de um produto
   */
  async getProductSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Verifica se o produto existe
      const produto = await Produto.findByPk(id);
      if (!produto) {
        res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
        return;
      }

      // Busca os fornecedores através da tabela de relacionamento
      const sequelize = Produto.sequelize;
      const fornecedores = await sequelize!.query(`
        SELECT f.id, f.nome, f.email, f.telefone, f.tempo_entrega, f.situacao
        FROM fornecedores f
        INNER JOIN produto_fornecedores pf ON f.id = pf.fornecedor_id
        WHERE pf.produto_id = :produtoId AND f.situacao = 1
        ORDER BY f.nome
      `, {
        replacements: { produtoId: id },
        type: QueryTypes.SELECT
      });

      res.json({
        success: true,
        data: {
          produto: {
            id: produto.id,
            nome: produto.nome
          },
          fornecedores: fornecedores
        }
      });
    } catch (error) {
      console.error('Erro ao buscar fornecedores do produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

export default ProductController; 