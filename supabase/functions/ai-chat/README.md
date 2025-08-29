# AI Chat Edge Function

This Supabase Edge Function handles all AI-related operations for WisdomWise app, securely managing OpenRouter API calls.

## Features

- **Chat Completions**: AI therapy conversations
- **Connection Testing**: Verify API connectivity
- **Model Information**: Get available AI models
- **Secure**: API keys stored in environment variables
- **CORS Enabled**: Works with React Native apps

## Environment Variables

Set in Supabase Dashboard > Project Settings > Edge Functions > Environment Variables:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## API Usage

### Chat Completion
```javascript
POST /functions/v1/ai-chat
{
  "action": "completion",
  "messages": [
    {"role": "user", "content": "Hello, I'm feeling anxious today"}
  ],
  "model": "google/gemini-flash-1.5", // optional
  "maxTokens": 500, // optional
  "temperature": 0.7 // optional
}
```

### Test Connection
```javascript
POST /functions/v1/ai-chat
{
  "action": "test"
}
```

### Get Models
```javascript
POST /functions/v1/ai-chat
{
  "action": "models"
}
```

## Response Format

```javascript
{
  "success": true|false,
  "message": "AI response content", // for completion
  "error": "Error message", // if success=false
  "usage": { // for completion
    "prompt_tokens": 150,
    "completion_tokens": 100,
    "total_tokens": 250
  }
}
```

## Deployment

```bash
# Deploy to Supabase
supabase functions deploy ai-chat
```

## Security Features

- API keys never exposed to client
- CORS properly configured
- Input validation
- Error handling
- Rate limiting (via OpenRouter)