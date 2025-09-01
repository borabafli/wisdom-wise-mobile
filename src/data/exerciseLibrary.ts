import { Brain, Wind, Eye, BookOpen, Heart, Star } from 'lucide-react-native';

// Unified exercise library - single source of truth for all exercise data
export const exerciseLibraryData: Record<string, any> = {
  'automatic-thoughts': {
    id: 1,
    type: 'automatic-thoughts',
    name: 'Recognizing Automatic Thoughts',
    duration: '15 min',
    description: 'Identify and reframe negative thought patterns with CBT',
    category: 'CBT',
    difficulty: 'Intermediate',
    icon: Brain,
    color: ['#B5A7C6', '#D4B5D0'],
    image: require('../../assets/images/4.jpeg')
  },
  'breathing': {
    id: 2,
    type: 'breathing',
    name: '4-7-8 Breathing',
    duration: '5 min',
    description: 'Calm your nervous system with rhythmic breathing',
    category: 'Breathing',
    difficulty: 'Beginner',
    icon: Wind,
    color: ['#8FA5B3', '#C3D9E6'],
    image: require('../../assets/images/5.jpeg')
  },
  'mindfulness': {
    id: 3,
    type: 'mindfulness',
    name: 'Body Scan',
    duration: '10 min',
    description: 'Release tension through mindful awareness',
    category: 'Mindfulness',
    difficulty: 'Beginner',
    icon: Eye,
    color: ['#95B99C', '#B8C5A6'],
    image: require('../../assets/images/7.jpeg')
  },
  'morning-mindfulness': {
    id: 4,
    type: 'morning-mindfulness',
    name: 'Morning Mindfulness',
    duration: '8 min',
    description: 'Start your day with gentle awareness and presence',
    category: 'Mindfulness',
    difficulty: 'Beginner',
    icon: Eye,
    color: ['#E0F2FE', '#BAE6FD'],
    image: require('../../assets/images/1.jpeg')
  },
  'gratitude': {
    id: 5,
    type: 'gratitude',
    name: 'Gratitude Practice',
    duration: '10 min',
    description: 'Shift focus to positive moments and appreciation',
    category: 'Mindfulness',
    difficulty: 'Beginner',
    icon: BookOpen,
    color: ['#FFD4BA', '#FFE5D4'],
    image: require('../../assets/images/8.jpeg')
  },
  'self-compassion': {
    id: 6,
    type: 'self-compassion',
    name: 'Self-Compassion Break',
    duration: '5 min',
    description: 'Practice kindness towards yourself',
    category: 'Self-Care',
    difficulty: 'Beginner',
    icon: Heart,
    color: ['#E8B5A6', '#F5E6D3'],
    image: require('../../assets/images/9.jpeg')
  },
  'values-clarification': {
    id: 7,
    type: 'values-clarification',
    name: 'Living Closer to My Values',
    duration: '15 min',
    description: 'Discover what truly matters to you and align your actions (ACT)',
    category: 'ACT',
    difficulty: 'Intermediate',
    icon: Star,
    color: ['#D4C5B9', '#E5E5E5'],
    image: require('../../assets/images/2.jpeg')
  }
};

// Convert to array for ExerciseLibrary component
export const exercisesArray = Object.values(exerciseLibraryData);

// Exercise keyword mapping to match AI suggestions with library exercises
export const EXERCISE_KEYWORDS = {
  'breathing': ['breathing', 'breath', '4-7-8'],
  'automatic-thoughts': ['automatic thoughts', 'thought patterns', 'negative thoughts', 'cognitive', 'cbt'],
  'mindfulness': ['body scan', 'mindfulness', 'body awareness'],
  'morning-mindfulness': ['morning', 'start day', 'morning mindfulness'],
  'gratitude': ['gratitude', 'appreciation', 'thankful'],
  'self-compassion': ['self-compassion', 'self compassion', 'kind to yourself', 'self-care'],
  'values-clarification': ['values', 'meaning', 'purpose', 'what matters']
};

