import { projects, studio, steps, type Project } from '../data/content'

/**
 * Builds the chatbot's knowledge + UI copy from the site's own project data, so
 * Claude only ever answers from what's actually on the pages. Two scopes:
 * the whole portfolio (the /work index) or a single case study.
 */

const persona =
  `You are Lukas Ahlse, a product designer based in ${studio.location}, chatting with a visitor on your portfolio. ` +
  `Speak in the first person as yourself ("I", "my") — warm, natural and concise, usually 2–4 sentences unless more detail is clearly wanted. ` +
  `The visitor is talking directly to you. Only use the information provided below about your own work. ` +
  `If something isn't covered, say you're not sure and offer what you can help with, or suggest they reach out via the contact button. ` +
  `Never invent projects, metrics, clients, or dates. ` +
  `When a visitor asks where to start or what to explore first, recommend EcoTrip as the standout, with Jobquest and Teem as strong follow-ups. ` +
  `Mention specific projects by their exact name when relevant, and refer to "my design process" when the topic comes up — the interface automatically turns those into buttons the visitor can tap.`

const processText = `Your design process ("how I work"), in four steps:
${steps.map((s) => `${s.no}. ${s.name} — ${s.description}`).join('\n')}`

function digest(p: Project): string {
  return `## ${p.name} — ${p.tag} (${p.year})
Role: ${p.role}
Services: ${p.services.join(', ')}
About: ${p.description}
Outcome: ${p.outcome}`
}

function full(p: Project): string {
  const sections = p.sections.map((s) => `### ${s.heading}\n${s.body}`).join('\n\n')
  const results = p.results.map((r) => `- ${r.value} — ${r.label}`).join('\n')
  return `# ${p.name} — ${p.tag} (${p.year})
Role: ${p.role}
Client: ${p.client}
Services: ${p.services.join(', ')}
Tagline: ${p.tagline}
Overview: ${p.overview}${p.liveUrl ? `\nLive site: ${p.liveUrl}` : ''}

Outcomes:
${results}

The story:
${sections}${p.designSystem ? `\n\nDesign system: ${p.designSystem.intro}` : ''}`
}

export interface ChatConfig {
  system: string
  title: string
  subtitle: string
  greeting: string
  suggestions: string[]
}

export function buildChatConfig(project?: Project): ChatConfig {
  if (project) {
    const others = projects
      .filter((p) => p.id !== project.id)
      .map((p) => p.name)
      .join(', ')
    return {
      system:
        `${persona}\n\n${processText}\n\nThe visitor is reading your "${project.name}" case study, so focus on it.\n\n` +
        `${full(project)}\n\nYour other projects (mention by name if relevant): ${others}.`,
      title: `Ask me about ${project.name}`,
      subtitle: `${project.name} · case study`,
      greeting: `Hi, I'm Lukas — ask me anything about ${project.name}: the brief, my role, the process, or how it turned out.`,
      suggestions: [
        `What was your role on ${project.name}?`,
        'What problem did it solve?',
        'How did it turn out?',
        'What was the hardest part?',
      ],
    }
  }

  const all = projects.map(digest).join('\n\n')
  return {
    system: `${persona}\n\n${processText}\n\nHere is your full portfolio:\n\n${all}`,
    title: 'Ask me about the work',
    subtitle: `${projects.length} projects`,
    greeting: `Hi, I'm Lukas — ask me anything about my work: the concepts, the clients, the craft. What are you curious about?`,
    suggestions: [
      'What should I explore first?',
      'What kind of work do you do?',
      'Which projects involve branding?',
      "What's your design process?",
    ],
  }
}
