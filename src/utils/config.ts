import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// URLs de busca do LinkedIn
export const SEARCH_URLS = [
  'https://www.linkedin.com/search/results/content/?keywords=%22angular%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22frontend%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22front-end%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22node%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sid=M6N&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22react%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
  'https://www.linkedin.com/search/results/content/?keywords=%22javascript%22%20%2B%20%22latam%22%20%2B%20%22remote%22&origin=GLOBAL_SEARCH_HEADER&sortBy=%22date_posted%22',
];

export const DATA_FILE = 'results.json';

// Verificar e validar variáveis de ambiente
const requiredEnvVars = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  LINKEDIN_EMAIL: process.env.LINKEDIN_EMAIL,
  LINKEDIN_PASSWORD: process.env.LINKEDIN_PASSWORD,
};

// Função para validar configurações
export const validateConfig = (): boolean => {
  const missingVars: string[] = [];

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach((varName) => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📝 Please set these variables in your .env file or GitHub Secrets');
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
};

// Exportar variáveis com valores padrão vazios para evitar undefined
export const TELEGRAM_BOT_TOKEN = requiredEnvVars.TELEGRAM_BOT_TOKEN || '';
export const TELEGRAM_CHAT_ID = requiredEnvVars.TELEGRAM_CHAT_ID || '';
export const LINKEDIN_EMAIL = requiredEnvVars.LINKEDIN_EMAIL || '';
export const LINKEDIN_PASSWORD = requiredEnvVars.LINKEDIN_PASSWORD || '';

// Log de configuração (sem expor valores sensíveis)
if (process.env.NODE_ENV !== 'test') {
  console.log('🔧 Configuration loaded:');
  console.log(`   - Search URLs: ${SEARCH_URLS.length} configured`);
  console.log(`   - Data file: ${DATA_FILE}`);
  console.log(`   - LinkedIn email: ${LINKEDIN_EMAIL ? LINKEDIN_EMAIL.substring(0, 3) + '***' : 'NOT_SET'}`);
  console.log(`   - LinkedIn password: ${LINKEDIN_PASSWORD ? '***' : 'NOT_SET'}`);
  console.log(`   - Telegram bot token: ${TELEGRAM_BOT_TOKEN ? TELEGRAM_BOT_TOKEN.substring(0, 10) + '***' : 'NOT_SET'}`);
  console.log(`   - Telegram chat ID: ${TELEGRAM_CHAT_ID ? TELEGRAM_CHAT_ID.substring(0, 5) + '***' : 'NOT_SET'}`);
}
