/**
 * Private Application Feedback Service
 *
 * Collects private feedback from Household users for internal product improvement.
 * Strictly confidential: Feedback is NOT published as merchant reviews, user reviews,
 * or public ratings.
 */

export interface BillScrapFeedbackSubmission {
  id: string;
  userId?: string;
  userName?: string;
  userPhone?: string;
  userType?: 'household' | 'merchant';
  satisfactionRating?: number; // 1 to 5 overall experience
  feedbackCategory?: string; // App experience, Scrap selling, etc.
  experienceRating?: string; // "Very helpful", "Helpful", "Okay", "Not very helpful", "Not helpful"
  primaryUses?: string[]; // "Selling scrap", "Checking scrap rates", etc.
  likedAspects?: string; // "What do you like about BillScrap?"
  problemsFaced?: string; // "Are you facing any problems?"
  improvements?: string; // "What should we improve?"
  description?: string; // Fallback or summary description
  voiceNoteUrl?: string; // Voice feedback recording audio URL or base64
  voiceDurationSeconds?: number;
  createdAt: string;
}

const STORAGE_KEY = 'billscrap_private_feedback_submissions';

export async function submitPrivateFeedback(
  feedback: Omit<BillScrapFeedbackSubmission, 'id' | 'createdAt'>
): Promise<{ success: boolean; id: string; message: string }> {
  // Simulate network latency for realistic submission feel
  await new Promise((resolve) => setTimeout(resolve, 600));

  const newEntry: BillScrapFeedbackSubmission = {
    ...feedback,
    id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const list: BillScrapFeedbackSubmission[] = existingRaw ? JSON.parse(existingRaw) : [];
    list.unshift(newEntry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Local storage write failed for private feedback:', err);
  }

  return {
    success: true,
    id: newEntry.id,
    message: 'Feedback recorded privately for product improvement.',
  };
}
