# com-chat 🧠✨

Welcome to com-chat, the AI suite for professionals that need function, form,
simplicity, and speed. Powered by the latest models from 12 vendors and
open-source servers, `com-chat` offers best-in-class Chats,
[Beams](https://github.com/smart-window/com-chat/issues/470),
and [Calls](https://github.com/smart-window/com-chat/issues/354) with AI personas,
visualizations, coding, drawing, side-by-side chatting, and more -- all wrapped in a polished UX.

Stay ahead of the curve with com-chat. 🚀 Pros & Devs love com-chat. 🤖

Or fork & run on Vercel

## 👉 Key Features ✨

| ![Advanced AI](https://img.shields.io/badge/Advanced%20AI-32383e?style=for-the-badge&logo=ai&logoColor=white) | ![100+ AI Models](https://img.shields.io/badge/100%2B%20AI%20Models-32383e?style=for-the-badge&logo=ai&logoColor=white) | ![Flow-state UX](https://img.shields.io/badge/Flow--state%20UX-32383e?style=for-the-badge&logo=flow&logoColor=white) | ![Privacy First](https://img.shields.io/badge/Privacy%20First-32383e?style=for-the-badge&logo=privacy&logoColor=white) | ![Advanced Tools](https://img.shields.io/badge/Fun%20To%20Use-f22a85?style=for-the-badge&logo=tools&logoColor=white) |  
|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------| 
| **Chat**<br/>**Call**<br/>**Beam**<br/>**Draw**, ...                                                          | Local & Cloud<br/>Open & Closed<br/>Cheap & Heavy<br/>Google, Mistral, ...                                              | Attachments<br/>Diagrams<br/>Multi-Chat<br/>Mobile-first UI                                                          | Stored Locally<br/>Easy self-Host<br/>Local actions<br/>Data = Gold                                                    | AI Personas<br/>Voice Modes<br/>Screen Capture<br/>Camera + OCR                                                      |

You can easily configure 100s of AI models in com-chat:

| **AI models**       | _supported vendors_                                                                                                                                                                                                             |
|:--------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Opensource Servers  | [LocalAI](https://localai.com) (multimodal) · [Ollama](https://ollama.com/) · [Oobabooga](https://github.com/oobabooga/text-generation-webui)                                                                                   |
| Local Servers       | [LM Studio](https://lmstudio.ai/)                                                                                                                                                                                               |
| Multimodal services | [Azure](https://azure.microsoft.com/en-us/products/ai-services/openai-service) · [Google Gemini](https://ai.google.dev/) · [OpenAI](https://platform.openai.com/docs/overview)                                                  |
| Language services   | [Anthropic](https://anthropic.com) · [Groq](https://wow.groq.com/) · [Mistral](https://mistral.ai/) · [OpenRouter](https://openrouter.ai/) · [Perplexity](https://www.perplexity.ai/) · [Together AI](https://www.together.ai/) | 
| Image services      | [Prodia](https://prodia.com/) (SDXL)                                                                                                                                                                                            | 
| Speech services     | [ElevenLabs](https://elevenlabs.io) (Voice synthesis / cloning)                                                                                                                                                                 | 

Add extra functionality with these integrations:

| **More**     | _integrations_                                                                                                 |
|:-------------|:---------------------------------------------------------------------------------------------------------------| 
| Web Browse   | [Browserless](https://www.browserless.io/) · [Puppeteer](https://pptr.dev/)-based                              |
| Web Search   | [Google CSE](https://programmablesearchengine.google.com/)                                                     |
| Code Editors | [CodePen](https://codepen.io/pen/) · [StackBlitz](https://stackblitz.com/) · [JSFiddle](https://jsfiddle.net/) |
| Sharing      | [Paste.gg](https://paste.gg/) (Paste chats)                                                                    | 
| Tracking     | [Helicone](https://www.helicone.ai) (LLM Observability)                                                        | 

[//]: # (- [x] **Flow-state UX** for uncompromised productivity)

[//]: # (- [x] **AI Personas**: Tailor your AI interactions with customizable personas)

[//]: # (- [x] **Sleek UI/UX**: A smooth, intuitive, and mobile-responsive interface)

[//]: # (- [x] **Efficient Interaction**: Voice commands, OCR, and drag-and-drop file uploads)

[//]: # (- [x] **Privacy First**: Self-host and use your own API keys for full control)

[//]: # (- [x] **Advanced Tools**: Execute code, import PDFs, and summarize documents)

[//]: # (- [x] **Seamless Integrations**: Enhance functionality with various third-party services)

[//]: # (- [x] **Open Roadmap**: Contribute to the progress of com-chat)

<br/>

# 🧩 Develop

[//]: # (![TypeScript]&#40;https://img.shields.io/badge/TypeScript-007ACC?style=&logo=typescript&logoColor=white&#41;)

[//]: # (![React]&#40;https://img.shields.io/badge/React-61DAFB?style=&logo=react&logoColor=black&#41;)

[//]: # (![Next.js]&#40;https://img.shields.io/badge/Next.js-000000?style=&logo=vercel&logoColor=white&#41;)

To download and run this Typescript/React/Next.js project locally, the only prerequisite is Node.js with the `npm` package manager.
Clone this repo, install the dependencies (all local), and run the development server (which auto-watches the
files for changes):

```bash
git clone https://github.com/smart-window/com-chat.git
cd com-chat
npm install
npm run dev

# You will see something like:
#
#  ▲ Next.js 14.1.0
#  - Local: http://localhost:3000
#  ✓ Ready in 2.6s
```

The development app will be running on `http://localhost:3000`. Development builds have the advantage of not requiring
a build step, but can be slower than production builds. Also, development builds won't have timeout on edge functions.

## 🛠️ Deploy from source

The _production_ build of the application is optimized for performance and is performed by the `npm run build` command,
after installing the required dependencies.

```bash
# .. repeat the steps above up to `npm install`, then:
npm run build
next start --port 3000
```

The app will be running on the specified port, e.g. `http://localhost:3000`.

2023-2024 · Smart x [com-chat](https://comchat.io) · License: [MIT](LICENSE) · Made with 💙
