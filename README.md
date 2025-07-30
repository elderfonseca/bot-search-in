# 🤖 Bot Search In

Automated bot that scrapes LinkedIn search results and sends new posts directly to Telegram with enhanced CI/CD support.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [GitHub Actions Setup](#github-actions-setup)
- [Scripts](#scripts)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔍 **Smart LinkedIn Scraping**: Searches for remote job posts in LATAM using multiple keywords
- 📱 **Telegram Integration**: Automatically sends new posts to your Telegram chat
- 🚀 **CI/CD Ready**: Optimized for GitHub Actions with proper caching and error handling
- 💾 **Duplicate Prevention**: Tracks sent posts to avoid duplicates
- 🔄 **Automatic Scheduling**: Runs twice daily (10 AM and 7 PM GMT-3)
- 🛡️ **Robust Error Handling**: Comprehensive logging and screenshot capture for debugging
- 🍪 **Session Persistence**: Maintains LinkedIn login sessions between runs
- 📊 **Detailed Monitoring**: Execution summaries and statistics

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- LinkedIn account
- Telegram bot token and chat ID

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/bot-search-in.git
   cd bot-search-in
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your credentials** (see [Configuration](#configuration) section)

## ⚙️ Configuration

Create a `.env` file in the root directory with the following content:

```env
# LinkedIn Credentials
LINKEDIN_EMAIL=your_email@example.com
LINKEDIN_PASSWORD=your_password_here

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890

# Optional: Set to true when running in CI
CI=false
```

### Getting Telegram Credentials

1. **Create a Telegram Bot:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow the instructions
   - Save the bot token

2. **Get Chat ID:**
   - Add your bot to a chat or group
   - Send a message to the bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find your chat ID in the response

### Search Keywords Configuration

The bot searches for posts containing these keyword combinations:
- `"angular" + "latam" + "remote"`
- `"frontend" + "latam" + "remote"`
- `"front-end" + "latam" + "remote"`
- `"node" + "latam" + "remote"`
- `"react" + "latam" + "remote"`
- `"javascript" + "latam" + "remote"`

You can modify these in `src/utils/config.ts`.

## 📖 Usage

### Local Development

```bash
# Test configuration
npm run test-config

# Run once
npm start

# Run with auto-restart (development)
npm run dev

# Run tests
npm test

# Build project
npm run build
```

### Manual Execution

```bash
# Single execution
npm start
```

The bot will:
1. ✅ Validate configuration
2. 🔐 Log into LinkedIn
3. 🔍 Scrape search results
4. 📱 Send new posts to Telegram
5. 💾 Save results to prevent duplicates

## 🤖 GitHub Actions Setup

### 1. Repository Secrets

Configure these secrets in your GitHub repository:
- `LINKEDIN_EMAIL`: Your LinkedIn email
- `LINKEDIN_PASSWORD`: Your LinkedIn password
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `TELEGRAM_CHAT_ID`: Your Telegram chat ID

**Settings → Secrets and variables → Actions → New repository secret**

### 2. Workflow Configuration

The bot includes two workflows:

#### Main Workflow (`scraper.yml`)
- 🕒 **Schedule**: Runs at 10 AM and 7 PM (GMT-3)
- 🔧 **Manual Trigger**: Can be run manually
- 💾 **Caching**: Optimized with dependency and cookie caching
- 📸 **Debug**: Automatic screenshot capture on errors

#### Debug Workflow (`debug-scraper.yml`)
- 🛠️ **Manual Only**: For troubleshooting
- 🔍 **Environment Check**: Validates all configurations
- 📞 **Connectivity Test**: Tests Telegram connection
- 📊 **Detailed Logging**: Enhanced debug information

### 3. Monitoring Executions

1. Go to **Actions** tab in your repository
2. Check execution logs and status
3. Download artifacts (screenshots, logs) if needed
4. Monitor Telegram for new job posts

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run the bot once |
| `npm run dev` | Run with auto-restart |
| `npm run test-config` | Test configuration and Telegram connectivity |
| `npm test` | Run unit tests |
| `npm run build` | Build TypeScript to JavaScript |

## 🧪 Testing

### Configuration Test
```bash
npm run test-config
```
This will:
- ✅ Validate environment variables
- 📱 Send test message to Telegram
- 🔍 Check all dependencies

### Unit Tests
```bash
npm test
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm start
```

## 🔧 Troubleshooting

### Common Issues

#### ❌ "Configuration validation failed"
**Cause**: Missing environment variables
**Solution**: 
1. Check your `.env` file
2. Verify GitHub Secrets are set correctly
3. Run `npm run test-config`

#### ❌ "Login verification failed"
**Cause**: LinkedIn login issues
**Solutions**:
1. Verify credentials are correct
2. Check if LinkedIn requires 2FA/captcha
3. Review login screenshots in artifacts
4. Try logging in manually first

#### ❌ "No posts found"
**Cause**: Various scraping issues
**Solutions**:
1. Check if LinkedIn changed their layout
2. Verify search URLs are working
3. Review debug screenshots
4. Check for LinkedIn rate limiting

#### ❌ "Failed to send message to Telegram"
**Cause**: Telegram API issues
**Solutions**:
1. Verify bot token and chat ID
2. Check if bot was removed from chat
3. Test with `npm run test-config`

### GitHub Actions Issues

#### Workflow not running
1. Check if workflows are enabled
2. Verify cron schedule format
3. Check repository permissions

#### Dependencies failing
1. Review system dependency installation logs
2. Check Node.js version compatibility
3. Clear npm cache if needed

#### Memory/timeout issues
1. Workflows have 15-minute timeout
2. Check screenshot artifacts for stuck processes
3. Consider reducing search URLs

### Debug Information

The bot automatically generates:
- 📸 **Screenshots**: Login state, errors, debug info
- 📄 **Logs**: Detailed execution information  
- 💾 **Data files**: Saved posts, cookies, configuration

Access these through GitHub Actions artifacts.

## 🏗️ Architecture

```
bot-search-in/
├── 📁 src/
│   ├── 📁 services/
│   │   ├── 🔐 login.ts          # LinkedIn authentication
│   │   ├── 🔍 scraper.ts        # Web scraping logic
│   │   └── 📱 telegram.ts       # Telegram integration
│   ├── 📁 utils/
│   │   ├── ⚙️ config.ts         # Configuration management
│   │   └── 💾 storage.ts        # File operations
│   └── 📋 index.ts              # Main execution flow
├── 📁 tests/                    # Unit tests
├── 📁 .github/workflows/        # CI/CD workflows
├── 📄 results.json              # Stored posts data
├── 🍪 cookies.json              # LinkedIn session
└── 📋 package.json              # Dependencies
```

### Key Components

- **🔍 Scraper**: Uses Puppeteer with optimized CI configurations
- **🔐 Login**: Robust LinkedIn authentication with multiple fallbacks
- **📱 Telegram**: Reliable message sending with error handling
- **💾 Storage**: JSON-based persistence for posts and sessions
- **⚙️ Config**: Environment validation and configuration management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Commit Convention

We follow this pattern:
- `feat:` - New features
- `fix:` - Bug fixes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `doc:` - Documentation
- `test:` - Tests

## 📊 Monitoring and Analytics

### Execution Metrics
- ⏱️ Execution time
- 📄 Posts found vs sent
- 💾 Database size
- 🔄 Success/failure rates

### Alerts
- 🚨 Critical errors sent to Telegram
- 📸 Debug screenshots on failures
- 📋 Detailed logs for troubleshooting

## 🔒 Security Considerations

- 🔐 Never commit `.env` files
- 🔑 Use GitHub Secrets for sensitive data
- 🍪 Cookies are cached but not exposed
- 📱 Telegram tokens are masked in logs
- 🛡️ Rate limiting prevents abuse

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. 📖 Check this README's troubleshooting section
2. 🔍 Review GitHub Actions logs and artifacts
3. 🧪 Run the debug workflow
4. 📱 Test with `npm run test-config`
5. 📝 Open an issue with:
   - Error messages
   - Screenshots (if any)
   - Configuration (without sensitive data)
   - Steps to reproduce

---

**⭐ If this project helps you find your next remote job, consider giving it a star!**