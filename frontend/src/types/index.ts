export interface MusicSuggestion {
  genres: string[];
  sources: {
    name: string;
    url: string;
    description: string;
  }[];
  recommendations: string[];
}

export interface Cocktail {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  musical_ambiance: string;
  image_prompt: string;
  music_suggestions?: MusicSuggestion;
  user_request: string;
  created_at: string;
  is_favorite: boolean;
}

export interface CocktailRequest {
  user_request: string;
}

export interface CocktailResponse {
  success: boolean;
  cocktail?: Cocktail;
  error?: string;
}

export interface CocktailFilters {
  search: string;
  filter: 'all' | 'favorites' | 'recent';
  page: number;
}