import { Request, Response, NextFunction } from "express";
import sequelize from "../database/database";
import Fornecedor, { initFornecedorModel } from "../models/Fornecedor";
import { validationResult } from "express-validator";
initFornecedorModel(sequelize);

export const FornecedorController = {
    async registrar(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const { nome, situacao } = req.body;
            await Fornecedor.registrar({ nome, situacao });
            res.status(201).json({ msg: "Fornecedor cadastrado com sucesso" });

        } catch (error) {
            console.error("Erro ao registrar fornecedor:", error);
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

            const { nome, situacao } = req.body;
            const id = parseInt(req.params.id);

            const resultado = await Fornecedor.atualizar({ id, nome, situacao });

            if (resultado[0] === 0) {
                res.status(404).json({ error: "Fornecedor não encontrado ou dados iguais aos já existentes." });
            } else {
                res.status(200).json({ msg: "Fornecedor atualizado com sucesso." });
            }

        } catch (error) {
            console.error("Erro ao atualizar fornecedor:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    },

    async apagar(req: Request, res: Response): Promise<void> {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }

            const id = parseInt(req.params.id);
            const resultado = await Fornecedor.apagar(id);

            if (resultado === 0) {
                res.status(404).json({error: "Fornecedor não encontrado"});
            } else {
                res.status(200).json({msg: "Fornecedor apagado"});
            }

        } catch (error) {
            console.error("Erro ao tentar apagar o fornecedor:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}