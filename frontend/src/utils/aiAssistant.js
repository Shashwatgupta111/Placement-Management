/**
 * Utility functions for AI Assistant integration
 */

export const AI_ASSISTANTS = {
  CHATGPT: {
    name: 'ChatGPT',
    baseUrl: 'https://chat.openai.com',
    queryParam: 'q'
  },
  GEMINI: {
    name: 'Gemini',
    baseUrl: 'https://gemini.google.com',
    queryParam: 'q'
  },
  CLAUDE: {
    name: 'Claude',
    baseUrl: 'https://claude.ai',
    queryParam: 'q'
  }
};

/**
 * Generates a learning prompt for AI assistant based on the skill
 * @param {string} skill - The skill name to learn
 * @returns {string} - Formatted prompt for AI assistant
 */
export const generateLearningPrompt = (skill) => {
  return `I want to learn ${skill} for software engineering interviews and job placement. Please provide:

1. A comprehensive roadmap to learn ${skill} from beginner to advanced level
2. Key concepts and topics I should focus on
3. Recommended resources (books, courses, tutorials)
4. Practice problems or projects to build proficiency
5. Common interview questions on ${skill}
6. Time estimation for learning this skill

Please structure your response in a clear, actionable way that helps me prepare for technical interviews and improve my job prospects.`;
};

/**
 * Creates an AI assistant URL with the learning prompt
 * @param {string} skill - The skill name to learn
 * @param {string} assistant - The AI assistant to use ('chatgpt' or 'gemini')
 * @returns {string} - Complete URL for AI assistant with prompt
 */
export const createAIAssistantUrl = (skill, assistant = 'gemini') => {
  const aiConfig = AI_ASSISTANTS[assistant.toUpperCase()];
  if (!aiConfig) {
    throw new Error(`Unsupported AI assistant: ${assistant}`);
  }

  const prompt = generateLearningPrompt(skill);
  const encodedPrompt = encodeURIComponent(prompt);
  
  return `${aiConfig.baseUrl}?${aiConfig.queryParam}=${encodedPrompt}`;
};

/**
 * Opens AI assistant with learning prompt in a new tab
 * @param {string} skill - The skill name to learn
 * @param {string} assistant - The AI assistant to use
 */
export const openAIAssistant = (skill, assistant = 'gemini') => {
  try {
    const url = createAIAssistantUrl(skill, assistant);
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.error('Failed to open AI assistant:', error);
    // Fallback to copying prompt to clipboard
    const prompt = generateLearningPrompt(skill);
    navigator.clipboard.writeText(prompt).then(() => {
      alert(`Learning prompt copied to clipboard! Paste it into your preferred AI assistant.\n\nSkill: ${skill}`);
    }).catch(() => {
      alert(`Failed to open AI assistant. Here's your learning prompt for ${skill}:\n\n${prompt}`);
    });
  }
};

/**
 * Gets available AI assistants
 * @returns {Array} - Array of available AI assistant info
 */
export const getAvailableAssistants = () => {
  return Object.entries(AI_ASSISTANTS).map(([key, config]) => ({
    id: key.toLowerCase(),
    name: config.name,
    baseUrl: config.baseUrl
  }));
};
