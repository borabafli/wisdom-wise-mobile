/**
 * Utility functions to convert technical confidence percentages 
 * into human-friendly language for better user experience
 */

export interface ConfidenceLabel {
  strength: string;
  description: string;
}

/**
 * Convert confidence value (0-1) to human-friendly pattern strength
 * Used for thinking patterns, cognitive distortions, etc.
 */
export function getPatternStrength(confidence: number): ConfidenceLabel {
  if (confidence >= 0.9) {
    return {
      strength: "Very strong pattern",
      description: "Clear and consistent"
    };
  } else if (confidence >= 0.8) {
    return {
      strength: "Strong pattern detected",
      description: "Well-established theme"
    };
  } else if (confidence >= 0.7) {
    return {
      strength: "Clear pattern",
      description: "Notable tendency"
    };
  } else if (confidence >= 0.6) {
    return {
      strength: "Emerging pattern",
      description: "Starting to show"
    };
  } else if (confidence >= 0.5) {
    return {
      strength: "Possible pattern",
      description: "Worth exploring"
    };
  } else {
    return {
      strength: "Subtle theme",
      description: "Gentle indication"
    };
  }
}

/**
 * Convert confidence value (0-1) to human-friendly insight clarity
 * Used for memory insights, long-term themes, etc.
 */
export function getInsightClarity(confidence: number): ConfidenceLabel {
  if (confidence >= 0.9) {
    return {
      strength: "Crystal clear insight",
      description: "Deep understanding"
    };
  } else if (confidence >= 0.8) {
    return {
      strength: "Clear insight",
      description: "Well-formed wisdom"
    };
  } else if (confidence >= 0.7) {
    return {
      strength: "Solid insight",
      description: "Meaningful discovery"
    };
  } else if (confidence >= 0.6) {
    return {
      strength: "Emerging understanding",
      description: "Growing awareness"
    };
  } else if (confidence >= 0.5) {
    return {
      strength: "Initial insight",
      description: "Early recognition"
    };
  } else {
    return {
      strength: "Gentle awareness",
      description: "Soft realization"
    };
  }
}

/**
 * Convert confidence value (0-1) to human-friendly strength assessment
 * Used for personal strengths, positive patterns, etc.
 */
export function getStrengthAssessment(confidence: number): ConfidenceLabel {
  if (confidence >= 0.9) {
    return {
      strength: "Core strength",
      description: "Foundational quality"
    };
  } else if (confidence >= 0.8) {
    return {
      strength: "Clear strength",
      description: "Notable asset"
    };
  } else if (confidence >= 0.7) {
    return {
      strength: "Solid strength",
      description: "Reliable quality"
    };
  } else if (confidence >= 0.6) {
    return {
      strength: "Developing strength",
      description: "Growing ability"
    };
  } else if (confidence >= 0.5) {
    return {
      strength: "Emerging strength",
      description: "Budding quality"
    };
  } else {
    return {
      strength: "Gentle strength",
      description: "Quiet capability"
    };
  }
}

/**
 * Convert confidence value (0-1) to human-friendly vision clarity
 * Used for vision insights, future self clarity, etc.
 */
export function getVisionClarity(confidence: number): ConfidenceLabel {
  if (confidence >= 0.9) {
    return {
      strength: "Vivid vision",
      description: "Crystal clear direction"
    };
  } else if (confidence >= 0.8) {
    return {
      strength: "Clear vision",
      description: "Strong sense of direction"
    };
  } else if (confidence >= 0.7) {
    return {
      strength: "Solid vision",
      description: "Good clarity"
    };
  } else if (confidence >= 0.6) {
    return {
      strength: "Emerging vision",
      description: "Taking shape"
    };
  } else if (confidence >= 0.5) {
    return {
      strength: "Initial vision",
      description: "Beginning to form"
    };
  } else {
    return {
      strength: "Gentle direction",
      description: "Soft guidance"
    };
  }
}

/**
 * Generic confidence converter - uses pattern strength as default
 */
export function getConfidenceDisplay(confidence: number, type: 'pattern' | 'insight' | 'strength' | 'vision' = 'pattern'): ConfidenceLabel {
  switch (type) {
    case 'insight':
      return getInsightClarity(confidence);
    case 'strength':
      return getStrengthAssessment(confidence);
    case 'vision':
      return getVisionClarity(confidence);
    case 'pattern':
    default:
      return getPatternStrength(confidence);
  }
}

/**
 * Get a short human-friendly confidence label (single phrase)
 */
export function getShortConfidenceLabel(confidence: number, type: 'pattern' | 'insight' | 'strength' | 'vision' = 'pattern'): string {
  return getConfidenceDisplay(confidence, type).strength;
}

/**
 * Get confidence description for longer displays
 */
export function getConfidenceDescription(confidence: number, type: 'pattern' | 'insight' | 'strength' | 'vision' = 'pattern'): string {
  return getConfidenceDisplay(confidence, type).description;
}