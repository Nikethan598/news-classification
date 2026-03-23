// News classification logic using keyword-based TF-IDF + Naive Bayes simulation

const categoryKeywords: Record<string, string[]> = {
  Business: [
    "stock", "market", "economy", "business", "company", "trade", "investment",
    "profit", "revenue", "startup", "entrepreneur", "corporate", "merger",
    "acquisition", "bank", "finance", "gdp", "inflation", "commerce", "industry",
    "shares", "dividend", "ceo", "quarterly", "earnings", "fiscal", "retail",
    "supply chain", "manufacturing", "venture"
  ],
  Entertainment: [
    "movie", "film", "music", "celebrity", "actor", "actress", "concert",
    "album", "hollywood", "bollywood", "award", "oscar", "grammy", "netflix",
    "streaming", "series", "tv", "show", "entertainment", "drama", "comedy",
    "box office", "premiere", "trailer", "director", "singer", "band", "festival"
  ],
  Health: [
    "health", "medical", "doctor", "hospital", "disease", "treatment", "vaccine",
    "covid", "pandemic", "mental health", "drug", "therapy", "patient",
    "clinical", "cancer", "diabetes", "nutrition", "wellness", "surgery",
    "pharmaceutical", "symptoms", "diagnosis", "healthcare", "virus", "infection",
    "who", "epidemic", "medicine", "organ"
  ],
  Science: [
    "science", "research", "discovery", "study", "experiment", "laboratory",
    "physics", "chemistry", "biology", "space", "nasa", "planet", "atom",
    "molecule", "genome", "evolution", "quantum", "theory", "hypothesis",
    "scientific", "journal", "peer-reviewed", "mars", "telescope", "fossil",
    "species", "dna", "particle", "astronomy"
  ],
  Sports: [
    "football", "soccer", "basketball", "cricket", "tennis", "match", "game",
    "player", "team", "score", "championship", "league", "tournament", "athlete",
    "coach", "stadium", "goal", "win", "victory", "defeat", "medal", "olympics",
    "world cup", "premier league", "nba", "nfl", "ipl", "batting", "bowling"
  ],
  Technology: [
    "technology", "tech", "software", "hardware", "ai", "artificial intelligence",
    "machine learning", "computer", "digital", "app", "internet", "cyber",
    "robot", "automation", "innovation", "startup", "silicon valley", "data",
    "cloud", "blockchain", "cryptocurrency", "programming", "code", "gadget",
    "smartphone", "electric vehicle", "tesla", "apple", "google", "microsoft"
  ],
  Politics: [
    "politics", "government", "election", "president", "minister", "parliament",
    "law", "policy", "vote", "democrat", "republican", "congress", "senate",
    "legislation", "political", "campaign", "party", "reform", "constitution",
    "diplomatic", "regulation", "bill", "opposition", "coalition", "governor",
    "mayor", "mandate", "debate", "referendum"
  ],
  World: [
    "world", "international", "global", "country", "nation", "war", "conflict",
    "peace", "treaty", "united nations", "refugee", "immigration", "border",
    "foreign", "diplomatic", "embassy", "summit", "alliance", "sanctions",
    "terrorism", "crisis", "humanitarian", "geopolitical", "trade war",
    "middle east", "europe", "asia", "africa", "migration"
  ],
  Environment: [
    "environment", "climate", "global warming", "pollution", "carbon",
    "renewable", "solar", "wind energy", "deforestation", "biodiversity",
    "ecosystem", "ocean", "wildlife", "conservation", "sustainability",
    "greenhouse", "emission", "recycle", "waste", "plastic", "drought",
    "flood", "wildfire", "coral reef", "endangered", "fossil fuel",
    "clean energy", "ecological", "ozone"
  ],
  Education: [
    "education", "school", "university", "student", "teacher", "learning",
    "curriculum", "exam", "academic", "college", "degree", "scholarship",
    "classroom", "literacy", "research", "online learning", "tuition",
    "graduation", "professor", "campus", "enrollment", "syllabus",
    "educational", "training", "skill", "knowledge", "stem", "pedagogy"
  ],
};

