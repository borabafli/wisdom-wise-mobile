/**
 * Test utilities for quickly running through exercises during development
 */

export interface ExerciseTestData {
  exerciseType: string;
  sampleAnswers: string[];
  expectedSteps?: number;
}

export const EXERCISE_TEST_DATA: Record<string, ExerciseTestData> = {
  'breathing': {
    exerciseType: 'breathing',
    sampleAnswers: [
      "I've been feeling overwhelmed with work lately. My manager keeps piling on more projects and I'm working late every night. I feel like I can't catch my breath and I'm constantly anxious about meeting all these deadlines.",
      "When I'm stressed like this, I notice my chest gets really tight and my shoulders tense up. Sometimes I feel like I can't take deep breaths and my heart races. It's like my whole body is wound up and ready to snap.",
      "I really want to feel more centered and calm. I used to be able to handle pressure better, but lately everything feels overwhelming. I want to find a way to feel more grounded when things get hectic.",
      "That breathing exercise actually did help quite a bit. I can feel my shoulders relaxing and my chest opening up. The tight feeling is starting to ease and I feel more present in my body right now."
    ]
  },
  'automatic-thoughts': {
    exerciseType: 'automatic-thoughts', 
    sampleAnswers: [
      "I keep having this thought that I'm going to completely fail this presentation tomorrow. Even though I've been preparing for weeks, I can't shake this feeling that I'm going to forget everything I want to say and just stand there frozen.",
      "I'm convinced that everyone in the room will think I'm incompetent and don't belong in this role. I imagine them whispering about how they made a mistake hiring me and questioning my qualifications.",
      "This kind of thinking always happens to me before important events. I've noticed this pattern where I catastrophize and assume the worst possible outcome, even when there's no real evidence to support those fears.",
      "When I really think about it, maybe I'm being way too harsh on myself. I've given presentations before and they've gone well. My colleagues have given me positive feedback in the past, so this fear might not be based in reality.",
      "I think I could help myself by preparing a few key points really well and reminding myself of past successes. Maybe I could even practice with a friend or do some breathing exercises before the presentation to calm my nerves."
    ],
    expectedSteps: 5
  },
  'gratitude': {
    exerciseType: 'gratitude',
    sampleAnswers: [
      "I'm really grateful for my family's unwavering support, especially during this challenging time in my life. Even when I'm stressed or overwhelmed, they're always there to listen and offer encouragement. My mom calls me every week just to check in, and my sister always knows how to make me laugh when I'm feeling down.",
      "I appreciate having a warm, safe home to come back to every day. There's something so comforting about having my own space where I can relax and be myself. I love curling up on my couch with a cup of tea and just feeling grateful for this sanctuary I've created.",
      "I'm thankful for my physical health, especially after seeing friends struggle with illness this year. Being able to walk, exercise, and enjoy food feels like such a gift that I sometimes take for granted. I want to honor my body better by taking care of it.",
      "This gratitude practice is already making me feel more positive and grounded. It's helping me shift my focus from what's wrong or missing to what's actually going well in my life. I notice my mood lifting when I really pay attention to these good things."
    ]
  },
  'self-compassion': {
    exerciseType: 'self-compassion',
    sampleAnswers: [
      "I made a significant mistake at work today - I sent out a report with incorrect data to our biggest client. I've been beating myself up about it all day, calling myself stupid and careless. I keep replaying the moment I realized my error and feeling sick about it.",
      "I feel so disappointed in myself and deeply embarrassed. I pride myself on being detail-oriented and reliable, so this mistake feels like it defines me as a person. I'm worried my boss and colleagues will lose trust in me and see me as incompetent.",
      "If my best friend came to me with this exact same situation, I would definitely tell them that everyone makes mistakes, even smart, capable people. I'd remind them that one error doesn't erase all their good work and that they're being way too hard on themselves.",
      "I need to apply that same kindness to myself. I can learn from this mistake by double-checking my work in the future, but I don't need to torture myself with harsh self-criticism. This is a chance to grow and be more compassionate with myself when I'm human and imperfect."
    ]
  },
  'values-clarification': {
    exerciseType: 'values-clarification',
    sampleAnswers: [
      "What matters most to me is genuine connection with others - not just surface-level interactions, but really meaningful relationships where people feel seen and understood. I value authenticity and being able to be my true self around people who accept me completely.",
      "Having meaningful relationships absolutely energizes me and makes me feel most alive. When I have deep conversations with friends or spend quality time with family, I feel fulfilled in a way that nothing else provides. It's like my soul gets recharged through these connections.",
      "I realize I want to spend much more quality time with my family and close friends. I've been so focused on career advancement that I've been neglecting the relationships that actually matter most to me. I miss having regular dinners together and just being present with each other.",
      "I think I could start by scheduling regular friend meetups and family dinners, and actually protecting that time as sacred. I could also try to be more intentional about reaching out to people I care about, even just to check in and see how they're doing."
    ]
  },
  'mindfulness': {
    exerciseType: 'mindfulness',
    sampleAnswers: [
      "As I tune into my body right now, I notice there's a lot of tension in my shoulders and neck. It feels like I've been carrying stress there all day without even realizing it. My jaw is also clenched, and I can feel tightness in my chest.",
      "My mind keeps racing about everything I need to do tomorrow - the meetings, the deadlines, the emails I haven't answered yet. It's like there's a constant chatter in my head that won't quiet down, jumping from one worry to the next without pause.",
      "As I focus on my breath, I can feel it gradually slowing down and becoming deeper. The frantic energy in my chest is starting to settle, and I'm noticing the rhythm of inhaling and exhaling in a way I hadn't before this exercise.",
      "This mindfulness practice really helped me feel more present and grounded in my body. I can see how much I was living in my head, disconnected from what I was actually experiencing in this moment. I feel more centered and aware now."
    ]
  },
  'vision-of-future': {
    exerciseType: 'vision-of-future',
    sampleAnswers: [
      "In my vision of my future self, I see someone who feels genuinely confident and creative, not just putting on a brave face. I'm someone who trusts their instincts and isn't constantly second-guessing every decision. I have this inner sense of calm and self-assurance that allows me to take risks and express my ideas freely.",
      "I'm surrounded by people who truly care about me and see the real me, not just the version I think I should be. These relationships are deep and authentic - we support each other through challenges and celebrate each other's wins. I feel loved and accepted for who I am, not what I achieve.",
      "Most importantly, I wake up each morning feeling excited about my work and the day ahead. Instead of dreading Monday mornings, I feel energized by the projects I'm working on because they align with my values and use my strengths. My work feels meaningful and purposeful, not just a way to pay bills.",
      "Looking at this vision, I realize I want to focus much more on building and maintaining meaningful relationships rather than just advancing my career. I want to be someone who prioritizes connection and community, and who creates space for the people who matter most to me.",
      "I think I could start working toward this vision by setting clearer boundaries with work and being more intentional about my personal relationships. Maybe I could begin by scheduling regular time with friends and family, and saying no to work commitments that don't align with my deeper values."
    ]
  }
};

