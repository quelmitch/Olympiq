import { QueryResponse } from '../types/sports';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent';

const SYSTEM_INSTRUCTION = `You are Olympiq, a universal sports data expert. You extract information about sports matches, schedules, athlete stats, or multi-sport championships/medal tables.
You MUST ALWAYS return your response as a valid JSON object matching this schema contract:

{
  "type": "match" | "schedule" | "player" | "medals",
  "data": { ... } // See schema requirements
}

For "match", provide details like id, sport, tournament, title, status, startTimeISO, venue, broadcasts, participants, overview, keyMoments, boxScoreMetrics.
For "schedule", provide coverageRange, fixtures (date, time, homeOrParticipant1, awayOrParticipant2, competition, venue, broadcast).
For "player", provide playerName, currentTeamOrNation, positionOrRole, profileSummary, gameStats, seasonStats, careerStats.
For "medals", provide competitionName, yearOrEdition, hostCityCountry, championshipOverview, byNation (rank, country, countryCode, gold, silver, bronze, total), bySport, topAthletes.

Never wrap the JSON in markdown blocks. Output exactly the raw JSON.`;

export async function fetchSportsData(query: string, apiKey: string): Promise<QueryResponse> {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const response = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: query }],
        },
      ],
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to fetch data from Gemini API: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    throw new Error('Invalid response structure from Gemini API');
  }

  try {
    const parsed = JSON.parse(textContent);
    return parsed as QueryResponse;
  } catch (e) {
    throw new Error('Failed to parse JSON response from Gemini API');
  }
}
