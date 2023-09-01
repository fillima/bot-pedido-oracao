// Estados da conversa
const NOME = 1;
const MOTIVO = 2;

// Armazenamento temporário dos dados do usuário
const userState = {};

class NewPrayService {
    async pray(bot, msg) {
      try {
        const chatId = msg.chat.id;
        userState[chatId] = {};
        await this.newName(bot, chatId, msg);

        bot.on('message', (message) => {
            if (userState[chatId].state === NOME) {
                this.newReason(bot, chatId, message);
            } else if (userState[chatId].state === MOTIVO) {
                this.sendMessage(bot, chatId, message);
            }

            // Limpar os dados do usuário
            delete userState[chatId];
        })
      } catch (error) {
        console.error(error);
      }
    }

    async newName(bot, chatId, msg) {
        let message = `Olá ${msg.from.first_name}, digite o nome de quem você gostaria que recebesse oração.`;

        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        userState[chatId].state = NOME;
    }

    async newReason(bot, chatId, msg) {
        await bot.sendMessage(chatId, "Ótimo! Agora envie o motivo de oração.");
        userState[chatId].nome = msg.text;
        userState[chatId].state = MOTIVO;
    }

    async sendMessage(bot, chatId, msg) {
        userState[chatId].motivo = msg.text;
        await bot.sendMessage(chatId, `Pedido de oração concluído:\n\n*Por quem vamos orar:* ${userState[chatId].nome}\n\n*Motivo:* ${userState[chatId].motivo}\n\nEnviaremos sua mensagem para o grupo *Todos IPUS*, para que possamos orar juntos`, {parse_mode: 'Markdown'});

        // Enviar os dados para um grupo específico
        const grupoId = process.env.GROUPID; // Substitua pelo ID do grupo real
        await bot.sendMessage(grupoId, `#PedidoOração:\n\n*Por quem orar:* ${userState[chatId].nome}\n\n*Motivo:* ${userState[chatId].motivo}\n\n*Enviado por:* ${msg.from.first_name} ${msg.from.last_name}`, {parse_mode: 'Markdown'});
    }
  }
  
  module.exports = NewPrayService;
  