import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Categoria } from '../models/Categoria';

class CategoryController {
  /**
   * Lista todas as categorias
   */
  async index(req: Request, res: Response): Promise<void> {
    try {
      const categorias = await Categoria.findAll({
        where: { ativo: true },
        order: [['nome', 'ASC']]
      });

      res.json({
        success: true,
        data: categorias,
        total: categorias.length
      });
    } catch (error) {
      console.error('Erro ao listar categorias:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  
  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: categoria
      });
    } catch (error) {
      console.error('Erro ao buscar categoria:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Cria uma nova categoria
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

      const { nome, descricao } = req.body;

      // Verifica se já existe uma categoria com o mesmo nome
      const categoriaExistente = await Categoria.findOne({
        where: { nome: nome.trim() }
      });

      if (categoriaExistente) {
        res.status(409).json({
          success: false,
          error: 'Já existe uma categoria com este nome'
        });
        return;
      }

      const novaCategoria = await Categoria.create({
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        ativo: true
      });

      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: novaCategoria
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualiza uma categoria existente
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
      const { nome, descricao, ativo } = req.body;

      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
        return;
      }

      // Se o nome foi alterado, verifica se já existe outra categoria com o mesmo nome
      if (nome && nome.trim() !== categoria.nome) {
        const categoriaExistente = await Categoria.findOne({
          where: { 
            nome: nome.trim(),
            id: { [Op.ne]: id }
          }
        });

        if (categoriaExistente) {
          res.status(409).json({
            success: false,
            error: 'Já existe uma categoria com este nome'
          });
          return;
        }
      }

      await categoria.update({
        nome: nome?.trim() || categoria.nome,
        descricao: descricao?.trim() || categoria.descricao,
        ativo: ativo !== undefined ? ativo : categoria.ativo
      });

      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: categoria
      });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Remove uma categoria (soft delete)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
        res.status(404).json({
          success: false,
          error: 'Categoria não encontrada'
        });
        return;
      }

      // Soft delete - apenas marca como inativa
      await categoria.update({ ativo: false });

      res.json({
        success: true,
        message: 'Categoria removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

export default CategoryController; 