# ModCraftAI - AI-Powered Minecraft Mod Creator

ModCraftAI is a complete web application that uses AI to help developers create Minecraft plugins and mods. It features a modern React frontend with a Node.js backend, integrating multiple AI services for code generation.

## 🚀 Features

### ✨ Enhanced Core Features
- **📝 Complete Project Generation**: Generate full plugin/mod projects with all files (Java code, plugin.yml, config.yml, README.md)
- **🤖 Multiple AI Models**: Choose from Claude-3.5-Sonnet, GPT-4o, and Gemini-1.5-Pro for different coding styles
- **📦 Smart Export System**: Download complete plugin packages as ZIP files with proper structure
- **💬 Natural Language Prompts**: Just describe what you want - "Create a teleportation plugin with homes and warps"
- **🎨 Visual Builder**: Drag-and-drop interface for creating mod components
- **🌐 Multiple Platforms**: Support for Bukkit, Spigot, Paper, Forge, Fabric, and Quilt
- **🔍 Code Analysis**: AI-powered code explanation and optimization
- **📁 Template Library**: Pre-built templates for common mod patterns
- **🗨️ Real-time Chat**: Interactive AI assistant with enhanced project generation

### 🔐 Authentication Features
- **📧 Email/Password**: Traditional account creation and login
- **🌍 Social Login**: Sign in with Google, GitHub, or Discord
- **🔒 Secure Sessions**: Protected user data and project storage
- **🎯 User Profiles**: Personalized experience and project history

### 💰 Monetization Features
- **💰 Coin System**: Users earn coins by watching ads
- **📅 Subscription Plans**: Pro plans with unlimited AI generations
- **📺 Ad Integration**: Adsterra ad serving for free users
- **💳 PayPal Payments**: Secure subscription payments

### 🎨 UI/UX Features
- **Modern Design**: Beautiful Tailwind CSS with shadcn/ui components
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching support
- **Real-time Updates**: Live coin balance and generation status
- **Interactive Components**: Rich form controls and feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality component library
- **Wouter** - Lightweight routing
- **Tanstack Query** - Data fetching and caching
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icon set

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Passport.js** - Authentication
- **Express Session** - Session management
- **Drizzle ORM** - Database toolkit
- **Zod** - Schema validation

### AI Services
- **Claude-3.5-Sonnet** - Latest Anthropic model with advanced reasoning
- **GPT-4o** - OpenAI's most capable model for code generation
- **Gemini-1.5-Pro** - Google's creative AI with long context understanding
- **Smart Model Selection** - Choose the best AI for your specific task
- **Enhanced Prompts** - Natural language understanding for complex requests

### Database
- **In-Memory Storage** - Development-ready mock storage
- **PostgreSQL Ready** - Production database support via Drizzle

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ModCraftAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   # AI API Keys (optional for development - will use mock services)
   ANTHROPIC_API_KEY=your-anthropic-api-key
   OPENAI_API_KEY=your-openai-api-key
   GEMINI_API_KEY=your-gemini-api-key
   
   # Session secret
   SESSION_SECRET=your-secret-key
   
   # Ad service (optional)
   ADSTERRA_PUBLISHER_ID=your-publisher-id
   ADSTERRA_ZONE_ID=your-zone-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🎯 Usage Guide

### Getting Started
1. **Create Account**: Sign up with email and password
2. **Free Trial**: Get 7 days of unlimited AI generations
3. **Choose Platform**: Select Bukkit, Spigot, Forge, etc.
4. **Build Your Mod**: Use visual builder or AI chat

### Visual Builder
- **Drag Components**: Add blocks, items, commands from the sidebar
- **Configure Properties**: Edit component settings in the properties panel
- **Generate Code**: Click "Generate Code" to create Java code
- **Export**: Download your completed plugin/mod

### AI Chat Interface
- **Natural Language**: Describe what you want to build
- **Multiple Models**: Choose between Claude, GPT, or Gemini
- **Interactive Help**: Ask questions and get explanations
- **Code Optimization**: Get performance improvements

### Code Preview
- **Syntax Highlighting**: Color-coded Java code
- **Documentation**: Auto-generated setup instructions
- **Analysis**: Code quality insights and suggestions
- **Export Options**: Download as .java files

## 🏗️ Architecture

### Project Structure
```
ModCraftAI/
├── client/              # React frontend
│   └── src/
│       ├── components/  # UI components
│       ├── pages/       # Route components
│       ├── hooks/       # Custom hooks
│       └── lib/         # Utilities
├── server/              # Node.js backend
│   ├── services/        # AI service integrations
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database layer
│   └── index.ts         # Server entry point
└── shared/              # Shared types and schemas
    └── schema.ts        # Database schema
```

### Database Schema
- **Users**: Authentication, coins, subscriptions
- **Projects**: User mod projects and settings
- **Templates**: Pre-built mod templates
- **AI Generations**: Generated code history
- **Ad Views**: Coin earning tracking

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/projects` - Get user projects
- `POST /api/ai/generate` - Generate mod code
- `POST /api/ads/view` - Record ad view for coins

## 🚀 Deployment

### Development
The application is configured for easy development with:
- Mock AI services (no API keys needed)
- In-memory database
- Hot reloading
- Error overlays

### Production Setup
For production deployment:

1. **Database**: Set up PostgreSQL and update DATABASE_URL
2. **AI Services**: Add real API keys for Claude, GPT, Gemini
3. **Payment**: Configure PayPal client credentials
4. **Ads**: Set up Adsterra publisher account
5. **Build**: Run `npm run build`
6. **Deploy**: Use your preferred hosting platform

### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=AI...
SESSION_SECRET=strong-random-secret
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
ADSTERRA_PUBLISHER_ID=...
ADSTERRA_ZONE_ID=...
```

## 🧪 Testing

### Development Testing
- All AI services have mock implementations
- Sample data is pre-seeded
- No external dependencies required
- Full feature testing available locally

### User Testing Flow
1. Register new account (gets 7-day trial)
2. Create new project
3. Use visual builder or AI chat
4. Generate and export code
5. Test ad system for earning coins

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Use TypeScript for type safety
- Follow existing code style
- Add JSDoc comments for functions
- Test your changes locally
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- Check this README for common questions
- Review the code comments and examples
- Test with the mock services first

### Known Issues
- Requires Node.js 18+ for full compatibility
- Some dependencies may require build tools on Windows
- AI API rate limits apply in production

### Development Notes
- The application uses mock services by default
- Real AI APIs are only needed for production
- Database is in-memory for development simplicity
- All major features are functional without external services

## 🎉 Congratulations!

Your AI-powered Minecraft mod creation platform is now complete and ready to use! The application includes:

✅ Full-featured React frontend with modern UI  
✅ Complete Node.js backend with AI integrations  
✅ Mock services for easy development  
✅ User authentication and project management  
✅ AI code generation with multiple models  
✅ Visual builder for drag-and-drop mod creation  
✅ Monetization with ads and subscriptions  
✅ Responsive design for all devices  
✅ Production-ready architecture  

Start building amazing Minecraft mods with the power of AI! 🚀

---

**Built with ❤️ using modern web technologies and AI**
