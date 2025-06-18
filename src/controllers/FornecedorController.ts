import { Request, Response, NextFunction } from "express";
import Fornecedor from "../models/Fornecedor";
import {authMiddleware} from "../middlewares/auth";
import sequelize from "../database/database";
import { initFornecedorModel } from "../models/Fornecedor";
initFornecedorModel(sequelize);

export const FornecedorController = {
    
}