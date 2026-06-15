# AULA VIVA IA - Implementation Guide

## 🚀 MVP Roadmap: Fastest Path to Flipbook AI Experience

### Phase 1: Basic MVP (1-2 days)
**Tools Used:**
- ✅ Next.js (already in project)
- ✅ Framer Motion (already installed)
- ✅ Browser Speech Synthesis (free, built-in)
- ✅ Unsplash API (free stock images)

**What you get:**
- Animated flipbook slides ✅ (already built)
- Voice narration ✅ (browser TTS)
- Image placeholders ✅ (unsplash)
- Responsive design ✅

---

### Phase 2: Enhanced Experience (3-5 days)
**Tools to add:**
- 🔄 ElevenLabs or Browser TTS (voice)
- 🔄 Replicate API (real-time AI images)
- 🔄 Anthropic/Claude API (dynamic content)

**What you get:**
- Real AI-generated images per block
- Natural voice narration
- Dynamic content generation

---

## 🛠️ Free & Low-Cost Tools Comparison

### Image Generation

| Tool | Speed | Cost | Quality | Integration |
|------|-------|------|---------|-------------|
| **Replicate + SDXL** | ~5s | $0.01/img | ⭐⭐⭐⭐ | Easy API |
| **Hugging Face** | ~8s | Free tier | ⭐⭐⭐⭐ | Medium |
| **DALL-E 3** | ~3s | $0.04/img | ⭐⭐⭐⭐⭐ | Easy but costly |
| **Unsplash** | Instant | Free | ⭐⭐⭐ | Very Easy |

### Voice Narration

| Tool | Speed | Cost | Quality | Integration |
|------|-------|------|---------|-------------|
| **Browser TTS** | Instant | Free | ⭐⭐⭐ | Instant |
| **ElevenLabs** | ~2s | $0.30/1000 chars | ⭐⭐⭐⭐⭐ | Easy API |
| **Google Cloud TTS** | ~1s | $0.016/1000 chars | ⭐⭐⭐⭐ | Medium |

### AI Content Generation

| Tool | Speed | Cost | Quality | Integration |
|------|-------|------|---------|-------------|
| **Claude API** | ~2s | Pay per token | ⭐⭐⭐⭐⭐ | Easy |
| **GPT-4** | ~2s | Pay per token | ⭐⭐⭐⭐⭐ | Very Easy |
| **Mock Data** | Instant | Free | ⭐⭐⭐ | Already done |

---

## 💡 Best Cost-Effective Stack for MENTE.AI

### Option A: Free Tier (Recommended Start)
```
Images: Unsplash (free) or placeholder gradients
Voice: Browser Speech Synthesis (free)
AI: Mock data → Claude later
Total: $0/month
```

### Option B: Low-Cost Professional
```
Images: Replicate SDXL ($0.01/block) = $0.05/lesson
Voice: ElevenLabs ($0.30/1000 chars) = $0.10/lesson
AI: Claude Haiku ($0.25/1M tokens) = $0.01/lesson
Total: ~$0.16/lesson = very cheap!
```

### Option C: Premium Experience
```
Images: DALL-E 3 ($0.04/block)
Voice: ElevenLabs Neural
AI: Claude Sonnet
Total: ~$0.50/lesson = still affordable
```

---

## 🎯 Implementation: Next.js Integration Guide

### 1. Adding Real AI Images (Replicate)

```typescript
// src/lib/imageGeneration.ts
const REPLICATE_API = process.env.REPLICATE_API_TOKEN;

export async function generateAIImage(prompt: string): Promise<string> {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'stability-ai/sdxl:...', // Stable Diffusion XL
      input: {
        prompt: `${prompt}, child-friendly illustration, soft colors, simple design`,
        num_inference_steps: 20,
        guidance_scale: 7.5
      }
    })
  });
  
  // Poll for result...
  return imageUrl;
}
```

### 2. Enhanced Voice with ElevenLabs

```typescript
// src/lib/voiceNarration.ts
export async function generateNarration(text: string, voiceId: string = 'EXAVITQ4Xr9q3Wu8TYL7') {
  const response = await fetch('/api/elevenlabs/speak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voiceId })
  });
  
  return response.json(); // Returns audio URL
}
```

### 3. AI Content Generation API

```typescript
// src/app/api/aula-viva/generate/route.ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(request: Request) {
  const { prompt } = await request.json();
  
  const message = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Create a flipbook lesson for a 7-year-old about: ${prompt}
      Return JSON with: title, subtitle, summary, and 5 blocks each with:
      title, content, emoji, imagePrompt (for AI image generation)`
    }]
  });
  
  return Response.json({ lesson: message.content });
}
```

---

## 🎨 Visual Enhancement: Adding More Magic

### 1. Animated Background (already done)
- Floating particles ✅
- Gradient orbs ✅
- Grid pattern ✅

### 2. Micro-Interactions to Add

```typescript
// Block entrance animations
const blockVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
  exit: { opacity: 0, x: -100, scale: 0.9 }
};

// Floating elements
function FloatingElements() {
  return (
    <AnimatePresence>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-cyan-400/30"
          animate={{
            y: [0, -100, 0],
            x: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </AnimatePresence>
  );
}
```

### 3. Sound Effects Layer

```typescript
// src/hooks/useSoundEffects.ts
export function useSoundEffects() {
  const playTransition = () => {
    const audio = new Audio('/sounds/page-flip.mp3');
    audio.volume = 0.3;
    audio.play();
  };
  
  const playSuccess = () => {
    const audio = new Audio('/sounds/success-chime.mp3');
    audio.volume = 0.5;
    audio.play();
  };
  
  return { playTransition, playSuccess };
}
```

---

## 📋 Checklist: Building Your MVP

### Today (Already Done ✅)
- [x] Basic flipbook component
- [x] Animated title
- [x] 5 explanation blocks
- [x] Voice narration (browser TTS)
- [x] Premium dark mode design
- [x] Responsive layout
- [x] Navigation integration

### This Week (Next Steps)
- [ ] Add Unsplash images to all mock lessons
- [ ] Add sound effects for transitions
- [ ] Create API endpoint for AI generation
- [ ] Add loading skeleton animations

### Next Month (Pro)
- [ ] Integrate Replicate for AI images
- [ ] Add ElevenLabs voice narration
- [ ] Connect Claude for dynamic content
- [ ] Add progress tracking database
- [ ] Create share/embed feature

---

## 💰 Cost Calculator

For 1000 lessons/month:

| Setup | Monthly Cost |
|-------|--------------|
| Free tier (mock + browser TTS) | $0 |
| Basic ($0.02/image + ElevenLabs) | ~$50 |
| Pro (DALL-E + Neural voice) | ~$200 |

---

## 🎓 Learning Resources

1. **Framer Motion**: https://www.framer.com/motion/
2. **Replicate SDK**: https://replicate.com/docs
3. **ElevenLabs Docs**: https://elevenlabs.io/docs
4. **Claude API**: https://docs.anthropic.com/

---

*This guide was created for MENTE.AI platform - AULA VIVA IA feature*
*Last updated: 2026-04-29*