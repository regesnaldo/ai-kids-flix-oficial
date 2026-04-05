export interface AgentDefinition { 
  id: string; 
  name: string; 
  dimension: string; 
  level: string; 
  faction: string; 
  season: number; 
  personality: { 
    tone: string; 
    values: string[]; 
    approach: string; 
  }; 
  visualPrompt: string; 
  laboratoryTask: string; 
  badge: { 
    name: string; 
    description: string; 
    icon: string; 
  }; 
  recommendedVideos: string[]; 
}