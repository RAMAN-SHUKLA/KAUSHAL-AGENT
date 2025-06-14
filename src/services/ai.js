import { HfInference } from "@huggingface/inference";

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateJobDescription(title, requirements) {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    console.error("Hugging Face API Key is not set.");
    return `**Job Title:** ${title}\n\n**Key Responsibilities:**\n- Based on the requirements: ${requirements}, the AI would generate a full job description here.\n\n**Qualifications:**\n- The AI would list required qualifications based on the provided details.\n\n*Please set your VITE_HUGGINGFACE_API_KEY in the .env file to enable live AI generation.*`;
  }

  const prompt = `Generate a comprehensive and engaging job description for a "${title}" position.\n\n  The basic requirements are: ${requirements}.\n\n  The description should include the following sections:\n  - Role Overview\n  - Key Responsibilities\n  - Required Skills & Qualifications\n  - Preferred Qualifications\n  - What We Offer\n\n  Format the output clearly using markdown.`;

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return `Error generating AI description. Please try again. Details: ${error.message}`;
  }
}

export async function parseResume(text) {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    console.error("Hugging Face API Key is not set.");
    return {
      personal_info: {},
      skills: [],
      experience: [],
      education: [],
      total_experience_years: 0
    };
  }

  const prompt = `Parse this resume and extract structured information:\n\nResume Text: ${text}\n\nExtract and return JSON with:\n{\n  "personal_info": {\n    "name": "",\n    "email": "",\n    "phone": "",\n    "location": ""\n  },\n  "skills": [],\n  "experience": [\n    {\n      "position": "",\n      "company": "",\n      "duration": "",\n      "responsibilities": []\n    }\n  ],\n  "education": [\n    {\n      "degree": "",\n      "institution": "",\n      "year": ""\n    }\n  ],\n  "total_experience_years": 0\n}`;

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Resume Parsing Error:", error);
    return {
      error: error.message
    };
  }
}

export async function calculateMatchScore(candidateProfile, jobRequirements) {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    console.error("Hugging Face API Key is not set.");
    return {
      overall_score: 0,
      skills_match: 0,
      experience_match: 0,
      education_match: 0,
      analysis: {
        strengths: [],
        gaps: [],
        recommendation: ""
      }
    };
  }

  const prompt = `Analyze job-candidate compatibility and return match scores:\n\nJob Requirements:\n- Title: ${jobRequirements.title}\n- Requirements: ${jobRequirements.requirements}\n- Experience: ${jobRequirements.experience}\n\nCandidate Profile:\n- Skills: ${candidateProfile.skills.join(', ')}\n- Experience: ${candidateProfile.experience_years} years\n- Current Position: ${candidateProfile.current_position}\n- Education: ${candidateProfile.education}\n\nReturn JSON with scores (0-100):\n{\n  "overall_score": 0,\n  "skills_match": 0,\n  "experience_match": 0,\n  "education_match": 0,\n  "analysis": {\n    "strengths": [],\n    "gaps": [],\n    "recommendation": ""\n  }\n}`;

  try {
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Match Score Calculation Error:", error);
    return {
      error: error.message
    };
  }
}