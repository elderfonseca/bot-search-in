import { readDataFromFile, writeDataToFile } from './utils/storage';
import { DATA_FILE, validateConfig } from './utils/config';
import { sendTelegramMessage } from './services/telegram';
import { scrapeLinkedInPosts } from './services/scraper';

/**
 * Main function to scrape LinkedIn posts and send them via Telegram.
 */
export const runBot = async (): Promise<void> => {
  console.log('🤖 Starting LinkedIn Scraper Bot...');
  console.log(`⏰ Started at: ${new Date().toISOString()}`);

  try {
    // Validar configuração antes de iniciar
    if (!validateConfig()) {
      throw new Error('Configuration validation failed');
    }

    console.log('🔍 Starting LinkedIn scraping process...');
    const startTime = Date.now();

    const newPosts = await scrapeLinkedInPosts();

    const scrapingTime = Date.now() - startTime;
    console.log(`⏱️  Scraping completed in ${scrapingTime}ms`);
    console.log(`📄 Found ${newPosts.length} posts`);

    if (newPosts.length === 0) {
      console.log('⚠️  No posts found. Possible reasons:');
      console.log('   - LinkedIn is blocking the requests');
      console.log('   - Login failed');
      console.log('   - Page structure changed');
      console.log('   - Search URLs returned no results');
      return;
    }

    // Ler posts salvos anteriormente
    const savedPosts = readDataFromFile(DATA_FILE);
    console.log(`💾 Found ${savedPosts.length} previously saved posts`);

    // Filtrar apenas posts novos
    const postsToSend = newPosts.filter((post) => !savedPosts.includes(post));
    console.log(`🆕 Found ${postsToSend.length} new posts to send`);

    if (postsToSend.length > 0) {
      console.log('📤 Sending new posts to Telegram...');

      let sentCount = 0;
      let failedCount = 0;

      for (const [index, post] of postsToSend.entries()) {
        try {
          console.log(`📨 Sending post ${index + 1}/${postsToSend.length}...`);

          // Truncar post se for muito longo (limite do Telegram é 4096 caracteres)
          const truncatedPost = post.length > 4000 ? post.substring(0, 4000) + '...\n\n[Post truncated due to length]' : post;

          await sendTelegramMessage(truncatedPost);
          sentCount++;

          // Aguardar entre envios para evitar rate limiting
          if (index < postsToSend.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        } catch (error) {
          console.error(`❌ Failed to send post ${index + 1}:`, error);
          failedCount++;
        }
      }

      if (sentCount > 0) {
        // Salvar todos os posts (antigos + novos) apenas se pelo menos um foi enviado
        const allPosts = [...savedPosts, ...postsToSend];
        writeDataToFile(DATA_FILE, allPosts);
        console.log(`💾 Updated data file with ${allPosts.length} total posts`);
      }

      console.log(`✅ Successfully sent ${sentCount}/${postsToSend.length} posts`);
      if (failedCount > 0) {
        console.log(`❌ Failed to send ${failedCount} posts`);
      }
    } else {
      console.log('ℹ️  No new posts to send');
    }

    const totalTime = Date.now() - startTime;
    console.log(`🏁 Bot execution completed in ${totalTime}ms`);
    console.log(`📊 Summary:`);
    console.log(`   - Total posts found: ${newPosts.length}`);
    console.log(`   - New posts: ${postsToSend.length}`);
    console.log(`   - Posts sent: ${postsToSend.length > 0 ? Math.min(postsToSend.length, newPosts.length) : 0}`);
  } catch (error) {
    console.error('💥 Critical error running bot:', error);

    // Tentar enviar mensagem de erro para o Telegram
    try {
      const errorMessage = `🚨 LinkedIn Scraper Bot Error\n\nTime: ${new Date().toISOString()}\nError: ${
        error instanceof Error ? error.message : 'Unknown error'
      }\n\nPlease check the logs for more details.`;
      await sendTelegramMessage(errorMessage);
    } catch (telegramError) {
      console.error('Failed to send error message to Telegram:', telegramError);
    }

    // Re-throw para que o processo falhe no CI
    throw error;
  }
};

// Executar apenas se este arquivo for executado diretamente
if (require.main === module) {
  runBot().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}
