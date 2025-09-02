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
        aiPromptInitial: 'Great that you\'ve decided to work on recognizing automatic thoughts - this is one of the most powerful CBT techniques for understanding how our minds create distress. We\'ll explore those quick, automatic thoughts that pop up in challenging situations, and learn to recognize their patterns. Ask them to think of a recent situation where they felt upset, anxious, or stressed, and encourage them to share what happened.',
        aiPromptDeepen: 'Use your therapeutic intuition to guide them deeper into this step\'s goal. Help them share more meaningful details about their situation through gentle, curious questions that feel natural to the conversation flow. Focus on creating safety for them to open up about what made this situation particularly challenging.'
      },
      {
        title: 'Identifying the Thought',
        stepNumber: 2,
        description: 'Finding the specific thought',
        aiPromptInitial: 'Now help them identify the specific automatic thought that came up in that situation. Ask "What was going through your mind in that moment?" or "What thoughts were you having about yourself, the situation, or what might happen?" Guide them to pinpoint the exact words or phrases. If they share emotions instead of thoughts, gently help them distinguish: "That sounds like how you felt - what thoughts do you think led to that feeling?"',
        aiPromptDeepen: 'Guide them toward the specific thoughts behind their feelings. Use your clinical judgment to ask the right clarifying questions that help them distinguish between emotions and the underlying thoughts. Focus on helping them identify the exact words or stories their mind was telling them.'
      },
      {
        title: 'Examining the Evidence',
        stepNumber: 3,
        description: 'Looking at the thought objectively',
        aiPromptInitial: 'Guide them to examine their automatic thought more objectively. Ask questions like: "What evidence supports this thought? What evidence goes against it?" or "If a good friend had this same thought, what would you tell them?" Help them see their thought from different angles. Be gentle and avoid making them feel wrong - frame it as curious exploration, not correction.',
        aiPromptDeepen: 'They\'re beginning to examine their thought objectively. Use your therapeutic skills to help them explore the evidence more thoroughly. Guide them to consider alternative perspectives and become curious investigators of their own thinking patterns, helping them find balance and nuance.'
      },
      {
        title: 'Reframing & Integration',
        stepNumber: 4,
        description: 'Developing a balanced perspective',
        aiPromptInitial: 'Now help them develop a more balanced, realistic thought to replace the automatic one. Ask: "Based on what we\'ve explored, how might you think about this situation differently?" or "What would be a more balanced way to look at this?" End by praising their work and suggesting they practice noticing automatic thoughts in daily life. Remind them this takes time and be encouraging about the process.',
        aiPromptDeepen: 'Help them integrate and refine their new perspective. Use your clinical intuition to guide them toward a reframed thought that feels authentic and sustainable. Focus on helping them embody this new thinking and develop strategies to remember it when old patterns resurface.'
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
        aiPromptInitial: 'Excellent choice to practice 4-7-8 breathing - this is a scientifically-backed technique that activates your parasympathetic nervous system to naturally calm anxiety and stress. Guide them to sit comfortably and place one hand on chest, one on belly. Explain the pattern and walk them through one slow cycle together, counting aloud.',
        aiPromptDeepen: 'Help them refine their breathing technique using your clinical judgment. Guide them to notice what their body is telling them and address any concerns or adjustments needed to make the practice feel comfortable and effective.'
      },
      {
        title: 'Guided Practice Session',
        stepNumber: 2,
        description: 'Practicing multiple cycles with guidance',
        aiPromptInitial: 'Now guide them through 4-5 complete cycles of 4-7-8 breathing. Count each cycle clearly: "Inhale... 2, 3, 4. Hold... 2, 3, 4, 5, 6, 7. Exhale... 2, 3, 4, 5, 6, 7, 8." Between cycles, offer gentle encouragement. Ask them to notice any changes in their body, mind, or stress level as you practice together.',
        aiPromptDeepen: 'Guide them to explore their breathing experience more deeply. Help them notice and articulate the subtle shifts happening in their body and mind. Use your therapeutic intuition to help them connect with the calming effects they\'re experiencing.'
      },
      {
        title: 'Integration & Daily Use',
        stepNumber: 3,
        description: 'Applying the technique in daily life',
        aiPromptInitial: 'Ask how they feel now compared to when they started. What shifts did they notice? Explain that 4-7-8 breathing activates the parasympathetic nervous system, naturally calming anxiety and stress. Discuss when they might use this - before bed, during stress, or as a daily practice. What situations could benefit from this technique?',
        aiPromptDeepen: 'Help them create a concrete plan for using this technique in their daily life. Guide them to visualize specific scenarios where 4-7-8 breathing would be helpful and address potential obstacles to regular practice. Focus on making this tool truly accessible when they need it most.'
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
        aiPromptInitial: 'Perfect choice to practice body scan meditation - this mindfulness technique is excellent for releasing tension, increasing body awareness, and developing a deeper connection with yourself. Guide them to get comfortable and help them begin noticing how their body feels right now overall.',
        aiPromptDeepen: 'Help them deepen their connection with their body using gentle, curious guidance. Use your therapeutic intuition to help them explore what \'noticing their body\' actually feels like for them, encouraging curiosity without judgment.'
      },
      {
        title: 'Starting with Feet',
        stepNumber: 2,
        description: 'Beginning the scan from the ground up',
        aiPromptInitial: 'Now guide their attention to their feet. Help them notice their toes, tops of feet, and heels - just observing without needing to change anything. Encourage them to spend time really feeling their feet and ask them what they noticed.',
        aiPromptDeepen: 'Guide them to explore their foot sensations more fully, whether they notice specific feelings or seeming absence of sensation. Help them develop their body awareness vocabulary and stay curious rather than judgmental about whatever they experience.'
      },
      {
        title: 'Moving Through the Body',
        stepNumber: 3,
        description: 'Scanning legs, torso, and arms',
        aiPromptInitial: 'Continue guiding them up through their body: "Now notice your legs - calves, knees, thighs. Then your hips and lower back." Pause between each area. Move to torso: "Your belly, chest, shoulders." Then arms: "Your arms, hands, and fingers." For each area, remind them to just notice without trying to change anything. Ask what they\'re discovering about their body as you go.',
        aiPromptDeepen: 'Help them go deeper into their body awareness as they scan different areas. Guide them to compare sensations between different body parts and develop vocabulary for describing their physical experience. Use your clinical intuition to explore any tension or interesting sensations they notice.'
      },
      {
        title: 'Completing & Integrating',
        stepNumber: 4,
        description: 'Finishing with whole-body awareness',
        aiPromptInitial: 'Guide them to notice their neck and head: "Your neck, jaw, face, and scalp." Then invite them to sense their whole body at once: "Take a moment to feel your entire body as one connected whole." Ask how they feel now compared to when they started. Discuss what they learned about where they hold tension and how body awareness can help them throughout the day.',
        aiPromptDeepen: 'Help them integrate their body scan experience and explore practical applications. Guide them to reflect on their discoveries and consider how this body awareness might serve them in daily life. Focus on helping them make this practice meaningful and accessible.'
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
        aiPromptInitial: 'Great choice to work on gratitude - this practice is proven to shift our focus from what\'s missing to what\'s present, naturally improving mood and perspective. Help them get comfortable and invite them to think about what they\'d like to cultivate or shift in their mindset through this practice.',
        aiPromptDeepen: 'Help them connect more deeply with their intention for practicing gratitude. Guide them to explore what cultivating more gratitude might look like in their daily experience, and gently acknowledge any resistance that might be present.'
      },
      {
        title: 'Simple Appreciations',
        stepNumber: 2,
        description: 'Starting with basic gratitudes',
        aiPromptInitial: 'Let\'s start with simple things they might take for granted. Ask them to share 2-3 basic things they can appreciate right now and encourage them to really feel the appreciation, not just think it. Help them connect with the felt sense of gratitude in their body.',
        aiPromptDeepen: 'Help them really feel their appreciations, not just think about them. Guide them to slow down and experience gratitude in their body, helping them notice even subtle shifts when they focus on appreciation.'
      },
      {
        title: 'Deeper Appreciations',
        stepNumber: 3,
        description: 'Exploring meaningful gratitudes',
        aiPromptInitial: 'Now invite them to think of people, experiences, or aspects of their life they feel grateful for. Ask them to share one or two and really describe why they\'re meaningful. "Tell me about someone you\'re grateful for. What do they bring to your life?" Help them elaborate and feel the warmth of appreciation. Notice any changes in their voice or energy as they share.',
        aiPromptDeepen: 'Help them savor their meaningful gratitudes more deeply. Guide them to get specific about what touches them most and encourage them to really feel the gratitude in their heart as they connect with these precious experiences.'
      },
      {
        title: 'Integration & Commitment',
        stepNumber: 4,
        description: 'Making gratitude a practice',
        aiPromptInitial: 'Ask how they feel after focusing on gratitude. What did they notice about their mood or energy? Discuss how they might incorporate gratitude into daily life - maybe a morning practice, bedtime reflection, or gratitude breaks during the day. Ask what would make it easiest for them to remember. End by appreciating them for taking time for this practice.',
        aiPromptDeepen: 'Help them make gratitude a sustainable practice by exploring what approach would work best for their lifestyle. Guide them to identify obstacles and create a concrete, realistic plan for incorporating gratitude into their daily routine.'
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
        aiPromptInitial: 'Wonderful that you\'re choosing to practice self-compassion - this evidence-based approach from Dr. Kristin Neff helps us relate to our struggles with kindness instead of harsh self-criticism. We\'ll work through the 3 components of self-compassion. Ask them to think of something they\'re struggling with and guide them to place a hand on their heart while acknowledging their pain mindfully.',
        aiPromptDeepen: 'Help them fully feel and acknowledge their difficulty. Guide them to notice any urges to minimize or push away their pain, and support them in completely accepting that this is hard right now without needing to fix it.'
      },
      {
        title: 'Common Humanity',
        stepNumber: 2,
        description: 'Connecting to shared human experience',
        aiPromptInitial: 'Help them recognize they\'re not alone in suffering. Guide them to connect with the reality that difficulty is part of life and others feel this way too. Help them consider how many people worldwide might be experiencing similar struggles - not to minimize their pain, but to connect to our shared humanity.',
        aiPromptDeepen: 'Help them feel their connection to shared human experience more deeply. Guide them to visualize all the people worldwide who know this same struggle and explore what it\'s like to be part of that human community. Gently address any resistance to feeling connected in their pain.'
      },
      {
        title: 'Self-Kindness',
        stepNumber: 3,
        description: 'Offering compassionate self-talk',
        aiPromptInitial: 'Now guide them to offer themselves the kindness they\'d give a dear friend. Ask "What would you say to a beloved friend facing this exact struggle?" Have them speak those same loving words to themselves. They might say "May I be kind to myself" or "May I give myself the compassion I need." End by asking what it feels like to speak to themselves with such kindness.',
        aiPromptDeepen: 'Help them deepen their self-kindness. Guide them to embody the compassion they would receive from the most loving person in their life, and explore what makes it hard to be kind to themselves if they struggle with self-criticism.'
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
        aiPromptInitial: 'Beautiful choice to start your day with mindfulness - this practice helps set a foundation of presence and self-awareness that can positively influence your entire day. Ask them to notice how they\'re feeling right now physically, emotionally, and mentally, and guide them to take conscious breaths while simply noticing what\'s present.',
        aiPromptDeepen: 'Help them notice more subtly and get specific about the quality of their energy and morning mood. Guide them to explore what it feels like to simply observe themselves without needing to change anything, fostering self-acceptance.'
      },
      {
        title: 'Body Check-In',
        stepNumber: 2,
        description: 'Awareness of physical sensations',
        aiPromptInitial: 'Guide them through a brief body scan. Ask them to notice: How does their body feel after rest? Any areas of tension or ease? Any sensations in their feet, legs, torso, arms, shoulders, neck, face? Remind them this is just noticing, not judging or trying to change anything. What does their body need today?',
        aiPromptDeepen: 'Help them go deeper into their body awareness and explore what their identified needs might look like in practice today. Guide them to notice connections between their physical sensations and emotional state this morning.'
      },
      {
        title: 'Setting Daily Intention',
        stepNumber: 3,
        description: 'Mindful intention for the day ahead',
        aiPromptInitial: 'Ask them to think about their day ahead with gentle curiosity, not overwhelm. What\'s one intention they\'d like to set? It could be "I\'ll be patient with myself," "I\'ll notice small joys," or "I\'ll take things one step at a time." Help them choose something kind and realistic. How might they remember this intention throughout their day?',
        aiPromptDeepen: 'Help them make their intention more concrete and meaningful. Guide them to explore what drew them to this particular intention and help them anticipate challenges while creating practical, gentle reminders for when they need it most.'
      },
      {
        title: 'Gratitude & Transition',
        stepNumber: 4,
        description: 'Appreciation and mindful transition',
        aiPromptInitial: 'Invite them to notice one thing they\'re grateful for right now - it could be as simple as having a place to sleep, their breath, or this moment of stillness. Ask them to feel that appreciation in their body. Then guide them to transition mindfully into their day, carrying this sense of presence and intention with them.',
        aiPromptDeepen: 'Help them really savor their gratitude by guiding them to notice how appreciation feels in their body. Support them in transitioning mindfully into their day while carrying this sense of gratitude and presence with them.'
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
        aiPromptInitial: 'Excellent choice to explore values clarification - this powerful approach from Acceptance and Commitment Therapy helps you identify your deepest principles and what you want your life to stand for. Ask them to think about what truly matters to them as a person in relationships, work, and personal growth, helping them identify 2-3 core values that resonate deeply.',
        aiPromptDeepen: 'Help them go deeper into understanding what their identified values really mean to them personally. Guide them to connect with times when they felt most authentic and explore which values make their heart feel most alive.'
      },
      {
        title: 'Values vs Goals',
        stepNumber: 2,
        description: 'Understanding the difference between values and outcomes',
        aiPromptInitial: 'Help them distinguish values from goals. Values are ongoing directions (like "being compassionate") while goals are destinations (like "help 5 people this week"). Ask: For each value they mentioned, what would living that value look like day-to-day? How would they act differently if they were fully embodying this value?',
        aiPromptDeepen: 'Help them make the values vs goals distinction more concrete by guiding them to envision specific behaviors that would demonstrate their values in daily life. Explore what it would feel like to live their values more fully.'
      },
      {
        title: 'Current Alignment Assessment',
        stepNumber: 3,
        description: 'Evaluating how well current life aligns with values',
        aiPromptInitial: 'Ask them to honestly assess their current life. On a scale of 1-10, how closely is their current life aligned with each of their core values? What areas feel most aligned? Which feel furthest from their values? Be gentle and curious, not judgmental. What gets in the way of living their values more fully?',
        aiPromptDeepen: 'Help them explore their values alignment assessment more deeply. Guide them to identify what\'s working well in aligned areas and what shifts might be needed in misaligned areas, while staying compassionate about the natural gaps between ideals and reality.'
      },
      {
        title: 'Barriers & Obstacles',
        stepNumber: 4,
        description: 'Identifying what prevents values-based living',
        aiPromptInitial: 'Explore what barriers prevent them from living their values. Is it fear? Others\' expectations? Past experiences? Difficult emotions? Help them identify specific obstacles. Remember, in ACT, we don\'t try to eliminate difficult feelings - we learn to have them while still moving toward our values. What barriers feel most significant?',
        aiPromptDeepen: 'Help them explore their identified barriers more deeply by guiding them to understand the origins and impact of these obstacles. Stay compassionate about their struggles while exploring how these barriers have affected their life and relationships.'
      },
      {
        title: 'Small Values-Based Actions',
        stepNumber: 5,
        description: 'Identifying concrete steps toward values',
        aiPromptInitial: 'Now help them identify small, concrete actions they could take this week to move closer to their values. These should be specific and achievable. For example, if they value connection, maybe "text one friend to check in" or "have dinner without phone." What small step feels both meaningful and doable for each core value?',
        aiPromptDeepen: 'Help them refine their values-based actions to ensure they\'re both meaningful and realistic. Guide them to assess their confidence in following through and adjust the actions to feel more doable while maintaining connection to their core values.'
      },
      {
        title: 'Commitment & Integration',
        stepNumber: 6,
        description: 'Making a commitment to values-based living',
        aiPromptInitial: 'Ask them to choose one small values-based action they\'ll commit to this week. Help them anticipate obstacles and plan how they\'ll handle them. Remind them that living by values is a lifelong practice, not a destination. What commitment feels right for them? How will they remember to return to their values when life gets difficult?',
        aiPromptDeepen: 'Help them strengthen their commitment by planning for obstacles and exploring self-compassion when they don\'t follow through perfectly. Guide them to see how small values-based actions can ripple out into other areas of their life and encourage them about the lifelong journey of values-based living.'
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