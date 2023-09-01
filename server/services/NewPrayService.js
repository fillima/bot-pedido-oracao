// Estados da conversa
const NOME = 1;
const MOTIVO = 2;

// Armazenamento temporário dos dados do usuário
let motivo = '';
let nome = '';
let step = '';

class NewPrayService {
    async pray(bot, msg) {
      try {
        const chatId = msg.chat.id;

        // Remova o listener 'message' anterior (se houver)
        bot.removeListener('message', this.messageListener);
        
        step = await this.newName(bot, chatId, msg);

        this.messageListener = async (message) => {
            if (step === NOME) {
                step = await this.newReason(bot, chatId, message);
            } else if (step === MOTIVO) {
                await this.sendMessage(bot, chatId, message);
            }
        };

        bot.on('message', this.messageListener);
      } catch (error) {
        console.error(error);
      }
    }

    async newName(bot, chatId, msg) {
        let message = `Olá ${msg.from.first_name}, digite o nome de quem você gostaria que recebesse oração.`;

        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        return NOME;
    }

    async newReason(bot, chatId, msg) {
        await bot.sendMessage(chatId, "Ótimo! Agora envie o motivo de oração.");
        nome = msg.text;
        return MOTIVO;
    }

    async sendMessage(bot, chatId, msg) {
        motivo = msg.text;
        await bot.sendMessage(chatId, `Pedido de oração concluído:\n\n*Por quem vamos orar:* ${nome}\n\n*Motivo:* ${motivo}\n\nEnviaremos sua mensagem para o grupo *Todos IPUS*, para que possamos orar juntos`, {parse_mode: 'Markdown'});

        // Enviar os dados para um grupo específico
        const grupoId = process.env.GROUPID; // Substitua pelo ID do grupo real
        await bot.sendMessage(grupoId, `#PedidoOração:\n\n*Por quem orar:* ${nome}\n\n*Motivo:* ${motivo}\n\n*Enviado por:* ${msg.from.first_name} ${msg.from.last_name}`, {parse_mode: 'Markdown'});
        motivo = '';
        nome = '';
        step = '';
    }
  }
  
  module.exports = NewPrayService;
  