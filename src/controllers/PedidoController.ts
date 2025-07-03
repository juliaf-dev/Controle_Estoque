import { Request, Response } from "express";
import sequelize from "../database/database";
import Pedido, { initPedidoModel } from "../models/Pedido";
import { validationResult } from "express-validator";
import Produto from '../models/Produto';
import Fornecedor from '../models/Fornecedor';
import Categoria from '../models/Categoria';

// Inicializa o model
initPedidoModel(sequelize);

// Função para calcular data de recebimento
function calcularDataRecebimento(tempoEntrega: number): string {
  const hoje = new Date();
  const dias = tempoEntrega || 7;
  const dataRecebimento = new Date(hoje.getTime() + (dias * 24 * 60 * 60 * 1000));
  return dataRecebimento.toLocaleDateString('pt-BR');
}

export const PedidoController = {
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        nome,
        valor,
        tipo,
        produto_id,
        quantidade,
        data_entrega,
        cliente_id,
        fornecedor_id,
      } = req.body;

      // Se for venda, dar baixa no estoque
      if (tipo === 'venda') {
        const produto = await Produto.findByPk(produto_id);
        if (!produto) {
          res.status(404).json({ error: 'Produto não encontrado' });
          return;
        }
        if (produto.quantidade_estoque < quantidade) {
          res.status(400).json({ error: 'Estoque insuficiente para a venda' });
          return;
        }
        await produto.update({ quantidade_estoque: produto.quantidade_estoque - quantidade });
      }

      const pedidoData: any = {
        nome,
        valor,
        tipo,
        quantidade,
        data_entrega,
        cliente_id,
        fornecedor_id,
        status: 'a-caminho', // Adiciona o status padrão
      };

      // Só adiciona produto_id se não for undefined
      if (produto_id !== undefined) {
        pedidoData.produto_id = produto_id;
      }

      await Pedido.registrar(pedidoData);

      res.status(201).json({ msg: "Pedido registrado com sucesso" });
    } catch (error: any) {
      console.error("Erro ao registrar pedido:", error);
      console.error("Detalhes do erro:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ error: "Erro interno do servidor", details: error.message });
    }
  },

  async atualizar(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const id = parseInt(req.params.id);
      const dados = req.body;

      const resultado = await Pedido.atualizar(id, dados);

      if (resultado[0] === 0) {
        res
          .status(404)
          .json({ error: "Pedido não encontrado ou dados inalterados." });
      } else {
        res.status(200).json({ msg: "Pedido atualizado com sucesso" });
      }
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async apagar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const resultado = await Pedido.apagar(id);

      if (resultado === 0) {
        res.status(404).json({ error: "Pedido não encontrado" });
      } else {
        res.status(200).json({ msg: "Pedido apagado com sucesso" });
      }
    } catch (error) {
      console.error("Erro ao apagar pedido:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async listar(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await Pedido.findAll({
        order: [['createdAt', 'DESC']]
      });

      // Buscar dados relacionados para cada pedido
      const pedidosFormatados = await Promise.all(pedidos.map(async (pedido) => {
        const pedidoData = pedido.toJSON();
        
        // Buscar fornecedor
        let fornecedor = null;
        if (pedidoData.fornecedor_id) {
          fornecedor = await Fornecedor.findByPk(pedidoData.fornecedor_id);
        }
        
        // Buscar produto e categoria
        let produto = null;
        let categoria = null;
        if (pedidoData.produto_id) {
          produto = await Produto.findByPk(pedidoData.produto_id);
          if (produto && produto.categoria_id) {
            categoria = await Categoria.findByPk(produto.categoria_id);
          }
        }

        return {
          id: pedidoData.id,
          nome: pedidoData.nome,
          valor: pedidoData.valor,
          quantidade: pedidoData.quantidade,
          status: pedidoData.status,
          tipo: pedidoData.tipo,
          data: new Date((pedidoData as any).createdAt).toLocaleDateString('pt-BR'),
          createdAt: pedidoData.createdAt,
          dataRecebimento: calcularDataRecebimento(fornecedor?.tempo_entrega || 7),
          produto: produto?.nome || pedidoData.nome,
          categoria: categoria?.nome || 'N/A',
          fornecedor: fornecedor?.nome || 'N/A',
          emailFornecedor: fornecedor?.email || '',
          telefoneFornecedor: fornecedor?.telefone || '',
          tempoEntrega: fornecedor?.tempo_entrega || 7,
          custoTotal: parseFloat(pedidoData.valor.toString()) * pedidoData.quantidade,
          cliente_id: pedidoData.cliente_id,
          fornecedor_id: pedidoData.fornecedor_id
        };
      }));

      res.status(200).json(pedidosFormatados);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async buscarPorId(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        res.status(404).json({ error: "Pedido não encontrado" });
        return;
      }

      const agora = new Date();
      let diasRestantes: number | null = null;
      if (pedido.data_entrega) {
        const dataEntrega = new Date(pedido.data_entrega);
        const diffMs = dataEntrega.getTime() - agora.getTime();
        diasRestantes = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      }

      res.status(200).json({
        ...pedido.toJSON(),
        tempo_estimado_entrega_dias: diasRestantes,
      });
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async receber(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        res.status(404).json({ error: 'Pedido não encontrado' });
        return;
      }
      if (pedido.status === 'recebido') {
        res.status(400).json({ error: 'Pedido já está marcado como recebido' });
        return;
      }
      // Buscar produto pelo ID
      let produto = null;
      if (pedido.produto_id !== null && pedido.produto_id !== undefined) {
        produto = await Produto.findByPk(pedido.produto_id);
      }
      if (!produto) {
        // Se não existir, criar novo produto (campos mínimos)
        produto = await Produto.create({
          nome: pedido.nome,
          categoria_id: 1, // Ajuste se necessário
          quantidade_estoque: pedido.quantidade,
          valor: pedido.valor,
          vendapreco: pedido.valor, // Usar o mesmo valor como preço de venda padrão
          ativo: true
        });
      } else {
        // Se existir, somar a quantidade recebida ao estoque
        await produto.update({ quantidade_estoque: produto.quantidade_estoque + pedido.quantidade });
      }
      // Atualizar status do pedido
      await pedido.update({ status: 'recebido' });
      res.status(200).json({ msg: 'Pedido marcado como recebido e produto atualizado/adicionado', produto });
    } catch (error) {
      console.error('Erro ao marcar pedido como recebido:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async cancelar(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        res.status(404).json({ error: 'Pedido não encontrado' });
        return;
      }
      if (pedido.status === 'cancelada') {
        res.status(400).json({ error: 'Pedido já está cancelado' });
        return;
      }
      await pedido.update({ status: 'cancelada' });
      res.status(200).json({ msg: 'Pedido cancelado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
};
