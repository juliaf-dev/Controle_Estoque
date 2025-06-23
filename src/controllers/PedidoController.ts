import { Request, Response } from "express";
import sequelize from "../database/database";
import Pedido, { initPedidoModel } from "../models/Pedido";
import { validationResult } from "express-validator";

// Inicializa o model
initPedidoModel(sequelize);

export const PedidoController = {
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const {
        codigo,
        nome,
        valor,
        tipo,
        produto_id,
        data_entrega,
        cliente_id
      } = req.body;

      await Pedido.registrar({
        codigo,
        nome,
        valor,
        tipo,
        produto_id,
        data_entrega,
        cliente_id
      });

      res.status(201).json({ msg: "Pedido registrado com sucesso" });
    } catch (error) {
      console.error("Erro ao registrar pedido:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
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
        res.status(404).json({ error: "Pedido não encontrado ou dados inalterados." });
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
        const pedidos = await Pedido.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Erro ao listar pedidos:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}
};