// AI-guided exercise flows - centralized here to eliminate duplication
export const exerciseFlows: Record<string, any> = {
  'automatic-thoughts': {
    name: 'Recognizing Automatic Thoughts',
    color: 'purple',
    useAI: true,
    steps: [
      {
        title: 'Welcome & Awareness',
        stepNumber: 1,
        description: 'Introduction to automatic thoughts',
        aiPromptInitial: 'Welcome them to the Automatic Thoughts exercise. Explain that we\'ll be exploring the thoughts that pop up automatically in challenging situations. Ask them to think of a recent situation where they felt upset, anxious, or stressed. Encourage them to share what happened, but remind them they only need to share what feels comfortable. Keep it warm and supportive.',
        aiPromptDeepen: 'They\'ve mentioned a situation but haven\'t shared enough detail yet. Gently encourage them to share more about what happened. Ask follow-up questions like "What was going on in that moment?" or "Can you tell me a bit more about what made that situation particularly difficult for you?" Stay curious and supportive.'
      },
      {
        title: 'Identifying the Thought',
        stepNumber: 2,
        description: 'Finding the specific thought',
        aiPromptInitial: 'Now help them identify the specific automatic thought that came up in that situation. Ask "What was going through your mind in that moment?" or "What thoughts were you having about yourself, the situation, or what might happen?" Guide them to pinpoint the exact words or phrases. If they share emotions instead of thoughts, gently help them distinguish: "That sounds like how you felt - what thoughts do you think led to that feeling?"',
        aiPromptDeepen: 'They\'ve shared something but you need to help them get more specific about the actual thoughts. Ask clarifying questions like "When you say you felt worried, what specific thought was behind that feeling?" or "What was the story your mind was telling you about what might happen?" Help them distinguish between emotions and the thoughts that created those emotions.'
      },
      {
        title: 'Examining the Evidence',
        stepNumber: 3,
        description: 'Looking at the thought objectively',
        aiPromptInitial: 'Guide them to examine their automatic thought more objectively. Ask questions like: "What evidence supports this thought? What evidence goes against it?" or "If a good friend had this same thought, what would you tell them?" Help them see their thought from different angles. Be gentle and avoid making them feel wrong - frame it as curious exploration, not correction.',
        aiPromptDeepen: 'They\'ve started examining the evidence but need to go deeper. Ask more specific questions like "Can you think of times when this thought wasn\'t true?" or "What would you need to see to know this thought is 100% accurate?" Help them consider alternative explanations: "What are some other ways to interpret this situation?" Guide them to be their own detective, looking for nuance and balance.'
      },
      {
        title: 'Reframing & Integration',
        stepNumber: 4,
        description: 'Developing a balanced perspective',
        aiPromptInitial: 'Now help them develop a more balanced, realistic thought to replace the automatic one. Ask: "Based on what we\'ve explored, how might you think about this situation differently?" or "What would be a more balanced way to look at this?" End by praising their work and suggesting they practice noticing automatic thoughts in daily life. Remind them this takes time and be encouraging about the process.',
        aiPromptDeepen: 'They\'ve shared a reframed thought but it might still be too extreme or not fully integrated. Help them refine it further: "How does this new way of thinking feel in your body?" or "Is there anything about this new thought that still doesn\'t feel quite right?" Guide them to make it feel authentic and balanced. Ask how they\'ll remember this new perspective when the old thought pattern shows up again.'
      }
    ]
  },
  'breathing': {
    name: '4-7-8 Breathing',
    color: 'blue',
    useAI: true,
    steps: [
      {
        title: 'Setup & First Cycle',
        stepNumber: 1,
        description: 'Learning and practicing the 4-7-8 technique',
        aiPromptInitial: 'Welcome them to 4-7-8 breathing - a powerful technique for calming the nervous system. Guide them to sit comfortably and place one hand on chest, one on belly. Explain the pattern: "Inhale through nose for 4, hold for 7, exhale through mouth for 8." Walk them through one slow cycle together, counting aloud. Ask how it felt and if they need to adjust the pace.',
        aiPromptDeepen: 'They\'ve tried the first cycle but might need more guidance or reassurance. Ask more detailed questions: "What did you notice with your hands on your chest and belly? Which hand moved more?" Help them refine their technique: "Let\'s try making the exhale even longer and more complete." Address any concerns: "It\'s normal if it feels awkward at first. How can we make this more comfortable for you?"'
      },
      {
        title: 'Guided Practice Session',
        stepNumber: 2,
        description: 'Practicing multiple cycles with guidance',
        aiPromptInitial: 'Now guide them through 4-5 complete cycles of 4-7-8 breathing. Count each cycle clearly: "Inhale... 2, 3, 4. Hold... 2, 3, 4, 5, 6, 7. Exhale... 2, 3, 4, 5, 6, 7, 8." Between cycles, offer gentle encouragement. Ask them to notice any changes in their body, mind, or stress level as you practice together.',
        aiPromptDeepen: 'They\'ve completed several cycles. Now explore their experience more deeply: "What specific changes are you noticing? Is it in your shoulders, your heart rate, your thoughts?" Help them connect with subtle shifts: "Sometimes the changes are small at first. What\'s the most noticeable difference, even if it\'s tiny?" Encourage them to describe the quality of calmness they\'re experiencing.'
      },
      {
        title: 'Integration & Daily Use',
        stepNumber: 3,
        description: 'Applying the technique in daily life',
        aiPromptInitial: 'Ask how they feel now compared to when they started. What shifts did they notice? Explain that 4-7-8 breathing activates the parasympathetic nervous system, naturally calming anxiety and stress. Discuss when they might use this - before bed, during stress, or as a daily practice. What situations could benefit from this technique?',
        aiPromptDeepen: 'They\'ve identified when they might use this technique, but let\'s make it more concrete. Ask: "Think about your typical week - when do you feel most stressed or anxious?" Help them visualize using the technique: "Imagine yourself in that situation doing 4-7-8 breathing. What would that look like?" Discuss potential obstacles: "What might make it hard to remember to use this when you really need it?"'
      }
    ]
  },
  'mindfulness': {
    name: 'Body Scan',
    color: 'green',
    useAI: true,
    steps: [
      {
        title: 'Settling In',
        stepNumber: 1,
        description: 'Preparing for body awareness',
        aiPromptInitial: 'Welcome them to the Body Scan practice. Explain that we\'ll be paying gentle attention to different parts of the body to release tension and increase awareness. Guide them to lie down or sit comfortably. Have them close their eyes or soften their gaze. Ask them to take a few deep breaths and notice how their body feels right now overall.',
        aiPromptDeepen: 'They\'ve settled in but might need more guidance connecting with their body. Ask: "What does \'noticing your body\' actually feel like for you right now?" Help them get more specific: "Are there areas that feel more present or alive? Areas that feel numb or disconnected?" Encourage them: "There\'s no wrong way to feel. What\'s it like to just be curious about your body without needing to change anything?"'
      },
      {
        title: 'Starting with Feet',
        stepNumber: 2,
        description: 'Beginning the scan from the ground up',
        aiPromptInitial: 'Now guide their attention to their feet. "Notice your toes, the tops of your feet, your heels. You don\'t need to change anything - just observe. What sensations do you notice? Warmth, coolness, pressure, tingling, or maybe nothing at all?" Encourage them to spend 30-45 seconds really feeling their feet. Ask them what they noticed.',
        aiPromptDeepen: 'They\'ve noticed something about their feet, but let\'s explore it more fully. If they found sensations, ask: "Can you describe that feeling a bit more? How would you explain that sensation to someone who\'s never felt it?" If they felt nothing, reassure them: "Noticing \"nothing\" is actually noticing something important. What does that absence of sensation feel like?" Help them stay curious rather than judgmental.'
      },
      {
        title: 'Moving Through the Body',
        stepNumber: 3,
        description: 'Scanning legs, torso, and arms',
        aiPromptInitial: 'Continue guiding them up through their body: "Now notice your legs - calves, knees, thighs. Then your hips and lower back." Pause between each area. Move to torso: "Your belly, chest, shoulders." Then arms: "Your arms, hands, and fingers." For each area, remind them to just notice without trying to change anything. Ask what they\'re discovering about their body as you go.',
        aiPromptDeepen: 'They\'re moving through the body scan but may need help going deeper. Ask: "Which areas feel most familiar or easy to sense? Which feel more mysterious or hard to connect with?" If they notice tension, explore: "What\'s that tension like? Heavy, tight, buzzing, sharp?" Help them develop body awareness vocabulary: "How would you describe the difference between how your shoulders feel versus your belly right now?"'
      },
      {
        title: 'Completing & Integrating',
        stepNumber: 4,
        description: 'Finishing with whole-body awareness',
        aiPromptInitial: 'Guide them to notice their neck and head: "Your neck, jaw, face, and scalp." Then invite them to sense their whole body at once: "Take a moment to feel your entire body as one connected whole." Ask how they feel now compared to when they started. Discuss what they learned about where they hold tension and how body awareness can help them throughout the day.',
        aiPromptDeepen: 'They\'ve completed the scan and noticed some changes. Help them integrate the experience: "What was most surprising about what you discovered in your body today?" Explore practical application: "Now that you know more about where you hold tension, how might you check in with those areas during your regular day?" Ask: "What would it be like to have this kind of gentle awareness of your body more often?"'
      }
    ]
  },
  'gratitude': {
    name: 'Gratitude Practice',
    color: 'orange',
    useAI: true,
    steps: [
      {
        title: 'Opening to Gratitude',
        stepNumber: 1,
        description: 'Setting the intention',
        aiPromptInitial: 'Welcome them to the Gratitude Practice. Explain that gratitude can shift our focus from what\'s missing to what\'s present, helping improve mood and perspective. Ask them to take a comfortable position and a few deep breaths. Invite them to think about why they chose to do this practice today. What would they like to cultivate or shift in their mindset?',
        aiPromptDeepen: 'They\'ve shared why they\'re here but may need help connecting more deeply with their intention. Ask: "What would it feel like if you could shift that mindset you mentioned?" Help them get specific: "When you think about cultivating more gratitude, what would be different about your daily experience?" Explore any resistance gently: "Is there part of you that feels resistant to focusing on gratitude right now? That\'s completely normal."'
      },
      {
        title: 'Simple Appreciations',
        stepNumber: 2,
        description: 'Starting with basic gratitudes',
        aiPromptInitial: 'Let\'s start with simple things they might take for granted. Ask them to share 2-3 basic things they can appreciate right now - maybe their breath, having a place to sit, or something they can see or hear. Encourage them to really feel the appreciation, not just think it. "What does it feel like in your body when you appreciate your breath?" Help them connect with the felt sense of gratitude.',
        aiPromptDeepen: 'They\'ve named some basic appreciations but might need help really feeling them. Ask: "Let\'s slow down with one of those. Can you really let yourself feel grateful for [specific thing they mentioned]?" Guide them to embodied gratitude: "Where do you feel that appreciation in your body? Your heart, belly, shoulders?" If they struggle to feel it: "Sometimes gratitude is subtle. What\'s the tiniest shift you notice when you focus on appreciating that?"'
      },
      {
        title: 'Deeper Appreciations',
        stepNumber: 3,
        description: 'Exploring meaningful gratitudes',
        aiPromptInitial: 'Now invite them to think of people, experiences, or aspects of their life they feel grateful for. Ask them to share one or two and really describe why they\'re meaningful. "Tell me about someone you\'re grateful for. What do they bring to your life?" Help them elaborate and feel the warmth of appreciation. Notice any changes in their voice or energy as they share.',
        aiPromptDeepen: 'They\'ve shared about someone or something meaningful, but let\'s help them savor it more deeply. Ask: "What is it about this person that touches you most deeply?" Help them get specific about impact: "Can you think of a particular moment with them that captures why you\'re so grateful?" Encourage them to really feel it: "As you think about that memory, what happens in your heart? What does this gratitude feel like right now?"'
      },
      {
        title: 'Integration & Commitment',
        stepNumber: 4,
        description: 'Making gratitude a practice',
        aiPromptInitial: 'Ask how they feel after focusing on gratitude. What did they notice about their mood or energy? Discuss how they might incorporate gratitude into daily life - maybe a morning practice, bedtime reflection, or gratitude breaks during the day. Ask what would make it easiest for them to remember. End by appreciating them for taking time for this practice.',
        aiPromptDeepen: 'They\'ve noticed some shifts from the gratitude practice. Help them make it sustainable: "What would make the biggest difference - a regular gratitude practice, or remembering to appreciate small moments throughout the day?" Explore obstacles: "What typically gets in the way of you noticing good things in your life?" Help them create a concrete plan: "What\'s one specific way you could remember to practice gratitude this week that feels realistic for you?"'
      }
    ]
  },
  'self-compassion': {
    name: 'Self-Compassion Break',
    color: 'pink',
    useAI: true,
    steps: [
      {
        title: 'Mindful Awareness',
        stepNumber: 1,
        description: 'Acknowledging pain without judgment',
        aiPromptInitial: 'Welcome them to the Self-Compassion Break. Explain that we\'ll practice the 3 components of self-compassion. Ask them to think of something they\'re struggling with right now. Guide them to place a hand on their heart and say "This is a moment of difficulty" or "This hurts." Help them acknowledge their pain mindfully, without trying to fix or judge it.',
        aiPromptDeepen: 'They\'ve acknowledged their difficulty but might need help really feeling this step. Ask: "What\'s it like to put your hand on your heart while thinking about this struggle?" Help them notice: "Do you notice any urge to minimize the difficulty or push it away?" Encourage full acknowledgment: "What would it be like to completely accept that this is hard right now, without needing to fix it?"'
      },
      {
        title: 'Common Humanity',
        stepNumber: 2,
        description: 'Connecting to shared human experience',
        aiPromptInitial: 'Help them recognize they\'re not alone in suffering. Guide them to say "Difficulty is part of life" or "Others feel this way too." Ask them to consider how many people worldwide might be experiencing similar struggles. This isn\'t about minimizing their pain, but connecting to our shared humanity. How does it feel to remember you\'re not alone in this?',
        aiPromptDeepen: 'They\'ve connected with common humanity but may need to feel it more deeply. Ask: "Can you imagine all the people who have felt exactly this way?" Help them visualize: "Picture parents, students, workers all around the world who know this same struggle. What\'s it like to be part of that human community?" Address any resistance: "Does part of you want to feel special in your pain? That\'s normal too - we all feel that sometimes."'
      },
      {
        title: 'Self-Kindness',
        stepNumber: 3,
        description: 'Offering compassionate self-talk',
        aiPromptInitial: 'Now guide them to offer themselves the kindness they\'d give a dear friend. Ask "What would you say to a beloved friend facing this exact struggle?" Have them speak those same loving words to themselves. They might say "May I be kind to myself" or "May I give myself the compassion I need." End by asking what it feels like to speak to themselves with such kindness.',
        aiPromptDeepen: 'They\'ve offered themselves some kindness, but let\'s deepen it. Ask: "What would the most loving person in your life say to you right now?" Help them embody compassion: "Can you really let those kind words in? What does it feel like in your body to receive that compassion?" If they struggle: "What makes it hard to be kind to yourself? Is there a voice that says you don\'t deserve it?" Work gently with any self-criticism that arises.'
      }
    ]
  },
  'morning-mindfulness': {
    name: 'Morning Mindfulness',
    color: 'lightblue',
    useAI: true,
    steps: [
      {
        title: 'Gentle Awakening',
        stepNumber: 1,
        description: 'Connecting with the present moment',
        aiPromptInitial: 'Welcome them to Morning Mindfulness. This is about starting the day with gentle awareness. Ask them to notice how they\'re feeling right now - physically, emotionally, mentally. There\'s no right or wrong way to feel. Guide them to take three slow, conscious breaths and simply notice what\'s present for them this morning.',
        aiPromptDeepen: 'They\'ve done a basic check-in, but let\'s help them notice more subtly. Ask: "What\'s the quality of your energy right now? Alert, sleepy, anxious, calm, or something else?" Help them get specific: "If you had to describe your morning mood to someone, what words would you use?" Encourage self-acceptance: "How does it feel to just notice how you are without needing to change anything?"'
      },
      {
        title: 'Body Check-In',
        stepNumber: 2,
        description: 'Awareness of physical sensations',
        aiPromptInitial: 'Guide them through a brief body scan. Ask them to notice: How does their body feel after rest? Any areas of tension or ease? Any sensations in their feet, legs, torso, arms, shoulders, neck, face? Remind them this is just noticing, not judging or trying to change anything. What does their body need today?',
        aiPromptDeepen: 'They\'ve done a body scan and maybe identified some needs. Help them go deeper: "When you say your body needs rest/movement/stretching, what would that look like today?" Explore the connection: "How does your body feel connected to your emotional state this morning?" Ask: "Is there one area of your body that would most appreciate some attention or care today?"'
      },
      {
        title: 'Setting Daily Intention',
        stepNumber: 3,
        description: 'Mindful intention for the day ahead',
        aiPromptInitial: 'Ask them to think about their day ahead with gentle curiosity, not overwhelm. What\'s one intention they\'d like to set? It could be "I\'ll be patient with myself," "I\'ll notice small joys," or "I\'ll take things one step at a time." Help them choose something kind and realistic. How might they remember this intention throughout their day?',
        aiPromptDeepen: 'They\'ve set an intention, but let\'s make it more concrete and meaningful. Ask: "What drew you to that particular intention? What would it feel like if you could really live that today?" Help them anticipate challenges: "When during your typical day might this intention be hardest to remember?" Explore practical reminders: "What\'s a gentle way you could remind yourself of this intention when you need it most?"'
      },
      {
        title: 'Gratitude & Transition',
        stepNumber: 4,
        description: 'Appreciation and mindful transition',
        aiPromptInitial: 'Invite them to notice one thing they\'re grateful for right now - it could be as simple as having a place to sleep, their breath, or this moment of stillness. Ask them to feel that appreciation in their body. Then guide them to transition mindfully into their day, carrying this sense of presence and intention with them.',
        aiPromptDeepen: 'They\'ve found something to be grateful for and are ready to transition. Help them really savor this: "Let\'s pause here for a moment. What does it actually feel like in your body to appreciate [what they mentioned]?" Guide the transition: "As you imagine moving into your day, how can you carry this feeling of gratitude and presence with you? What would it be like to start your first activity with this same gentle awareness?"'
      }
    ]
  },
  'values-clarification': {
    name: 'Living Closer to My Values',
    color: 'gold',
    useAI: true,
    steps: [
      {
        title: 'Values Exploration',
        stepNumber: 1,
        description: 'Identifying core personal values',
        aiPromptInitial: 'Welcome them to Values Clarification from Acceptance and Commitment Therapy. Explain that values are our deepest principles - what we want our lives to stand for. Ask them to think about what truly matters to them. What kind of person do they want to be? In relationships? Work? Personal growth? Help them identify 2-3 core values that resonate deeply.',
        aiPromptDeepen: 'They\'ve identified some potential values, but let\'s help them go deeper. Ask: "When you think about [value they mentioned], what does that really mean to you personally?" Help them explore: "Can you think of a time when you felt most like yourself? What values were you living in that moment?" Guide them to feel it: "Which of these values makes your heart feel most alive when you think about it?"'
      },
      {
        title: 'Values vs Goals',
        stepNumber: 2,
        description: 'Understanding the difference between values and outcomes',
        aiPromptInitial: 'Help them distinguish values from goals. Values are ongoing directions (like "being compassionate") while goals are destinations (like "help 5 people this week"). Ask: For each value they mentioned, what would living that value look like day-to-day? How would they act differently if they were fully embodying this value?',
        aiPromptDeepen: 'They understand the concept but may need help making it more concrete. Ask: "Let\'s pick one of your values. If someone followed you around all day and watched you embody this value, what specific behaviors would they see?" Help them get detailed: "What would be different about how you talk to people, how you spend your time, or how you treat yourself?" Explore the feeling: "What would it feel like to live this value more fully?"'
      },
      {
        title: 'Current Alignment Assessment',
        stepNumber: 3,
        description: 'Evaluating how well current life aligns with values',
        aiPromptInitial: 'Ask them to honestly assess their current life. On a scale of 1-10, how closely is their current life aligned with each of their core values? What areas feel most aligned? Which feel furthest from their values? Be gentle and curious, not judgmental. What gets in the way of living their values more fully?',
        aiPromptDeepen: 'They\'ve done the assessment but may need help exploring it more deeply. For areas of good alignment, ask: "What\'s working well in that area? What are you already doing that honors this value?" For misaligned areas: "What would need to shift for this area to better reflect your values?" Be compassionate about gaps: "It makes sense that it\'s hard to live our values perfectly. What\'s the most important shift for you right now?"'
      },
      {
        title: 'Barriers & Obstacles',
        stepNumber: 4,
        description: 'Identifying what prevents values-based living',
        aiPromptInitial: 'Explore what barriers prevent them from living their values. Is it fear? Others\' expectations? Past experiences? Difficult emotions? Help them identify specific obstacles. Remember, in ACT, we don\'t try to eliminate difficult feelings - we learn to have them while still moving toward our values. What barriers feel most significant?',
        aiPromptDeepen: 'They\'ve identified some barriers. Let\'s explore them more deeply: "When you think about [specific barrier they mentioned], what does that feel like in your body?" Help them understand the barrier: "Where do you think this barrier came from? When did you first learn to think this way?" Explore the cost: "How has this barrier affected your life? What opportunities or connections has it prevented?" Stay compassionate about their struggles.'
      },
      {
        title: 'Small Values-Based Actions',
        stepNumber: 5,
        description: 'Identifying concrete steps toward values',
        aiPromptInitial: 'Now help them identify small, concrete actions they could take this week to move closer to their values. These should be specific and achievable. For example, if they value connection, maybe "text one friend to check in" or "have dinner without phone." What small step feels both meaningful and doable for each core value?',
        aiPromptDeepen: 'They\'ve thought of some actions but let\'s help them refine them. Ask: "Of the actions you mentioned, which one feels most exciting or meaningful to you?" Help them be realistic: "On a scale of 1-10, how confident are you that you\'ll actually do this action this week?" If confidence is low, ask: "What would make this feel more doable? Could we make it smaller or simpler?" Help them connect action to value: "How will doing this action help you feel more aligned with what matters to you?"'
      },
      {
        title: 'Commitment & Integration',
        stepNumber: 6,
        description: 'Making a commitment to values-based living',
        aiPromptInitial: 'Ask them to choose one small values-based action they\'ll commit to this week. Help them anticipate obstacles and plan how they\'ll handle them. Remind them that living by values is a lifelong practice, not a destination. What commitment feels right for them? How will they remember to return to their values when life gets difficult?',
        aiPromptDeepen: 'They\'ve made a commitment, but let\'s strengthen it. Ask: "What will you do if you forget or don\'t follow through? How can you be compassionate with yourself while still staying committed?" Help them plan: "What\'s your backup plan if the obstacles you mentioned actually happen?" Explore the bigger picture: "How might this small action ripple out into other areas of your life?" End with encouragement about the long-term journey of values-based living.'
      }
    ]
  }
};

// Helper functions
export function getExerciseByType(exerciseType: string): any | null {
  return exerciseLibraryData[exerciseType] || null;
}

export function getExerciseFlow(exerciseType: string): any | null {
  return exerciseFlows[exerciseType] || null;
}