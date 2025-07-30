import { sendTelegramMessage } from './src/services/telegram';
import { validateConfig } from './src/utils/config';

/**
 * Script para testar a configuração do bot
 */
async function testConfiguration() {
  console.log('🧪 Testing Bot Configuration...\n');

  // Teste 1: Validar variáveis de ambiente
  console.log('1️⃣ Testing environment variables...');
  const configValid = validateConfig();

  if (!configValid) {
    console.log('❌ Configuration test failed');
    process.exit(1);
  }

  // Teste 2: Testar conectividade com Telegram
  console.log('\n2️⃣ Testing Telegram connectivity...');
  try {
    const testMessage = `🧪 Test message from LinkedIn Scraper Bot\nTime: ${new Date().toISOString()}\nStatus: Configuration test successful! ✅`;
    await sendTelegramMessage(testMessage);
    console.log('✅ Telegram test message sent successfully');
  } catch (error) {
    console.error('❌ Failed to send test message to Telegram:', error);
    process.exit(1);
  }

  console.log('\n🎉 All tests passed! Bot is ready to run.');
}

// Executar testes
testConfiguration().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});