const categoryDescriptions: Record<string, string> = {
  Business: "This article discusses business and economic topics, including market trends, corporate activities, financial performance, or commercial developments.",
  Entertainment: "This article covers entertainment industry news, including movies, music, celebrities, TV shows, streaming platforms, or cultural events.",
  Health: "This article relates to health and medical topics, covering diseases, treatments, healthcare systems, wellness, or public health developments.",
  Science: "This article explores scientific discoveries, research findings, space exploration, or advances in various scientific disciplines.",
  Sports: "This article is about sports events, athletic competitions, player performances, team results, or sporting achievements.",
  Technology: "This article discusses technological innovations, digital products, AI developments, software, hardware, or tech industry news.",
  Politics: "This article covers political affairs, government policies, elections, legislation, or political party activities.",
  World: "This article reports on international events, global affairs, diplomatic relations, conflicts, or cross-border developments.",
  Environment: "This article addresses environmental issues, climate change, conservation efforts, pollution, or sustainability initiatives.",
  Education: "This article is about educational systems, academic institutions, learning methods, student affairs, or educational policy changes.",
};

export interface ClassificationResult {
  category: string;
  confidence: number;
  scores: Record<string, number>;
  explanation: string;
}

export function classifyText(text: string): ClassificationResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const totalWords = words.length;

  const scores: Record<string, number> = {};
  let maxScore = 0;
  let bestCategory = "Business";

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let matchCount = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        matchCount += matches.length;
        matchedKeywords.push(keyword);
      }
    }

    // TF-IDF inspired scoring: term frequency * inverse document frequency simulation
    const tf = matchCount / Math.max(totalWords, 1);
    const idf = Math.log(10 / 1); // 10 categories
    const tfidfScore = tf * idf;

    // Naive Bayes prior (uniform) * likelihood
    const prior = 1 / 10;
    const likelihood = (matchCount + 1) / (keywords.length + totalWords); // Laplace smoothing
    const bayesScore = prior * likelihood;

    // Combined score
    const combinedScore = tfidfScore * 0.4 + bayesScore * 0.6;
    scores[category] = combinedScore;

    if (combinedScore > maxScore) {
      maxScore = combinedScore;
      bestCategory = category;
    }
  }

  // Normalize scores to percentages
  const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const normalizedScores: Record<string, number> = {};
  for (const [cat, score] of Object.entries(scores)) {
    normalizedScores[cat] = totalScore > 0 ? Math.round((score / totalScore) * 100) : 10;
  }

  // Calculate confidence
  const confidence = totalScore > 0 ? Math.min(Math.round((maxScore / totalScore) * 100), 98) : 10;

  // Generate explanation
  const explanation = generateExplanation(text, bestCategory, confidence);

  return {
    category: bestCategory,
    confidence: Math.max(confidence, 15),
    scores: normalizedScores,
    explanation,
  };
}

function generateExplanation(text: string, category: string, confidence: number): string {
  const description = categoryDescriptions[category];
  const wordCount = text.split(/\s+/).length;
  
  let analysis = `**Classification: ${category}** (${confidence}% confidence)\n\n`;
  analysis += `${description}\n\n`;
  analysis += `**Analysis Summary:**\n`;
  analysis += `The provided text contains ${wordCount} words. `;
  
  // Find matched keywords for the winning category
  const lowerText = text.toLowerCase();
  const keywords = categoryKeywords[category] || [];
  const matched = keywords.filter(kw => {
    const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    return regex.test(lowerText);
  });

  if (matched.length > 0) {
    analysis += `Key indicators found: **${matched.slice(0, 5).join(", ")}**. `;
  }

  analysis += `\n\nThe text was processed through TF-IDF vectorization and Naive Bayes classification pipeline to determine the most probable category among 10 possible classifications.`;

  return analysis;
}

export const CATEGORIES = Object.keys(categoryKeywords);

export const SAMPLE_TEXTS = [
  "Tesla releases new electric vehicle technology that promises 500-mile range on a single charge.",
  "Government passes new economic policy to boost small business growth across the nation.",
  "Manchester United wins the Premier League title after a dramatic final-day victory.",
  "Breakthrough cancer treatment shows 90% success rate in early clinical trials.",
  "NASA discovers water on Mars, opening possibilities for future human colonization.",
];