/**
 * Get the next sample answer for an exercise type
 */
export function getNextSampleAnswer(exerciseType: string, stepIndex: number): string {
  const testData = EXERCISE_TEST_DATA[exerciseType];
  if (!testData) {
    return `Sample answer for ${exerciseType} step ${stepIndex + 1}`;
  }
  
  const answers = testData.sampleAnswers;
  if (stepIndex < answers.length) {
    return answers[stepIndex];
  }
  
  // Return a generic answer if we run out of specific ones
  return `Additional sample response for step ${stepIndex + 1}`;
}

/**
 * Get all sample answers for an exercise type
 */
export function getAllSampleAnswers(exerciseType: string): string[] {
  const testData = EXERCISE_TEST_DATA[exerciseType];
  return testData ? testData.sampleAnswers : [];
}

/**
 * Check if we have test data for an exercise type
 */
export function hasTestData(exerciseType: string): boolean {
  return exerciseType in EXERCISE_TEST_DATA;
}

/**
 * Auto-complete thinking pattern reflection with sample data
 */
export const THINKING_PATTERN_TEST_DATA = {
  originalThought: "I'm going to mess up this presentation and everyone will think I'm incompetent",
  distortionType: "Catastrophic Thinking",
  reframedThought: "This presentation is important, but I can prepare well and do my best",
  sampleResponses: [
    "Yes, I definitely do tend to think the worst will happen in situations like this. Even when I've prepared well, I automatically jump to imagining complete disaster and humiliation. It's like my brain is wired to expect failure, even when there's no real evidence that's likely to happen.",
    "I notice this catastrophic thinking pattern especially when I'm stressed about work or performance situations. It seems to happen most when the stakes feel high - like presentations, job interviews, or important meetings. The higher the stakes, the more my mind spirals into worst-case scenarios.",
    "When I'm thinking this way, it makes me feel incredibly anxious and overwhelmed. My heart starts racing, I feel nauseous, and I just want to avoid the situation entirely. Sometimes I even consider calling in sick or making excuses to get out of it, which isn't like me at all.",
    "I think I could help myself by reminding myself that I've actually given presentations before and they've gone well. Even when I was nervous beforehand, I managed to get through them and received positive feedback. My track record is actually pretty good, despite what my anxious mind tells me.",
    "This has been really helpful for recognizing this pattern. Yes, I'd like to end here and create a summary of what we've discovered about my thinking patterns and how I can work with them differently in the future."
  ]
};

/**
 * Auto-complete value reflection with sample data
 */
export const VALUE_REFLECTION_TEST_DATA = {
  valueName: "Connection",
  valueDescription: "Building meaningful relationships and feeling understood by others",
  sampleResponses: [
    "Connection means feeling truly seen and heard by people who matter to me, not just surface-level social interactions. It's about being able to be vulnerable and authentic, sharing my real thoughts and feelings without fear of judgment. When I have that kind of connection, I feel energized and understood in a way that fills me up emotionally.",
    "I feel most connected when I have deep, uninterrupted conversations where we're really present with each other. No phones, no distractions - just genuine curiosity about each other's inner worlds. I love those moments when someone really gets what I'm saying and reflects it back to me, or when I can do that for them.",
    "I realize that sometimes I prioritize work achievements and busyness over spending quality time with friends and family. I'll skip social gatherings or cut conversations short because I feel like I should be productive. But then I end up feeling isolated and wondering why I'm working so hard if I don't have meaningful relationships to share it with.",
    "I want to be much more intentional about protecting and prioritizing time for relationships. Maybe that means scheduling regular friend dates, having phone calls with family, or just being more present when I am with people instead of thinking about my to-do list. I want to treat relationships as important as any other goal in my life.",
    "This reflection has been really valuable for understanding what connection means to me and where I might be falling short. Yes, I'd like to end here and create a summary of the insights I've gained about this value and how I want to honor it more in my life."
  ]
};