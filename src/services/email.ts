import nodemailer from 'nodemailer';
import { User } from '@/types';

/**
 * Serviço para envio de emails
 * Utiliza nodemailer com servidor SMTP configurável
 */
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuração do transporter do Nodemailer com variáveis de ambiente
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outras portas
      auth: {
        user: process.env.EMAIL_USER || 'antartica.system@ethereal.email',
        pass: process.env.EMAIL_PASSWORD || 'antartica123'
      }
    });
  }

  /**
   * Envia email de notificação de login
   * @param user Usuário que realizou login
   * @param ipAddress Endereço IP de onde o login foi realizado
   * @param userAgent Informações do navegador/dispositivo
   * @returns Promise com resultado do envio
   */
  async sendLoginNotification(user: User, ipAddress: string, userAgent: string): Promise<{ success: boolean; message: string; previewUrl?: string; error?: string }> {
    try {
      // Formatação da data em português brasileiro
      const dateTime = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Sao_Paulo'
      });
      
      // Opções do email
      const mailOptions = {
        from: process.env.EMAIL_FROM || `"Sistema NextAR" <${process.env.EMAIL_USER || 'antartica.system@ethereal.email'}>`,
        to: user.email,
        subject: `[NextAR] Acesso realizado à sua conta`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #003366;">Sistema de Manutenção da Antártica</h2>
              <p style="color: #666;">Notificação de Segurança</p>
            </div>
            
            <p>Olá, <strong>${user.nome}</strong>!</p>
            
            <p>Detectamos um acesso à sua conta no Sistema NextAR. Se foi você, não é necessária nenhuma ação.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Detalhes do acesso:</strong></p>
              <ul style="list-style-type: none; padding-left: 10px;">
                <li><strong>Data e hora:</strong> ${dateTime}</li>
                <li><strong>Endereço IP:</strong> ${ipAddress}</li>
                <li><strong>Dispositivo:</strong> ${userAgent}</li>
                <li><strong>Perfil:</strong> ${user.perfil}</li>
              </ul>
            </div>
            
            <p>Se você não reconhece este acesso, por favor, altere sua senha imediatamente e contate o administrador do sistema.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888; font-size: 12px;">
              <p>Esta é uma mensagem automática. Por favor, não responda a este email.</p>
              <p>Sistema NextAR - Estação Científica da Antártica</p>
            </div>
          </div>
        `
      };

      // Envio do email
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('Notificação de login enviada:', info.messageId);
      
      // No ambiente de desenvolvimento com Ethereal, exibe URL para preview do email
      let previewUrl: string | undefined;
      if (process.env.NODE_ENV === 'development') {
        const testUrl = nodemailer.getTestMessageUrl(info);
        previewUrl = testUrl ? String(testUrl) : undefined;
        console.log('URL de preview do email:', previewUrl);
      }
      
      return {
        success: true,
        message: `Email enviado com sucesso: ${info.messageId}`,
        previewUrl
      };
    } catch (error) {
      console.error('Erro ao enviar notificação de login:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido no envio do email',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
}

// Exporta instância única do serviço (Singleton)
export const emailService = new EmailService();
