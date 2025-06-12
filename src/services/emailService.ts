// src/services/emailService.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true se estiver usando porta 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const enviarEmailRecuperacao = async (email: string, token: string): Promise<void> => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperação de Senha',
            html: `
                <h1>Recuperação de Senha</h1>
                <p>Use o código abaixo para redefinir sua senha:</p>
                <h2 style="background: #f4f4f4; padding: 10px; display: inline-block;">${token}</h2>
                <p>Este código expira em 1 hora.</p>
                <p>Se você não solicitou esta alteração, ignore este e-mail.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('E-mail de recuperação enviado com sucesso.');
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        throw new Error('Falha ao enviar e-mail de recuperação');
    }
};
