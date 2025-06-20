import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import { Cliente } from '../models/Cliente';
import { Produto } from '../models/Produto';

class ClienteController {
  /**
   * Lista todos os clientes
   */
  async index(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = { ativo: true };

      // Busca por nome, email ou CPF
      if (search) {
        whereClause[Op.or] = [
          { nome: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { cpf: { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows: clientes } = await Cliente.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Produto,
            as: 'produtos',
            attributes: ['id', 'nome', 'codigo'],
            through: { attributes: [] }
          }
        ],
        order: [['nome', 'ASC']],
        limit: Number(limit),
        offset: offset
      });

      res.json({
        success: true,
        data: clientes,
        pagination: {
          total: count,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(count / Number(limit))
        }
      });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Busca um cliente específico por ID
   */
  async show(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await Cliente.findByPk(id, {
        include: [
          {
            model: Produto,
            as: 'produtos',
            attributes: ['id', 'nome', 'codigo', 'valor'],
            through: { attributes: [] }
          }
        ]
      });

      if (!cliente) {
        res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: cliente
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Cria um novo cliente
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

      const { nome, email, telefone, endereco, cpf, produtos } = req.body;

      // Verifica se já existe um cliente com o mesmo email
      const clienteExistente = await Cliente.findOne({
        where: { email }
      });

      if (clienteExistente) {
        res.status(409).json({
          success: false,
          error: 'Já existe um cliente com este email'
        });
        return;
      }

      // Verifica se já existe um cliente com o mesmo CPF (se fornecido)
      if (cpf) {
        const clienteCPF = await Cliente.findOne({
          where: { cpf }
        });

        if (clienteCPF) {
          res.status(409).json({
            success: false,
            error: 'Já existe um cliente com este CPF'
          });
          return;
        }
      }

      const novoCliente = await Cliente.create({
        nome: nome.trim(),
        email: email.trim(),
        telefone: telefone?.trim() || null,
        endereco: endereco?.trim() || null,
        cpf: cpf?.trim() || null,
        ativo: true
      });

      // Associa produtos se fornecidos
      if (produtos && Array.isArray(produtos)) {
        await novoCliente.setProdutos(produtos);
      }

      // Busca o cliente criado com os produtos
      const clienteCriado = await Cliente.findByPk(novoCliente.id, {
        include: [
          {
            model: Produto,
            as: 'produtos',
            attributes: ['id', 'nome', 'codigo'],
            through: { attributes: [] }
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: clienteCriado
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Atualiza um cliente existente
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
      const { nome, email, telefone, endereco, cpf, ativo, produtos } = req.body;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
        return;
      }

      // Verifica se o email já existe em outro cliente
      if (email && email !== cliente.email) {
        const clienteEmail = await Cliente.findOne({
          where: { email, id: { [Op.ne]: id } }
        });

        if (clienteEmail) {
          res.status(409).json({
            success: false,
            error: 'Já existe um cliente com este email'
          });
          return;
        }
      }

      // Verifica se o CPF já existe em outro cliente
      if (cpf && cpf !== cliente.cpf) {
        const clienteCPF = await Cliente.findOne({
          where: { cpf, id: { [Op.ne]: id } }
        });

        if (clienteCPF) {
          res.status(409).json({
            success: false,
            error: 'Já existe um cliente com este CPF'
          });
          return;
        }
      }

      await cliente.update({
        nome: nome?.trim() || cliente.nome,
        email: email?.trim() || cliente.email,
        telefone: telefone?.trim() || cliente.telefone,
        endereco: endereco?.trim() || cliente.endereco,
        cpf: cpf?.trim() || cliente.cpf,
        ativo: ativo !== undefined ? ativo : cliente.ativo
      });

      // Atualiza produtos se fornecidos
      if (produtos && Array.isArray(produtos)) {
        await cliente.setProdutos(produtos);
      }

      // Busca o cliente atualizado com os produtos
      const clienteAtualizado = await Cliente.findByPk(id, {
        include: [
          {
            model: Produto,
            as: 'produtos',
            attributes: ['id', 'nome', 'codigo'],
            through: { attributes: [] }
          }
        ]
      });

      res.json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: clienteAtualizado
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Remove um cliente (soft delete)
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
        return;
      }

      await cliente.update({ ativo: false });

      res.json({
        success: true,
        message: 'Cliente removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Adiciona produtos a um cliente
   */
  async addProdutos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { produtos } = req.body;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
        return;
      }

      if (!produtos || !Array.isArray(produtos)) {
        res.status(400).json({
          success: false,
          error: 'Lista de produtos é obrigatória'
        });
        return;
      }

      await cliente.addProdutos(produtos);

      const clienteAtualizado = await Cliente.findByPk(id, {
        include: [
          {
            model: Produto,
            as: 'produtos',
            attributes: ['id', 'nome', 'codigo'],
            through: { attributes: [] }
          }
        ]
      });

      res.json({
        success: true,
        message: 'Produtos adicionados com sucesso',
        data: clienteAtualizado
      });
    } catch (error) {
      console.error('Erro ao adicionar produtos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }

  /**
   * Remove produtos de um cliente
   */
  async removeProdutos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { produtos } = req.body;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        res.status(404).json({
          success: false,
          error: 'Cliente não encontrado'
        });
        return;
      }

      if (!produtos || !Array.isArray(produtos)) {
        res.status(400).json({
          success: false,
          error: 'Lista de produtos é obrigatória'
        });
        return;
      }

      await cliente.removeProdutos(produtos);

      const clienteAtualizado = await Cliente.findByPk(id, {
        include: [
          {
            model: Produto,
            as: 'produtos',
            attributes: ['id', 'nome', 'codigo'],
            through: { attributes: [] }
          }
        ]
      });

      res.json({
        success: true,
        message: 'Produtos removidos com sucesso',
        data: clienteAtualizado
      });
    } catch (error) {
      console.error('Erro ao remover produtos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor'
      });
    }
  }
}

export default ClienteController; 