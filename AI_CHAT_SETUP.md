# AI Chat Setup Guide

Your AI chat feature is now fully implemented! Here's how to get it working:

## 🔑 Step 1: Get OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Navigate to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key (starts with `sk-or-...`)

## ⚙️ Step 2: Configure API Key

Open `src/config/constants.ts` and replace:

```typescript
OPENROUTER_API_KEY: 'YOUR_API_KEY_HERE'
```

With your actual API key:

```typescript
OPENROUTER_API_KEY: 'sk-or-v1-xxxxxxxxxxxxx'
```

## 🚀 Step 3: Test the Implementation

1. Run your app: `npm start`
2. Navigate to Home → "Start guided session"
3. Try sending a message
4. Verify you get AI responses with turtle personality

## ✅ Features Implemented

**✅ Real AI Integration**
- OpenRouter.ai API with Claude Haiku model
- Turtle personality system prompt
- Context-aware conversations (last 10 turns)

**✅ Message Persistence** 
- AsyncStorage for local message history
- Conversations persist between app sessions
- Automatic loading of previous chats

**✅ Rate Limiting**
- 50 messages per day (configurable)
- Visual indicators when approaching limit
- Graceful limit-reached messaging
- Daily reset at midnight

**✅ Error Handling**
- Fallback responses when API fails
- Network error detection
- Graceful degradation
- User-friendly error messages

**✅ UI Enhancements**
- Loading indicators
- Rate limit status in header
- Warning badges at 80%+ usage
- Typing indicators

## 🔧 Configuration Options

### Change Daily Limit
In `src/config/constants.ts`:
```typescript
DEFAULT_DAILY_LIMIT: 100, // Change from 50 to 100
```

### Change AI Model
```typescript
AI_MODEL: 'anthropic/claude-3-haiku', // Fast and cheap
// or
AI_MODEL: 'anthropic/claude-3.5-sonnet', // More capable but expensive
```

### Enable Debug Mode
```typescript
DEBUG: {
  LOG_API_CALLS: true, // Log API requests
  MOCK_API_RESPONSES: true, // Test without API key
}
```

## 🐛 Troubleshooting

**"API key not configured"**
- Check your API key in `constants.ts`
- Make sure it starts with `sk-or-`

**"Rate limit exceeded"**
- This is OpenRouter's rate limit, not ours
- Wait a few minutes or add credits to your account

**"Insufficient credits"**
- Add credits to your OpenRouter account
- Claude Haiku is very cheap (~$0.25 per million tokens)

**Messages not persisting**
- Check device storage permissions
- Try clearing app data and restarting

## 💰 Cost Estimation

With Claude Haiku model:
- Average message: ~200 tokens
- Cost: ~$0.0001 per message
- 50 messages/day = ~$0.005/day per user
- Very affordable for MVP!

## 🔄 Migration Path

Your storage is designed for easy upgrades:
- AsyncStorage → SQLite when you need advanced features
- Add user accounts later without breaking existing chats
- Scale rate limits based on user tiers

## 🎯 Next Steps

1. **Test thoroughly** with different conversation types
2. **Monitor costs** in OpenRouter dashboard  
3. **Gather user feedback** on turtle personality
4. **Consider premium features** (higher limits, better models)

The system is production-ready! Your users can now have real conversations with your gentle turtle AI guide. 🐢✨