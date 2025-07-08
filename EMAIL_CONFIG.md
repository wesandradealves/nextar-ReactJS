# Configuração do Sistema de Email para NextAR

## Sobre a Implementação

A funcionalidade de notificação de login por email foi implementada na versão 3.4.0 do NextAR. Este sistema envia um email ao usuário sempre que um login é realizado em sua conta, incluindo detalhes como:

- Data e hora do acesso
- Endereço IP
- Informações do dispositivo/navegador
- Perfil do usuário

## Tecnologia Utilizada

- **Nodemailer**: Biblioteca JavaScript/TypeScript para envio de emails
- **Gmail SMTP**: Configurado com senha de aplicativo para envio real de emails

## Como Testar a Configuração Atual com Gmail

A implementação atual utiliza uma conta Gmail real com senha de aplicativo:

1. Realize login no sistema NextAR com qualquer usuário
2. Um email real será enviado para o endereço de email do usuário
3. Verifique a caixa de entrada (ou pasta de spam) para ver a notificação
4. O email contém detalhes de segurança do login realizado

Exemplo de email recebido:
![Exemplo de Email de Notificação](https://i.imgur.com/example.png)

## Como Testar em Ambiente de Desenvolvimento

Para fins de teste e revisão, a implementação utiliza o [Ethereal Email](https://ethereal.email/), que é um serviço de captura de email para desenvolvimento. Este serviço:

1. **Não envia emails reais** para as caixas de entrada dos destinatários
2. **Captura os emails** para visualização em uma interface web
3. **Fornece URL de preview** para cada email enviado (exibido no console)

### Passos para Testar:

1. Realize login no sistema NextAR com qualquer usuário
2. Observe o console do servidor para ver o log com URL de preview
3. Acesse a URL fornecida para visualizar o email que seria enviado

Exemplo de log no console:
```
Notificação de login enviada: <20210715123456.abcdef@ethereal.email>
URL de preview do email: https://ethereal.email/message/ABCdEfGhIjKlMnOpQrStUv
```

## Configuração do Gmail com Senha de Aplicativo

A configuração atual usa uma conta do Gmail com senha de aplicativo. Abaixo estão os passos para criar sua própria senha de aplicativo para usar com o Gmail:

### Passo 1: Ativar Verificação em Duas Etapas

1. Acesse [sua Conta do Google](https://myaccount.google.com/)
2. No menu de navegação à esquerda, clique em **Segurança**
3. Na seção "Como você faz login no Google", selecione **Verificação em duas etapas**
4. Clique em **Começar** e siga as instruções para ativar a verificação em duas etapas
5. Confirme com seu telefone e conclua a configuração

### Passo 2: Criar Senha de Aplicativo

1. Depois de configurar a verificação em duas etapas, volte para a [página de Segurança](https://myaccount.google.com/security)
2. Clique em **Senhas de app** (se não encontrar esta opção, verifique se a verificação em duas etapas está ativada)
3. Na parte inferior, em "Selecionar app", escolha **Outro (Nome personalizado)**
4. Digite um nome para identificar o aplicativo (por exemplo, "NextAR Sistema")
5. Clique em **Gerar**
6. A senha de 16 caracteres será exibida (sem espaços). Copie esta senha
7. Clique em **Concluído**

### Passo 3: Configurar no .env.local

Adicione as informações da sua conta Gmail no arquivo `.env.local`:

```bash
# Email settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=seu-email@gmail.com
EMAIL_PASSWORD=sua-senha-de-aplicativo
EMAIL_FROM=Sistema NextAR <seu-email@gmail.com>
EMAIL_SECURE=true
```

**Importante**: Nunca compartilhe sua senha de aplicativo. Ela concede acesso à sua conta para enviar emails.

## Configuração para Ambiente de Produção

Para usar com um provedor real (como Gmail, SendGrid, Amazon SES, etc.), edite o arquivo `.env.local` com as configurações apropriadas:

```
# Email settings
EMAIL_HOST=smtp.seuservidor.com
EMAIL_PORT=587
EMAIL_USER=seu-email@provedor.com
EMAIL_PASSWORD=sua-senha-segura
EMAIL_FROM=Nome do Sistema <seu-email@provedor.com>
EMAIL_SECURE=false
```

## Considerações de Segurança

Em um ambiente de produção, considere:

1. Usar variáveis de ambiente para credenciais SMTP (como já implementado)
2. Implementar rate limiting para evitar spam
3. Usar um serviço transacional como SendGrid ou Amazon SES para volumes maiores
4. Adicionar opção para o usuário desativar notificações de login
5. Armazenar logs de notificações enviadas para auditoria
6. **Nunca compartilhar ou comitar as senhas de aplicativo** no controle de versão

## Alternativa: Uso do Ethereal Email para Testes

Para desenvolvedores que desejam testar sem enviar emails reais, o Ethereal Email é uma alternativa:

```bash
# Email settings
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=antartica.system@ethereal.email
EMAIL_PASSWORD=antartica123
EMAIL_FROM=Sistema NextAR <antartica.system@ethereal.email>
EMAIL_SECURE=false
```

Com essa configuração, os emails não serão enviados fisicamente, mas poderão ser visualizados através de URLs de preview exibidas no console.
