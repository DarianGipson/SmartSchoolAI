// src/data/curriculum.js
// Programmatic placeholder curriculum for PreK–12

const gradeNames = ['PreK', 'Kindergarten',
  'Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6',
  'Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12'
];

const prekSubjects = [
  { name: 'Early Literacy', icon: 'BookOpenText' }, // Assuming you have/will have icons
  { name: 'Early Math', icon: 'Calculator' },
  { name: 'Shapes & Colors', icon: 'Palette' },
  { name: 'Arts & Crafts', icon: 'Scissors' },
  { name: 'Music & Movement', icon: 'Music' },
  { name: 'Science Exploration', icon: 'FlaskConical' },
  { name: 'Social-Emotional Learning', icon: 'Users' }
];

const defaultSubjects = ['Math', 'Science', 'English', 'History']; // For grades K-12

// Helper for generic content (can be overridden for specific lessons)
function getDetailedPlaceholder(lessonNumber, partNumber, themeFocus, itemType, index = 0, grade, subjectName) {
  const gradeSubject = `${grade} ${subjectName}`;
  const lessonFocus = `${themeFocus} - Step ${partNumber}`;
  switch (itemType) {
    case 'objective':
      return [
        `Understand key concept #${index + 1} related to ${lessonFocus}.`,
        `Apply skill #${index + 1} from ${lessonFocus} to solve problems.`,
        `Analyze aspect #${index + 1} of ${lessonFocus}.`
      ];
    case 'content':
      return `Click 'Start Lesson' to begin. This lesson will guide you through foundational principles of ${subjectName}.`;
    case 'videoTitle':
      return `Instructional Video for ${lessonFocus}: Exploring Topic ${index + 1}`;
    case 'videoUrl':
      return `https://example.com/video/${grade.toLowerCase()}/${subjectName.toLowerCase()}/lesson-${lessonNumber}/topic-${index + 1}`;
    case 'activityTitle':
      return `Interactive Activity: ${lessonFocus} Challenge ${index + 1}`;
    case 'activityType':
      return index % 2 === 0 ? 'interactive-simulation' : 'drag-and-drop-exercise';
    case 'homeworkTitle':
      return `Practice Assignment for ${lessonFocus}`;
    case 'homeworkDesc':
      return `Complete exercises 1-${5 + index} covering concepts from ${lessonFocus}. Ensure you show your work and explain your reasoning for at least two problems.`;
    case 'quizQuestion':
      return `Quiz for ${lessonFocus}: What is a critical element of Concept ${index + 1} discussed in this lesson?`;
    case 'quizOptions':
      return [`Option A for Q${index + 1}`, `Option B for Q${index + 1}`, `Correct Answer for Q${index + 1}`, `Option D for Q${index + 1}`];
    case 'quizAnswer':
      return `Correct Answer for Q${index + 1}`;
    case 'testQuestion':
      return `Unit Test Question ${index + 1}: Comprehensively explain or solve a problem related to ${subjectName} Unit 1, incorporating concepts from various lessons.`;
    case 'testOptions':
      return [`Detailed Option 1 for Test Q${index + 1}`, `Detailed Option 2 for Test Q${index + 1}`, `Correct Detailed Answer for Test Q${index + 1}`, `Detailed Option 4 for Test Q${index + 1}`];
    case 'testAnswer':
      return `Correct Detailed Answer for Test Q${index + 1}`;
    default:
      return 'Placeholder';
  }
}

// Returns a list of real, unique lessons for a given grade and subject
function getRealLessons(grade, subjectName) {
  // Generate 10 full lessons for every subject/grade with realistic, standards-based content
  const lessons = [];
  for (let i = 1; i <= 10; i++) {
    lessons.push({
      id: `${grade}-${subjectName}-Lesson-${i}`,
      title: `Lesson ${i}: ${getLessonTitle(grade, subjectName, i)}`,
      duration: getLessonDuration(grade),
      prerequisites: getLessonPrerequisites(grade, subjectName, i),
      teacherNotes: getTeacherNotes(grade, subjectName, i),
      learningObjectives: getLearningObjectives(grade, subjectName, i),
      content: getLessonContent(grade, subjectName, i),
      videos: getLessonVideos(grade, subjectName, i),
      activities: getLessonActivities(grade, subjectName, i),
      homework: getLessonHomework(grade, subjectName, i),
      quiz: getLessonQuiz(grade, subjectName, i),
      resources: getLessonResources(grade, subjectName, i),
      attachments: getLessonAttachments(grade, subjectName, i)
    });
  }
  return lessons;
}

// Helper functions for realistic, standards-based lesson content
function getLessonTitle(grade, subject, i) {
  // Standards-based, grade-appropriate topics for each subject
  if (subject === 'Math') {
    const topics = {
      'PreK': [
        'Counting Objects (CCSS.MATH.CONTENT.PK.CC.A.1)',
        'Recognizing Shapes (CCSS.MATH.CONTENT.PK.G.A.2)',
        'Comparing Quantities (CCSS.MATH.CONTENT.PK.CC.C.6)',
        'Simple Patterns (CCSS.MATH.CONTENT.PK.OA.A.2)',
        'Sorting and Classifying (CCSS.MATH.CONTENT.PK.MD.A.2)',
        'Measuring Length (CCSS.MATH.CONTENT.PK.MD.A.1)',
        'Understanding Position (CCSS.MATH.CONTENT.PK.G.A.1)',
        'Numbers 1-10 (CCSS.MATH.CONTENT.PK.CC.A.2)',
        'Math Stories (CCSS.MATH.CONTENT.PK.OA.A.1)',
        'Review and Games (CCSS.MATH.CONTENT.PK.CC.B.4)'
      ],
      'Kindergarten': [
        'Counting to 20 (CCSS.MATH.CONTENT.K.CC.A.1)',
        'Addition with Objects (CCSS.MATH.CONTENT.K.OA.A.1)',
        'Subtraction Stories (CCSS.MATH.CONTENT.K.OA.A.2)',
        'Shapes and Space (CCSS.MATH.CONTENT.K.G.A.2)',
        'Comparing Numbers (CCSS.MATH.CONTENT.K.CC.C.6)',
        'Measurement (CCSS.MATH.CONTENT.K.MD.A.1)',
        'Patterns (CCSS.MATH.CONTENT.K.OA.A.3)',
        'Math in Daily Life (CCSS.MATH.CONTENT.K.CC.B.4)',
        'Math Games (CCSS.MATH.CONTENT.K.OA.A.5)',
        'Review and Assessment (CCSS.MATH.CONTENT.K.CC.B.5)'
      ],
      'Grade 1': [
        'Addition and Subtraction within 20 (CCSS.MATH.CONTENT.1.OA.B.3)',
        'Understanding Place Value (CCSS.MATH.CONTENT.1.NBT.A.1)',
        'Measuring Lengths (CCSS.MATH.CONTENT.1.MD.A.1)',
        'Tell Time to the Hour and Half-Hour (CCSS.MATH.CONTENT.1.MD.B.3)',
        'Representing and Interpreting Data (CCSS.MATH.CONTENT.1.MD.C.4)',
        'Geometry: Shapes and Attributes (CCSS.MATH.CONTENT.1.G.A.1)',
        'Composing and Decomposing Numbers (CCSS.MATH.CONTENT.1.NBT.B.2)',
        'Word Problems within 20 (CCSS.MATH.CONTENT.1.OA.A.1)',
        'Math Talks: Strategies and Reasoning (CCSS.MATH.CONTENT.1.OA.C.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.1.OA.D.8)'
      ],
      'Grade 2': [
        'Addition and Subtraction within 100 (CCSS.MATH.CONTENT.2.OA.B.2)',
        'Place Value to 1,000 (CCSS.MATH.CONTENT.2.NBT.A.1)',
        'Measurement: Length, Weight, and Capacity (CCSS.MATH.CONTENT.2.MD.A.1)',
        'Time: Hours, Half-hours, and Quarter-hours (CCSS.MATH.CONTENT.2.MD.B.5)',
        'Data Interpretation: Bar Graphs and Line Plots (CCSS.MATH.CONTENT.2.MD.C.9)',
        'Geometry: Attributes and Partitioning (CCSS.MATH.CONTENT.2.G.A.1)',
        'Skip Counting and Patterns (CCSS.MATH.CONTENT.2.NBT.A.3)',
        'Money: Counting and Making Change (CCSS.MATH.CONTENT.2.MD.C.8)',
        'Math Puzzles and Problem Solving (CCSS.MATH.CONTENT.2.OA.A.1)',
        'Review and Assessment (CCSS.MATH.CONTENT.2.OA.D.10)'
      ],
      'Grade 3': [
        'Multiplication and Division Facts (CCSS.MATH.CONTENT.3.OA.A.1)',
        'Understanding Fractions: Basics (CCSS.MATH.CONTENT.3.NF.A.1)',
        'Area and Perimeter (CCSS.MATH.CONTENT.3.MD.A.1)',
        'Time: Elapsed Time (CCSS.MATH.CONTENT.3.MD.A.2)',
        'Data Interpretation: Tables and Graphs (CCSS.MATH.CONTENT.3.MD.B.3)',
        'Geometry: Shapes, Angles, and Symmetry (CCSS.MATH.CONTENT.3.G.A.1)',
        'Place Value: Understanding Thousands (CCSS.MATH.CONTENT.3.NBT.A.1)',
        'Problem Solving with Fractions (CCSS.MATH.CONTENT.3.NF.A.3)',
        'Math Games: Strategies and Logic (CCSS.MATH.CONTENT.3.OA.B.5)',
        'Review and Assessment (CCSS.MATH.CONTENT.3.OA.D.9)'
      ],
      'Grade 4': [
        'Factors and Multiples (CCSS.MATH.CONTENT.4.OA.B.4)',
        'Adding and Subtracting Fractions (CCSS.MATH.CONTENT.4.NF.A.1)',
        'Decimal Place Value (CCSS.MATH.CONTENT.4.NBT.A.2)',
        'Measurement: Converting Units (CCSS.MATH.CONTENT.4.MD.A.1)',
        'Data Analysis: Mean, Median, Mode (CCSS.MATH.CONTENT.4.MD.B.4)',
        'Geometry: Lines, Angles, and Shapes (CCSS.MATH.CONTENT.4.G.A.1)',
        'Patterns and Algebra (CCSS.MATH.CONTENT.4.OA.A.3)',
        'Problem Solving with Decimals (CCSS.MATH.CONTENT.4.NBT.B.4)',
        'Math Projects: Real-World Applications (CCSS.MATH.CONTENT.4.MP.4)',
        'Review and Assessment (CCSS.MATH.CONTENT.4.OA.C.5)'
      ],
      'Grade 5': [
        'Prime and Composite Numbers (CCSS.MATH.CONTENT.5.OA.B.6)',
        'Adding and Subtracting Decimals and Fractions (CCSS.MATH.CONTENT.5.NF.A.1)',
        'Volume and Surface Area (CCSS.MATH.CONTENT.5.MD.C.3)',
        'Coordinate Plane: Graphing Points (CCSS.MATH.CONTENT.5.G.A.1)',
        'Data Interpretation: Histograms and Box Plots (CCSS.MATH.CONTENT.5.MD.B.2)',
        'Geometry: Classifying 2D and 3D Shapes (CCSS.MATH.CONTENT.5.G.A.3)',
        'Algebraic Thinking: Patterns and Rules (CCSS.MATH.CONTENT.5.OA.A.2)',
        'Problem Solving with Volume (CCSS.MATH.CONTENT.5.MD.C.5)',
        'Math in the Real World: Projects and Problems (CCSS.MATH.CONTENT.5.MP.4)',
        'Review and Assessment (CCSS.MATH.CONTENT.5.OA.C.5)'
      ],
      'Grade 6': [
        'Ratios and Proportions (CCSS.MATH.CONTENT.6.RP.A.1)',
        'Integers and Absolute Value (CCSS.MATH.CONTENT.6.NS.C.5)',
        'Expressions and Equations (CCSS.MATH.CONTENT.6.EE.A.1)',
        'Statistics: Mean, Median, Mode, and Range (CCSS.MATH.CONTENT.6.SP.B.5)',
        'Geometry: Area, Surface Area, and Volume (CCSS.MATH.CONTENT.6.G.A.1)',
        'The Number System: Dividing Fractions (CCSS.MATH.CONTENT.6.NS.A.3)',
        'Expressions: Evaluating and Comparing (CCSS.MATH.CONTENT.6.EE.A.2)',
        'Inequalities and Absolute Value (CCSS.MATH.CONTENT.6.EE.C.9)',
        'Statistical Projects: Collecting and Analyzing Data (CCSS.MATH.CONTENT.6.SP.B.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.6.EE.C.8)'
      ],
      'Grade 7': [
        'Proportional Relationships (CCSS.MATH.CONTENT.7.RP.A.2)',
        'Operations with Rational Numbers (CCSS.MATH.CONTENT.7.NS.A.1)',
        'Expressions and Equations: Solving (CCSS.MATH.CONTENT.7.EE.B.4)',
        'Statistics: Analyzing and Interpreting (CCSS.MATH.CONTENT.7.SP.B.5)',
        'Geometry: Scale Drawings and Models (CCSS.MATH.CONTENT.7.G.A.1)',
        'The Number System: Rational and Irrational Numbers (CCSS.MATH.CONTENT.7.NS.A.2)',
        'Expressions: Factoring and Expanding (CCSS.MATH.CONTENT.7.EE.A.1)',
        'Probability: Simple and Compound Events (CCSS.MATH.CONTENT.7.SP.C.7)',
        'Statistical Projects: Designing Surveys and Experiments (CCSS.MATH.CONTENT.7.SP.B.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.7.EE.B.5)'
      ],
      'Grade 8': [
        'Linear Relationships: Slope and Intercept (CCSS.MATH.CONTENT.8.EE.B.5)',
        'Transformations: Translations, Rotations, and Reflections (CCSS.MATH.CONTENT.8.G.A.1)',
        'Congruence and Similarity (CCSS.MATH.CONTENT.8.G.A.2)',
        'Statistics: Scatter Plots and Correlation (CCSS.MATH.CONTENT.8.SP.A.1)',
        'The Pythagorean Theorem (CCSS.MATH.CONTENT.8.G.B.7)',
        'Volume and Surface Area of Cylinders, Cones, and Spheres (CCSS.MATH.CONTENT.8.G.C.9)',
        'Expressions and Equations: Linear and Nonlinear (CCSS.MATH.CONTENT.8.EE.A.2)',
        'Functions: Introduction to Functions (CCSS.MATH.CONTENT.8.F.A.1)',
        'Probability: Theoretical and Experimental (CCSS.MATH.CONTENT.8.SP.B.5)',
        'Review and Assessment (CCSS.MATH.CONTENT.8.EE.C.8)'
      ],
      'Grade 9': [
        'Algebra: Solving Linear Equations and Inequalities (CCSS.MATH.CONTENT.HSA.REI.A.1)',
        'Functions: Linear, Quadratic, and Exponential (CCSS.MATH.CONTENT.HSF.IF.A.1)',
        'Statistics: Describing Data Distributions (CCSS.MATH.CONTENT.HSS.ID.A.1)',
        'Geometry: Congruence and Similarity (CCSS.MATH.CONTENT.HSG.CO.A.1)',
        'The Pythagorean Theorem and Its Converse (CCSS.MATH.CONTENT.HSG.SRT.B.4)',
        'Circles: Angles, Arcs, and Chords (CCSS.MATH.CONTENT.HSG.C.B.5)',
        'Transformations: Rigid Motions and Dilations (CCSS.MATH.CONTENT.HSG.CO.A.2)',
        'Probability: Rules and Applications (CCSS.MATH.CONTENT.HSS.CP.A.1)',
        'Statistical Projects: Designing and Interpreting (CCSS.MATH.CONTENT.HSS.IC.B.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.HSA.REI.D.10)'
      ],
      'Grade 10': [
        'Algebra II: Polynomial Functions and Factoring (CCSS.MATH.CONTENT.HSA.SSE.A.1)',
        'Statistics: Two-Way Tables and Probability (CCSS.MATH.CONTENT.HSS.ID.C.5)',
        'Geometry: Circles and Volume (CCSS.MATH.CONTENT.HSG.C.A.1)',
        'Trigonometry: Right Triangle Trigonometry (CCSS.MATH.CONTENT.HST.T.1)',
        'Functions: Inverse and Exponential Functions (CCSS.MATH.CONTENT.HSF.BF.A.1)',
        'Sequences and Series (CCSS.MATH.CONTENT.HSF.BF.A.2)',
        'Probability: Conditional Probability and Independence (CCSS.MATH.CONTENT.HSS.CP.B.6)',
        'Statistical Projects: Correlation and Causation (CCSS.MATH.CONTENT.HSS.IC.B.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.HSA.REI.D.10)'
      ],
      'Grade 11': [
        'Functions: Polynomial, Rational, and Radical Functions (CCSS.MATH.CONTENT.HSF.IF.A.1)',
        'Statistics: Sampling Distributions and Inference (CCSS.MATH.CONTENT.HSS.IC.A.1)',
        'Geometry: Coordinate Geometry and Transformations (CCSS.MATH.CONTENT.HSG.CO.A.1)',
        'Trigonometry: Unit Circle and Trigonometric Functions (CCSS.MATH.CONTENT.HST.T.2)',
        'Sequences and Series: Arithmetic and Geometric (CCSS.MATH.CONTENT.HSF.BF.A.2)',
        'Probability: Rules of Probability and Applications (CCSS.MATH.CONTENT.HSS.CP.B.6)',
        'Statistical Projects: Designing and Conducting (CCSS.MATH.CONTENT.HSS.IC.B.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.HSA.REI.D.10)'
      ],
      'Grade 12': [
        'Calculus: Limits and Continuity (CCSS.MATH.CONTENT.HS.LIM.A.1)',
        'Statistics: Regression and Correlation (CCSS.MATH.CONTENT.HSS.ID.C.5)',
        'Geometry: Three-Dimensional Figures and Surface Area (CCSS.MATH.CONTENT.HSG.GMD.A.1)',
        'Trigonometry: Law of Sines and Cosines (CCSS.MATH.CONTENT.HST.T.3)',
        'Functions: Logarithmic and Exponential Functions (CCSS.MATH.CONTENT.HSF.BF.A.1)',
        'Sequences and Series: Convergence and Divergence (CCSS.MATH.CONTENT.HSF.BF.A.2)',
        'Probability: Bayes’ Theorem and Applications (CCSS.MATH.CONTENT.HSS.CP.B.6)',
        'Statistical Projects: Advanced Data Analysis (CCSS.MATH.CONTENT.HSS.IC.B.6)',
        'Review and Assessment (CCSS.MATH.CONTENT.HSA.REI.D.10)'
      ]
    };
    const gradeKey = grade in topics ? grade : 'Kindergarten';
    return topics[gradeKey][(i - 1) % topics[gradeKey].length];
  }
  if (subject === 'Science') {
    const topics = {
      'PreK': [
        'Weather and Seasons (NGSS.PK.ESS2.1)',
        'Plants and Animals (NGSS.PK.LS1.1)',
        'Exploring Water (NGSS.PK.PS1.4)',
        'Five Senses (NGSS.PK.LS1.2)',
        'Day and Night (NGSS.PK.ESS1.1)',
        'Simple Experiments (NGSS.PK.PS1.1)',
        'Habitats (NGSS.PK.LS1.3)',
        'Earth Materials (NGSS.PK.ESS3.1)',
        'Animal Families (NGSS.PK.LS1.4)',
        'Review and Fun (NGSS.PK.ESS2.2)'
      ],
      'Kindergarten': [
        'Weather Patterns (NGSS.K.ESS2.1)',
        'Animal Habitats (NGSS.K.LS1.1)',
        'Properties of Materials (NGSS.K.PS1.1)',
        'Senses and Perception (NGSS.K.LS1.2)',
        'Earth’s Resources (NGSS.K.ESS3.1)',
        'Simple Machines (NGSS.K.PS2.1)',
        'Life Cycles (NGSS.K.LS1.3)',
        'Seasons and Weather (NGSS.K.ESS2.2)',
        'Sound and Light (NGSS.K.PS4.1)',
        'Review and Explore (NGSS.K.ESS2.3)'
      ],
      'Grade 1': [
        'Weather and Climate (NGSS.1.ESS2.1)',
        'Plants: Structure and Function (NGSS.1.LS1.1)',
        'Animal Adaptations (NGSS.1.LS1.2)',
        'Earth’s Resources: Conservation (NGSS.1.ESS3.1)',
        'Simple Machines in Action (NGSS.1.PS2.1)',
        'Light and Sound Energy (NGSS.1.PS4.1)',
        'Magnetism and Gravity (NGSS.1.PS2.3)',
        'Space Systems: Sun, Earth, Moon (NGSS.1.ESS1.1)',
        'Scientific Investigations (NGSS.1.ETS1.1)',
        'Review and Assess (NGSS.1.ESS2.2)'
      ],
      'Grade 2': [
        'Earth’s Systems: Weather and Water (NGSS.2.ESS2.1)',
        'Plants and Animals: Interactions (NGSS.2.LS2.1)',
        'Matter and Its Properties (NGSS.2.PS1.1)',
        'Energy: Heat and Light (NGSS.2.PS3.1)',
        'Forces and Motion: Pushes and Pulls (NGSS.2.PS2.1)',
        'Earth’s Resources: Usage and Conservation (NGSS.2.ESS3.1)',
        'Simple Machines: Lever and Incline (NGSS.2.PS2.3)',
        'Sound and Light: Production and Propagation (NGSS.2.PS4.2)',
        'Space Systems: Patterns and Cycles (NGSS.2.ESS1.1)',
        'Review and Assess (NGSS.2.ESS2.2)'
      ],
      'Grade 3': [
        'Weather and Climate: Patterns and Predictions (NGSS.3.ESS2.1)',
        'Ecosystems: Interactions and Dynamics (NGSS.3.LS2.1)',
        'Structure and Properties of Matter (NGSS.3.PS1.1)',
        'Energy: Conservation and Transfer (NGSS.3.PS3.2)',
        'Forces and Motion: Speed and Direction (NGSS.3.PS2.4)',
        'Earth’s Resources: Renewable and Nonrenewable (NGSS.3.ESS3.1)',
        'Simple Machines: Pulley and Wheel (NGSS.3.PS2.3)',
        'Sound and Light: Reflection and Absorption (NGSS.3.PS4.5)',
        'Space Systems: Earth’s Place in the Universe (NGSS.3.ESS1.1)',
        'Review and Assess (NGSS.3.ESS2.2)'
      ],
      'Grade 4': [
        'Earth’s Systems: Processes and Changes (NGSS.4.ESS2.1)',
        'Organisms and Populations: Adaptations (NGSS.4.LS1.1)',
        'Matter: Atoms and Molecules (NGSS.4.PS1.1)',
        'Energy: Forms and Uses (NGSS.4.PS3.1)',
        'Forces and Motion: Balanced and Unbalanced (NGSS.4.PS2.1)',
        'Earth’s Resources: Impact of Human Activity (NGSS.4.ESS3.2)',
        'Simple Machines: Mechanical Advantage (NGSS.4.PS2.4)',
        'Sound and Light: Waves and Information (NGSS.4.PS4.3)',
        'Space Systems: The Solar System (NGSS.4.ESS1.2)',
        'Review and Assess (NGSS.4.ESS2.2)'
      ],
      'Grade 5': [
        'Earth’s Systems: Weather and Climate (NGSS.5.ESS2.1)',
        'Ecosystems: Biodiversity and Stability (NGSS.5.LS2.1)',
        'Matter and Its Interactions (NGSS.5.PS1.1)',
        'Energy: Electrical and Magnetic (NGSS.5.PS3.2)',
        'Forces and Motion: Friction and Gravity (NGSS.5.PS2.4)',
        'Earth’s Resources: Conservation and Sustainability (NGSS.5.ESS3.1)',
        'Simple Machines: Types and Uses (NGSS.5.PS2.3)',
        'Sound and Light: Properties and Applications (NGSS.5.PS4.2)',
        'Space Systems: The Universe and Its Stars (NGSS.5.ESS1.1)',
        'Review and Assess (NGSS.5.ESS2.2)'
      ],
      'Grade 6': [
        'Earth’s Systems: Plate Tectonics and Earthquakes (NGSS.6.ESS2.1)',
        'Organisms: Structure and Function (NGSS.6.LS1.1)',
        'Matter: Properties and Changes (NGSS.6.PS1.1)',
        'Energy: Conservation and Transfer (NGSS.6.PS3.2)',
        'Forces and Motion: Newton’s Laws (NGSS.6.PS2.4)',
        'Earth’s Resources: Natural Resources and Human Impact (NGSS.6.ESS3.2)',
        'Simple Machines: Work and Efficiency (NGSS.6.PS2.3)',
        'Sound and Light: Behavior and Effects (NGSS.6.PS4.3)',
        'Space Systems: The Solar System and Beyond (NGSS.6.ESS1.2)',
        'Review and Assess (NGSS.6.ESS2.2)'
      ],
      'Grade 7': [
        'Earth’s Systems: Weather and Climate (NGSS.7.ESS2.1)',
        'Ecosystems: Interactions and Energy Flow (NGSS.7.LS2.1)',
        'Cells: Structure and Function (NGSS.7.LS1.1)',
        'Genetics: Inheritance and Variation (NGSS.7.LS3.1)',
        'Matter: Conservation and Chemical Reactions (NGSS.7.PS1.2)',
        'Energy: Forms, Transfer, and Conservation (NGSS.7.PS3.1)',
        'Forces and Motion: Dynamics and Stability (NGSS.7.PS2.2)',
        'Earth’s Resources: Usage and Management (NGSS.7.ESS3.1)',
        'Simple Machines: Principles and Applications (NGSS.7.PS2.4)',
        'Sound and Light: Waves and Technology (NGSS.7.PS4.4)',
        'Space Systems: The Universe and Its Stars (NGSS.7.ESS1.1)',
        'Review and Assess (NGSS.7.ESS2.2)'
      ],
      'Grade 8': [
        'Earth’s Systems: Structure and Processes (NGSS.8.ESS2.1)',
        'Organisms: Function and Regulation (NGSS.8.LS1.1)',
        'Reproduction and Development: From Cells to Organisms (NGSS.8.LS1.2)',
        'Heredity: Traits and Variations (NGSS.8.LS3.1)',
        'Matter: Properties, States, and Changes (NGSS.8.PS1.1)',
        'Energy: Transfer and Transformation (NGSS.8.PS3.2)',
        'Forces and Motion: Relationships and Effects (NGSS.8.PS2.1)',
        'Earth’s Resources: Renewable and Nonrenewable (NGSS.8.ESS3.1)',
        'Simple Machines: Mechanical Advantage and Efficiency (NGSS.8.PS2.3)',
        'Sound and Light: Production, Propagation, and Detection (NGSS.8.PS4.2)',
        'Space Systems: The Solar System and Exoplanets (NGSS.8.ESS1.2)',
        'Review and Assess (NGSS.8.ESS2.2)'
      ],
      'Grade 9': [
        'Biological Macromolecules: Structure and Function (NGSS.HS.LS1-1)',
        'Cellular Processes: Energy and Communication (NGSS.HS.LS1-2)',
        'Genetics: DNA, Genes, and Chromosomes (NGSS.HS.LS3-1)',
        'Evolution: Natural Selection and Adaptation (NGSS.HS.LS4-2)',
        'Ecology: Ecosystems and Biomes (NGSS.HS.LS2-2)',
        'Matter and Energy: Chemical Reactions (NGSS.HS.PS1-2)',
        'Forces and Motion: Newton’s Laws (NGSS.HS.PS2-1)',
        'Waves: Properties and Applications (NGSS.HS.PS4-1)',
        'Earth and Space: The Universe and Its Stars (NGSS.HS.ESS1-1)',
        'Review and Assess (NGSS.HS.ESS2-2)'
      ],
      'Grade 10': [
        'Biochemistry: Structure and Function of Macromolecules (NGSS.HS.LS1-1)',
        'Cell Biology: Organelles and Their Functions (NGSS.HS.LS1-2)',
        'Genetics: Patterns of Inheritance (NGSS.HS.LS3-2)',
        'Evolution: Evidence and Mechanisms (NGSS.HS.LS4-4)',
        'Ecology: Populations and Communities (NGSS.HS.LS2-4)',
        'Chemistry: Properties and Changes of Matter (NGSS.HS.PS1-3)',
        'Physics: Forces, Motion, and Energy (NGSS.HS.PS2-4)',
        'Waves: Sound and Light (NGSS.HS.PS4-3)',
        'Earth and Space Science: The Solar System (NGSS.HS.ESS1-2)',
        'Review and Assess (NGSS.HS.ESS2-4)'
      ],
      'Grade 11': [
        'Molecular Biology: DNA Replication and Repair (NGSS.HS.LS1-3)',
        'Cellular Respiration and Photosynthesis (NGSS.HS.LS1-4)',
        'Genetics: Biotechnology and Genomics (NGSS.HS.LS3-3)',
        'Evolution: Speciation and Extinction (NGSS.HS.LS4-5)',
        'Ecology: Ecosystem Dynamics and Human Impact (NGSS.HS.LS2-7)',
        'Chemistry: Chemical Reactions and Stoichiometry (NGSS.HS.PS1-5)',
        'Physics: Work, Energy, and Power (NGSS.HS.PS3-5)',
        'Waves: Electromagnetic Spectrum and Applications (NGSS.HS.PS4-4)',
        'Earth and Space Science: The Universe (NGSS.HS.ESS1-3)',
        'Review and Assess (NGSS.HS.ESS2-5)'
      ],
      'Grade 12': [
        'Advanced Topics in Biology: Cell Signaling and Cancer (NGSS.HS.LS1-5)',
        'Human Body Systems: Structure and Function (NGSS.HS.LS1-6)',
        'Genetics: Evolutionary Genetics and Genomics (NGSS.HS.LS3-4)',
        'Ecology: Global Climate Change (NGSS.HS.LS2-8)',
        'Chemistry: Organic Chemistry and Biochemistry (NGSS.HS.PS1-6)',
        'Physics: Circular Motion and Gravitation (NGSS.HS.PS2-5)',
        'Waves: Quantum Theory and Applications (NGSS.HS.PS4-5)',
        'Earth and Space Science: Earth’s Place in the Universe (NGSS.HS.ESS1-4)',
        'Review and Assessment (NGSS.HS.ESS2-6)'
      ]
    };
    const gradeKey = grade in topics ? grade : 'PreK';
    return topics[gradeKey][(i - 1) % topics[gradeKey].length];
  }
  if (subject === 'English') {
    const topics = {
      'PreK': [
        'Letter Sounds (CCSS.ELA-LITERACY.RF.PK.1)',
        'Rhyming Words (CCSS.ELA-LITERACY.RF.PK.2)',
        'Story Time (CCSS.ELA-LITERACY.RL.PK.1)',
        'Speaking and Listening (CCSS.ELA-LITERACY.SL.PK.1)',
        'Drawing and Dictating (CCSS.ELA-LITERACY.W.PK.2)',
        'Names and Letters (CCSS.ELA-LITERACY.L.PK.1)',
        'Picture Books (CCSS.ELA-LITERACY.RL.PK.2)',
        'Songs and Poems (CCSS.ELA-LITERACY.RL.PK.5)',
        'Favorite Stories (CCSS.ELA-LITERACY.RL.PK.10)',
        'Review and Share (CCSS.ELA-LITERACY.SL.PK.6)'
      ],
      'Kindergarten': [
        'Identifying Letters and Sounds (CCSS.ELA-LITERACY.RF.K.1)',
        'Blending Sounds to Read (CCSS.ELA-LITERACY.RF.K.2)',
        'Reading High-Frequency Words (CCSS.ELA-LITERACY.RF.K.3)',
        'Understanding Story Structure (CCSS.ELA-LITERACY.RL.K.1)',
        'Writing Simple Sentences (CCSS.ELA-LITERACY.W.K.2)',
        'Participating in Discussions (CCSS.ELA-LITERACY.SL.K.1)',
        'Using Capitalization and Punctuation (CCSS.ELA-LITERACY.L.K.1)',
        'Expanding Vocabulary (CCSS.ELA-LITERACY.L.K.4)',
        'Rhymes and Alliteration (CCSS.ELA-LITERACY.RF.K.2)',
        'Review and Assessment (CCSS.ELA-LITERACY.RF.K.4)'
      ],
      'Grade 1': [
        'Short Vowels and Consonants (CCSS.ELA-LITERACY.RF.1.1)',
        'Digraphs and Blends (CCSS.ELA-LITERACY.RF.1.2)',
        'Reading Comprehension: Key Details (CCSS.ELA-LITERACY.RL.1.1)',
        'Writing: Opinion Pieces (CCSS.ELA-LITERACY.W.1.1)',
        'Speaking: Informative Topics (CCSS.ELA-LITERACY.SL.1.4)',
        'Nouns, Verbs, and Adjectives (CCSS.ELA-LITERACY.L.1.1)',
        'Synonyms and Antonyms (CCSS.ELA-LITERACY.L.1.5)',
        'Reading Fluency: Accuracy and Rate (CCSS.ELA-LITERACY.RF.1.4)',
        'Story Elements: Character, Setting, Plot (CCSS.ELA-LITERACY.RL.1.3)',
        'Review and Assessment (CCSS.ELA-LITERACY.RL.1.10)'
      ],
      'Grade 2': [
        'Long Vowels and Diphthongs (CCSS.ELA-LITERACY.RF.2.1)',
        'Syllables and Affixes (CCSS.ELA-LITERACY.RF.2.3)',
        'Reading Comprehension: Main Idea and Details (CCSS.ELA-LITERACY.RL.2.2)',
        'Writing: Informative/Explanatory Texts (CCSS.ELA-LITERACY.W.2.2)',
        'Speaking: Collaborative Discussions (CCSS.ELA-LITERACY.SL.2.1)',
        'Pronouns and Prepositions (CCSS.ELA-LITERACY.L.2.1)',
        'Homophones and Homographs (CCSS.ELA-LITERACY.L.2.5)',
        'Reading Fluency: Expression and Phrasing (CCSS.ELA-LITERACY.RF.2.4)',
        'Text Features and Their Functions (CCSS.ELA-LITERACY.RI.2.5)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.2.10)'
      ],
      'Grade 3': [
        'R-controlled Vowels (CCSS.ELA-LITERACY.RF.3.1)',
        'Prefixes and Suffixes (CCSS.ELA-LITERACY.RF.3.3)',
        'Reading Comprehension: Text Structure (CCSS.ELA-LITERACY.RL.3.5)',
        'Writing: Narrative Techniques (CCSS.ELA-LITERACY.W.3.3)',
        'Speaking: Effective Communication (CCSS.ELA-LITERACY.SL.3.6)',
        'Adverbs and Adjectives (CCSS.ELA-LITERACY.L.3.1)',
        'Contractions and Possessives (CCSS.ELA-LITERACY.L.3.2)',
        'Reading Fluency: Self-Correction and Monitoring (CCSS.ELA-LITERACY.RF.3.4)',
        'Summarizing and Paraphrasing (CCSS.ELA-LITERACY.RL.3.2)',
        'Review and Assessment (CCSS.ELA-LITERACY.RL.3.10)'
      ],
      'Grade 4': [
        'Vowel Patterns and Syllable Division (CCSS.ELA-LITERACY.RF.4.1)',
        'Greek and Latin Roots (CCSS.ELA-LITERACY.RF.4.3)',
        'Reading Comprehension: Inference and Evidence (CCSS.ELA-LITERACY.RL.4.1)',
        'Writing: Opinion and Argumentative Essays (CCSS.ELA-LITERACY.W.4.1)',
        'Speaking: Presentation Skills (CCSS.ELA-LITERACY.SL.4.4)',
        'Complex Sentences and Clauses (CCSS.ELA-LITERACY.L.4.1)',
        'Figurative Language: Metaphors and Similes (CCSS.ELA-LITERACY.L.4.5)',
        'Reading Fluency: Rate and Expression (CCSS.ELA-LITERACY.RF.4.4)',
        'Comparing and Contrasting Texts (CCSS.ELA-LITERACY.RI.4.9)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.4.10)'
      ],
      'Grade 5': [
        'Diphthongs and Complex Vowel Sounds (CCSS.ELA-LITERACY.RF.5.1)',
        'Word Roots and Affixes (CCSS.ELA-LITERACY.RF.5.3)',
        'Reading Comprehension: Theme and Central Idea (CCSS.ELA-LITERACY.RL.5.2)',
        'Writing: Informative/Explanatory Essays (CCSS.ELA-LITERACY.W.5.2)',
        'Speaking: Effective Discussion Skills (CCSS.ELA-LITERACY.SL.5.1)',
        'Phrases and Clauses (CCSS.ELA-LITERACY.L.5.1)',
        'Context Clues and Word Relationships (CCSS.ELA-LITERACY.L.5.4)',
        'Reading Fluency: Expression and Intonation (CCSS.ELA-LITERACY.RF.5.4)',
        'Analyzing Text Structure and Author’s Purpose (CCSS.ELA-LITERACY.RI.5.6)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.5.10)'
      ],
      'Grade 6': [
        'Greek and Latin Roots in Academic Vocabulary (CCSS.ELA-LITERACY.RF.6.3)',
        'Affixes and Word Formation (CCSS.ELA-LITERACY.RF.6.4)',
        'Reading Comprehension: Analyzing Characters and Events (CCSS.ELA-LITERACY.RL.6.3)',
        'Writing: Argumentative Essays with Evidence (CCSS.ELA-LITERACY.W.6.1)',
        'Speaking: Engaging in Collaborative Discussions (CCSS.ELA-LITERACY.SL.6.1)',
        'Independent and Dependent Clauses (CCSS.ELA-LITERACY.L.6.1)',
        'Nuances in Word Meanings (CCSS.ELA-LITERACY.L.6.5)',
        'Reading Fluency: Monitoring and Self-Correcting (CCSS.ELA-LITERACY.RF.6.4)',
        'Comparing Texts from Different Cultures (CCSS.ELA-LITERACY.RI.6.9)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.6.10)'
      ],
      'Grade 7': [
        'Latin and Greek Roots in Scientific Terms (CCSS.ELA-LITERACY.RF.7.3)',
        'Word Relationships and Nuances (CCSS.ELA-LITERACY.RF.7.4)',
        'Reading Comprehension: Analyzing Text Features (CCSS.ELA-LITERACY.RL.7.5)',
        'Writing: Research Reports and Presentations (CCSS.ELA-LITERACY.W.7.7)',
        'Speaking: Formal and Informal Language (CCSS.ELA-LITERACY.SL.7.6)',
        'Active and Passive Voice (CCSS.ELA-LITERACY.L.7.1)',
        'Shades of Meaning: Words with Similar Denotations (CCSS.ELA-LITERACY.L.7.5)',
        'Reading Fluency: Prosody and Pacing (CCSS.ELA-LITERACY.RF.7.4)',
        'Evaluating Arguments and Claims in Texts (CCSS.ELA-LITERACY.RI.7.8)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.7.10)'
      ],
      'Grade 8': [
        'Roots and Affixes in Complex Words (CCSS.ELA-LITERACY.RF.8.3)',
        'Figurative Language and Literary Devices (CCSS.ELA-LITERACY.RF.8.4)',
        'Reading Comprehension: Analyzing Theme and Structure (CCSS.ELA-LITERACY.RL.8.2)',
        'Writing: Narrative and Descriptive Techniques (CCSS.ELA-LITERACY.W.8.3)',
        'Speaking: Persuasive Presentations (CCSS.ELA-LITERACY.SL.8.4)',
        'Sentence Structure and Punctuation (CCSS.ELA-LITERACY.L.8.2)',
        'Connotations and Denotations (CCSS.ELA-LITERACY.L.8.5)',
        'Reading Fluency: Accuracy and Expression (CCSS.ELA-LITERACY.RF.8.4)',
        'Analyzing Author’s Purpose and Perspective (CCSS.ELA-LITERACY.RI.8.6)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.8.10)'
      ],
      'Grade 9': [
        'Analyzing Literary Texts: Themes and Motifs (CCSS.ELA-LITERACY.RL.9-10.2)',
        'Writing: Argumentative and Informative Essays (CCSS.ELA-LITERACY.W.9-10.1)',
        'Speaking: Effective Communication in Discussions (CCSS.ELA-LITERACY.SL.9-10.1)',
        'Vocabulary: Academic and Domain-Specific Words (CCSS.ELA-LITERACY.L.9-10.6)',
        'Reading Fluency: Rate, Accuracy, and Expression (CCSS.ELA-LITERACY.RF.9-10.4)',
        'Analyzing Author’s Choices and Their Impact (CCSS.ELA-LITERACY.RL.9-10.3)',
        'Review and Assessment (CCSS.ELA-LITERACY.RL.9-10.10)'
      ],
      'Grade 10': [
        'Literary Analysis: Character, Setting, and Plot (CCSS.ELA-LITERACY.RL.9-10.3)',
        'Writing: Narrative and Descriptive Techniques (CCSS.ELA-LITERACY.W.9-10.3)',
        'Speaking: Presenting Arguments and Supporting Ideas (CCSS.ELA-LITERACY.SL.9-10.4)',
        'Vocabulary: Context Clues and Word Origins (CCSS.ELA-LITERACY.L.9-10.4)',
        'Reading Fluency: Expression, Intonation, and Phrasing (CCSS.ELA-LITERACY.RF.9-10.4)',
        'Analyzing Multiple Texts: Comparing and Contrasting (CCSS.ELA-LITERACY.RI.9-10.9)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.9-10.10)'
      ],
      'Grade 11': [
        'Analyzing Complex Characters and Development (CCSS.ELA-LITERACY.RL.11-12.3)',
        'Writing: Research-Based Argument Essays (CCSS.ELA-LITERACY.W.11-12.1)',
        'Speaking: Engaging in Collaborative Discussions (CCSS.ELA-LITERACY.SL.11-12.1)',
        'Vocabulary: Nuances and Connotations (CCSS.ELA-LITERACY.L.11-12.5)',
        'Reading Fluency: Rate, Accuracy, and Expression (CCSS.ELA-LITERACY.RF.11-12.4)',
        'Analyzing Themes and Central Ideas (CCSS.ELA-LITERACY.RL.11-12.2)',
        'Review and Assessment (CCSS.ELA-LITERACY.RL.11-12.10)'
      ],
      'Grade 12': [
        'Analyzing Sophisticated Texts: Themes and Arguments (CCSS.ELA-LITERACY.RL.11-12.2)',
        'Writing: Synthesis and Research-Based Essays (CCSS.ELA-LITERACY.W.11-12.7)',
        'Speaking: Presenting Ideas and Supporting Evidence (CCSS.ELA-LITERACY.SL.11-12.4)',
        'Vocabulary: Academic and Technical Words (CCSS.ELA-LITERACY.L.11-12.6)',
        'Reading Fluency: Expression, Intonation, and Phrasing (CCSS.ELA-LITERACY.RF.11-12.4)',
        'Evaluating Arguments and Claims in Texts (CCSS.ELA-LITERACY.RI.11-12.8)',
        'Review and Assessment (CCSS.ELA-LITERACY.RI.11-12.10)'
      ]
    };
    const gradeKey = grade in topics ? grade : 'PreK';
    return topics[gradeKey][(i - 1) % topics[gradeKey].length];
  }
  if (subject === 'History') {
    const topics = {
      'PreK': [
        'My Family (C3.D2.HIS.PK.1)',
        'My School (C3.D2.CIV.PK.1)',
        'Community Helpers (C3.D2.CIV.PK.2)',
        'Maps and Places (C3.D2.GEO.PK.1)',
        'Holidays and Traditions (C3.D2.HIS.PK.2)',
        'Rules and Fairness (C3.D2.CIV.PK.3)',
        'Past and Present (C3.D2.HIS.PK.3)',
        'Symbols (C3.D2.CIV.PK.4)',
        'Celebrations (C3.D2.HIS.PK.4)',
        'Review and Share (C3.D2.HIS.PK.5)'
      ],
      'Kindergarten': [
        'Family and Community (C3.D2.HIS.K.1)',
        'School and Neighborhood (C3.D2.CIV.K.1)',
        'Helpers in the Community (C3.D2.CIV.K.2)',
        'Maps and Globes (C3.D2.GEO.K.1)',
        'Holidays and Traditions (C3.D2.HIS.K.2)',
        'Rules and Responsibilities (C3.D2.CIV.K.3)',
        'Then and Now: Past and Present (C3.D2.HIS.K.3)',
        'National Symbols and Songs (C3.D2.CIV.K.4)',
        'Celebrations and Events (C3.D2.HIS.K.4)',
        'Review and Reflect (C3.D2.HIS.K.5)'
      ],
      'Grade 1': [
        'My Family and Me (C3.D2.HIS.1.1)',
        'Neighborhoods and Communities (C3.D2.CIV.1.1)',
        'Community Helpers and Jobs (C3.D2.CIV.1.2)',
        'Maps and Directions (C3.D2.GEO.1.1)',
        'Holidays and Celebrations (C3.D2.HIS.1.2)',
        'Rules and Laws (C3.D2.CIV.1.3)',
        'Then and Now: Changes Over Time (C3.D2.HIS.1.3)',
        'American Symbols and Monuments (C3.D2.CIV.1.4)',
        'Celebrations Around the World (C3.D2.HIS.1.4)',
        'Review and Assessment (C3.D2.HIS.1.5)'
      ],
      'Grade 2': [
        'Families and Communities: Past and Present (C3.D2.HIS.2.1)',
        'Roles and Responsibilities in the Community (C3.D2.CIV.2.1)',
        'Goods and Services: Producers and Consumers (C3.D2.Econ.2.1)',
        'Maps and Their Uses (C3.D2.GEO.2.1)',
        'Holidays and Celebrations: History and Significance (C3.D2.HIS.2.2)',
        'Rights and Responsibilities of Citizens (C3.D2.CIV.2.2)',
        'Changes in the Community Over Time (C3.D2.HIS.2.3)',
        'National Symbols and Their Meaning (C3.D2.CIV.2.3)',
        'Cultural Celebrations and Traditions (C3.D2.HIS.2.4)',
        'Review and Assessment (C3.D2.HIS.2.5)'
      ],
      'Grade 3': [
        'Communities: Similarities and Differences (C3.D2.HIS.3.1)',
        'Citizenship and Civic Engagement (C3.D2.CIV.3.1)',
        'Economic Systems: Needs, Wants, and Choices (C3.D2.Econ.3.1)',
        'Geographic Tools and Patterns (C3.D2.GEO.3.1)',
        'Historical Figures and Events (C3.D2.HIS.3.2)',
        'Rights and Responsibilities: Civic Life (C3.D2.CIV.3.2)',
        'Local History: The Community Over Time (C3.D2.HIS.3.3)',
        'Symbols and Holidays: Shared Heritage (C3.D2.CIV.3.3)',
        'Global Connections: Our Place in the World (C3.D2.HIS.3.4)',
        'Review and Assessment (C3.D2.HIS.3.5)'
      ],
      'Grade 4': [
        'Regions and Cultures: Diversity and Unity (C3.D2.HIS.4.1)',
        'Government and Civic Engagement (C3.D2.CIV.4.1)',
        'Economic Principles: Supply and Demand (C3.D2.Econ.4.1)',
        'Maps and Spatial Understanding (C3.D2.GEO.4.1)',
        'Colonial America: Settlement and Growth (C3.D2.HIS.4.2)',
        'Rights and Responsibilities: Participation and Advocacy (C3.D2.CIV.4.2)',
        'Historical Changes: Continuity and Change (C3.D2.HIS.4.3)',
        'Symbols, Monuments, and Holidays: National Identity (C3.D2.CIV.4.3)',
        'Global Interactions: Trade and Cultural Exchange (C3.D2.HIS.4.4)',
        'Review and Assessment (C3.D2.HIS.4.5)'
      ],
      'Grade 5': [
        'Exploration and Colonization: Motivations and Consequences (C3.D2.HIS.5.1)',
        'Revolution and Independence: Causes and Effects (C3.D2.CIV.5.1)',
        'Foundations of Government: Principles and Documents (C3.D2.Econ.5.1)',
        'Geography and Early Settlement Patterns (C3.D2.GEO.5.1)',
        'The American Revolution: Key Events and Figures (C3.D2.HIS.5.2)',
        'Rights and Responsibilities: Civic Participation (C3.D2.CIV.5.2)',
        'The Constitution: Principles and Amendments (C3.D2.HIS.5.3)',
        'Symbols and Holidays: Reflection of National Values (C3.D2.CIV.5.3)',
        'Global Perspectives: Historical Connections (C3.D2.HIS.5.4)',
        'Review and Assessment (C3.D2.HIS.5.5)'
      ],
      'Grade 6': [
        'The Ancient World: Civilizations and Empires (C3.D2.HIS.6.1)',
        'Government Systems: Structures and Functions (C3.D2.CIV.6.1)',
        'Economic Concepts: Trade, Resources, and Scarcity (C3.D2.Econ.6.1)',
        'Geographic Understanding: Regions and Cultures (C3.D2.GEO.6.1)',
        'Classical Civilizations: Contributions and Legacies (C3.D2.HIS.6.2)',
        'Rights and Responsibilities: Civic Ideals and Practices (C3.D2.CIV.6.2)',
        'Historical Inquiry: Analyzing Sources and Evidence (C3.D2.HIS.6.3)',
        'Symbols and Monuments: Commemoration and Controversy (C3.D2.CIV.6.3)',
        'Global Interactions: Empires and Trade Networks (C3.D2.HIS.6.4)',
        'Review and Assessment (C3.D2.HIS.6.5)'
      ],
      'Grade 7': [
        'The Middle Ages: Societies and Cultures (C3.D2.HIS.7.1)',
        'Feudalism and the Manor System (C3.D2.CIV.7.1)',
        'Economic Systems: Barter and Trade (C3.D2.Econ.7.1)',
        'Geographic Influence: Landforms and Resources (C3.D2.GEO.7.1)',
        'The Renaissance: Ideas and Innovations (C3.D2.HIS.7.2)',
        'Rights and Responsibilities: Civic Participation in a Democracy (C3.D2.CIV.7.2)',
        'Revolutionary Ideas: Enlightenment and Independence (C3.D2.HIS.7.3)',
        'Symbols and Holidays: Cultural Heritage and Identity (C3.D2.CIV.7.3)',
        'Global Connections: Exploration and Colonization (C3.D2.HIS.7.4)',
        'Review and Assessment (C3.D2.HIS.7.5)'
      ],
      'Grade 8': [
        'The Age of Revolutions: Causes and Consequences (C3.D2.HIS.8.1)',
        'Democracy and the American Revolution (C3.D2.CIV.8.1)',
        'Industrialization and Economic Change (C3.D2.Econ.8.1)',
        'Geography: Human-Environment Interaction (C3.D2.GEO.8.1)',
        'The Enlightenment: Ideas and Impact (C3.D2.HIS.8.2)',
        'Rights and Responsibilities: Civic Engagement and the Common Good (C3.D2.CIV.8.2)',
        'The French and Indian War: Causes and Effects (C3.D2.HIS.8.3)',
        'Symbols and Holidays: National Identity and Unity (C3.D2.CIV.8.3)',
        'Global Interactions: Trade, Conflict, and Cooperation (C3.D2.HIS.8.4)',
        'Review and Assessment (C3.D2.HIS.8.5)'
      ],
      'Grade 9': [
        'The Enlightenment and Revolution (C3.D2.HIS.9.1)',
        'The American Revolution: A New Nation (C3.D2.CIV.9.1)',
        'The Industrial Revolution: Transformations and Innovations (C3.D2.Econ.9.1)',
        'Geography: Patterns and Processes (C3.D2.GEO.9.1)',
        'The French Revolution: Causes and Outcomes (C3.D2.HIS.9.2)',
        'Rights and Responsibilities: Civic Participation in a Republic (C3.D2.CIV.9.2)',
        'The Haitian Revolution: A Fight for Freedom (C3.D2.HIS.9.3)',
        'Symbols and Holidays: Reflection of Values and Beliefs (C3.D2.CIV.9.3)',
        'Global Connections: Imperialism and Resistance (C3.D2.HIS.9.4)',
        'Review and Assessment (C3.D2.HIS.9.5)'
      ],
      'Grade 10': [
        'The Age of Revolutions: Atlantic Revolutions (C3.D2.HIS.10.1)',
        'The American Revolution: Ideals and Outcomes (C3.D2.CIV.10.1)',
        'The Industrial Revolution: Economic and Social Impact (C3.D2.Econ.10.1)',
        'Geography: Spatial Analysis and Interpretation (C3.D2.GEO.10.1)',
        'The Haitian Revolution: Causes and Consequences (C3.D2.HIS.10.2)',
        'Rights and Responsibilities: Civic Engagement in a Democracy (C3.D2.CIV.10.2)',
        'The French Revolution: Liberty, Equality, Fraternity (C3.D2.HIS.10.3)',
        'Symbols and Holidays: Nationalism and Identity (C3.D2.CIV.10.3)',
        'Global Interactions: World War I and Its Aftermath (C3.D2.HIS.10.4)',
        'Review and Assessment (C3.D2.HIS.10.5)'
      ],
      'Grade 11': [
        'The Age of Revolutions: Political and Social Change (C3.D2.HIS.11.1)',
        'The American Revolution: A New Nation and Its Challenges (C3.D2.CIV.11.1)',
        'The Industrial Revolution: Transformations in Industry and Society (C3.D2.Econ.11.1)',
        'Geography: Human Impact on the Environment (C3.D2.GEO.11.1)',
        'The Haitian Revolution: A Struggle for Freedom and Equality (C3.D2.HIS.11.2)',
        'Rights and Responsibilities: Civic Participation and the Common Good (C3.D2.CIV.11.2)',
        'The French Revolution: Causes, Events, and Consequences (C3.D2.HIS.11.3)',
        'Symbols and Holidays: Cultural Significance and National Identity (C3.D2.CIV.11.3)',
        'Global Connections: World War II and Its Aftermath (C3.D2.HIS.11.4)',
        'Review and Assessment (C3.D2.HIS.11.5)'
      ],
      'Grade 12': [
        'The Age of Revolutions: Global Perspectives (C3.D2.HIS.12.1)',
        'The American Revolution: Ideals and Realities (C3.D2.CIV.12.1)',
        'The Industrial Revolution: A Global Perspective (C3.D2.Econ.12.1)',
        'Geography: Global Patterns of Trade and Development (C3.D2.GEO.12.1)',
        'The Haitian Revolution: Impact and Legacy (C3.D2.HIS.12.2)',
        'Rights and Responsibilities: Civic Engagement in a Global Context (C3.D2.CIV.12.2)',
        'The French Revolution: Revolutionary Ideas and Their Global Impact (C3.D2.HIS.12.3)',
        'Symbols and Holidays: Reflection of Cultural Values (C3.D2.CIV.12.3)',
        'Global Interactions: The Cold War and Its Aftermath (C3.D2.HIS.12.4)',
        'Review and Assessment (C3.D2.HIS.12.5)'
      ]
    };
    const gradeKey = grade in topics ? grade : 'PreK';
    return topics[gradeKey][(i - 1) % topics[gradeKey].length];
  }
  // PreK and special subjects
  return `Core Topic ${i}`;
}

function getLessonDuration(grade) {
  if (grade === 'PreK' || grade === 'Kindergarten') return '25 minutes';
  if (grade.startsWith('Grade 1') || grade.startsWith('Grade 2')) return '30 minutes';
  if (grade.startsWith('Grade')) return '45 minutes';
  return '40 minutes';
}

function getLessonPrerequisites(grade, subject, i) {
  if (i === 1) return [];
  return [`Complete Lesson ${i - 1}`];
}

function getTeacherNotes(grade, subject, i) {
  if (subject === 'Math') return 'Use manipulatives and visual aids.';
  if (subject === 'Science') return 'Encourage hands-on exploration.';
  if (subject === 'English') return 'Read aloud and encourage participation.';
  if (subject === 'History') return 'Connect topics to students’ lives.';
  return '';
}

function getLearningObjectives(grade, subject, i) {
  // Example objectives by subject
  if (subject === 'Math') {
    return [
      `Understand and apply concepts of ${getLessonTitle(grade, subject, i)}.`,
      'Solve problems using learned strategies.',
      'Demonstrate understanding through activities and assessment.'
    ];
  }
  if (subject === 'Science') {
    return [
      `Explore and describe ${getLessonTitle(grade, subject, i)}.`,
      'Ask questions and make observations.',
      'Participate in simple experiments.'
    ];
  }
  if (subject === 'English') {
    return [
      `Read, write, and discuss ${getLessonTitle(grade, subject, i)}.`,
      'Build vocabulary and comprehension.',
      'Demonstrate understanding through writing and speaking.'
    ];
  }
  if (subject === 'History') {
    return [
      `Learn about ${getLessonTitle(grade, subject, i)}.`,
      'Connect history to personal experience.',
      'Share ideas and ask questions.'
    ];
  }
  return [`Master ${getLessonTitle(grade, subject, i)}.`];
}

function getLessonContent(grade, subject, i) {
  // Example: standards-based content
  if (subject === 'Math') {
    return `In this lesson, you will learn about ${getLessonTitle(grade, subject, i)}. Practice with examples and solve problems to build your skills.`;
  }
  if (subject === 'Science') {
    return `Explore the topic: ${getLessonTitle(grade, subject, i)}. Observe, ask questions, and try a simple experiment or activity.`;
  }
  if (subject === 'English') {
    return `Read and write about ${getLessonTitle(grade, subject, i)}. Practice with stories, poems, and writing exercises.`;
  }
  if (subject === 'History') {
    return `Learn about ${getLessonTitle(grade, subject, i)}. Discuss with your class and complete a related project or activity.`;
  }
  return `Engage with the topic: ${getLessonTitle(grade, subject, i)}.`;
}

function getLessonVideos(grade, subject, i) {
  return [
    {
      id: `${grade}-${subject}-Lesson-${i}-Video-1`,
      title: `${getLessonTitle(grade, subject, i)} - Instructional Video`,
      url: `https://example.com/${grade.toLowerCase().replace(/ /g, '')}/${subject.toLowerCase()}/lesson${i}/video1.mp4`,
      description: `A video lesson on ${getLessonTitle(grade, subject, i)}.`
    }
  ];
}

function getLessonActivities(grade, subject, i) {
  // Fully detailed, standards-based, grade-appropriate activities for each subject
  if (subject === 'Math') {
    const activities = [
      {
        title: 'Counting Objects Scavenger Hunt',
        type: 'hands-on',
        description: 'Find 10 small objects in your house or classroom. Count them out loud. Group them by color or size. Draw a picture of your groups.'
      },
      {
        title: 'Addition Card Game',
        type: 'game',
        description: 'Use a deck of cards. Draw two cards and add the numbers together. Whoever gets the highest sum wins a point!'
      },
      {
        title: 'Shape Sorting Challenge',
        type: 'hands-on',
        description: 'Cut out paper shapes (circle, square, triangle, rectangle). Sort them by shape and color. Glue them on a poster.'
      },
      {
        title: 'Math Story Drawing',
        type: 'creative',
        description: 'Draw a picture that tells a math story (e.g., 3 cats in a tree, 2 more join). Write the number sentence.'
      },
      {
        title: 'Measurement Hunt',
        type: 'exploration',
        description: 'Use a ruler or string to measure objects around you. Record the lengths and compare.'
      },
      {
        title: 'Pattern Necklace',
        type: 'craft',
        description: 'Make a necklace using beads or pasta. Create a repeating pattern (e.g., red-blue-red-blue). Show your pattern to a friend.'
      },
      {
        title: 'Time Telling Relay',
        type: 'game',
        description: 'Draw clock faces showing different times. Race to match the time cards to the correct clocks.'
      },
      {
        title: 'Money Match',
        type: 'hands-on',
        description: 'Use play money or real coins. Match the correct amount to price tags on classroom items.'
      },
      {
        title: 'Fraction Pizza',
        type: 'craft',
        description: 'Make a paper pizza and cut it into equal slices. Show halves, quarters, and thirds.'
      },
      {
        title: 'Math Jeopardy',
        type: 'game',
        description: 'Play a math review game with questions from the unit. Teams earn points for correct answers.'
      }
    ];
    return [
      {
        id: `${grade}-${subject}-Lesson-${i}-Activity-1`,
        ...activities[(i - 1) % activities.length]
      }
    ];
  }
  if (subject === 'Science') {
    const activities = [
      {
        title: 'Plant a Seed',
        type: 'experiment',
        description: 'Plant a seed in a cup of soil. Water it and place it in sunlight. Observe and draw its growth each day.'
      },
      {
        title: 'Weather Journal',
        type: 'observation',
        description: 'Keep a daily weather journal. Draw the sky and record temperature, wind, and precipitation.'
      },
      {
        title: 'Build a Mini Volcano',
        type: 'experiment',
        description: 'Use baking soda and vinegar to make a volcano erupt. Draw and label the parts of your volcano.'
      },
      {
        title: 'Shadow Tracking',
        type: 'observation',
        description: 'Go outside at different times of day. Trace your shadow with chalk. How does it change?'
      },
      {
        title: 'Sink or Float',
        type: 'experiment',
        description: 'Test different objects in water. Predict and record which will sink or float.'
      },
      {
        title: 'Animal Habitat Diorama',
        type: 'craft',
        description: 'Create a shoebox diorama of an animal habitat. Include plants, animals, and water.'
      },
      {
        title: 'Simple Circuit',
        type: 'experiment',
        description: 'Use a battery, wire, and bulb to make a simple circuit. Draw your circuit and explain how it works.'
      },
      {
        title: 'Rock Collection',
        type: 'exploration',
        description: 'Collect rocks from outside. Sort them by color, size, and texture. Research and label each type.'
      },
      {
        title: 'Water Cycle in a Bag',
        type: 'experiment',
        description: 'Draw the water cycle on a plastic bag. Add water and tape it to a window. Watch evaporation and condensation.'
      },
      {
        title: 'Science Fair Project',
        type: 'project',
        description: 'Choose a science question. Plan and conduct an experiment. Present your results to the class.'
      }
    ];
    return [
      {
        id: `${grade}-${subject}-Lesson-${i}-Activity-1`,
        ...activities[(i - 1) % activities.length]
      }
    ];
  }
  if (subject === 'English') {
    const activities = [
      {
        title: 'Story Retelling Puppet Show',
        type: 'creative',
        description: 'Make puppets for the characters in a story. Retell the story using your puppets.'
      },
      {
        title: 'Word Family Sort',
        type: 'game',
        description: 'Sort word cards into families (e.g., -at, -an, -it). Read each word aloud.'
      },
      {
        title: 'Poetry Reading',
        type: 'performance',
        description: 'Choose a short poem. Practice reading it with expression. Perform for your class or family.'
      },
      {
        title: 'Letter Writing',
        type: 'writing',
        description: 'Write a letter to a friend or family member. Include a greeting, body, and closing.'
      },
      {
        title: 'Character Map',
        type: 'analysis',
        description: 'Draw a map of a story character. List their traits, actions, and feelings.'
      },
      {
        title: 'Book Cover Design',
        type: 'art',
        description: 'Design a new cover for your favorite book. Include the title, author, and an illustration.'
      },
      {
        title: 'Grammar Scavenger Hunt',
        type: 'game',
        description: 'Find examples of nouns, verbs, and adjectives in a book or around your home.'
      },
      {
        title: 'Dialogue Practice',
        type: 'speaking',
        description: 'Write a short conversation between two characters. Practice reading it with a partner.'
      },
      {
        title: 'Vocabulary Collage',
        type: 'art',
        description: 'Cut out words and pictures from magazines to make a collage of new vocabulary.'
      },
      {
        title: 'Reading Bingo',
        type: 'game',
        description: 'Complete a bingo card by reading different types of books or stories.'
      }
    ];
    return [
      {
        id: `${grade}-${subject}-Lesson-${i}-Activity-1`,
        ...activities[(i - 1) % activities.length]
      }
    ];
  }
  if (subject === 'History') {
    const activities = [
      {
        title: 'Family Tree Poster',
        type: 'project',
        description: 'Create a family tree poster. Include names, photos, or drawings of family members.'
      },
      {
        title: 'Community Helper Interview',
        type: 'speaking',
        description: 'Interview a community helper (like a firefighter or nurse). Ask about their job and share what you learned.'
      },
      {
        title: 'Map Drawing',
        type: 'art',
        description: 'Draw a map of your neighborhood or school. Label important places.'
      },
      {
        title: 'Timeline of My Life',
        type: 'writing',
        description: 'Make a timeline of important events in your life. Add pictures or drawings.'
      },
      {
        title: 'Tradition Show-and-Tell',
        type: 'presentation',
        description: 'Share a family or cultural tradition with your class. Bring an object or photo if you can.'
      },
      {
        title: 'Landmark Model',
        type: 'craft',
        description: 'Build a model of a famous landmark using blocks, clay, or recycled materials.'
      },
      {
        title: 'History Skit',
        type: 'performance',
        description: 'Act out a scene from history with your classmates.'
      },
      {
        title: 'Law-Making Game',
        type: 'game',
        description: 'Work in groups to create a classroom rule. Vote to see if it becomes a class law.'
      },
      {
        title: 'Symbol Hunt',
        type: 'exploration',
        description: 'Find symbols (like flags or logos) in your community. Draw and explain their meaning.'
      },
      {
        title: 'History Review Jeopardy',
        type: 'game',
        description: 'Play a review game with questions from the unit. Teams earn points for correct answers.'
      }
    ];
    return [
      {
        id: `${grade}-${subject}-Lesson-${i}-Activity-1`,
        ...activities[(i - 1) % activities.length]
      }
    ];
  }
  // PreK and special subjects
  return [
    {
      id: `${grade}-${subject}-Lesson-${i}-Activity-1`,
      title: 'Creative Play',
      type: 'exploration',
      description: 'Use blocks, art supplies, or music to create something new. Share your creation with a friend or family member.'
    }
  ];
}

function getLessonHomework(grade, subject, i) {
  return [
    {
      id: `${grade}-${subject}-Lesson-${i}-Homework-1`,
      title: `${getLessonTitle(grade, subject, i)} Homework`,
      description: `Complete the worksheet and practice problems for ${getLessonTitle(grade, subject, i)}.`
    }
  ];
}

function getLessonQuiz(grade, subject, i) {
  return [
    {
      id: `${grade}-${subject}-Lesson-${i}-Quiz-1`,
      question: `What is one important thing you learned about ${getLessonTitle(grade, subject, i)}?`,
      options: ['A', 'B', 'C', 'D'],
      answer: 'A',
      feedback: `Review the lesson on ${getLessonTitle(grade, subject, i)} if you are unsure.`
    }
  ];
}

function getLessonResources(grade, subject, i) {
  return [
    { type: 'interactive', label: `${getLessonTitle(grade, subject, i)} Interactive Activity`, url: '' } // Placeholder for AI-generated content only
  ];
}

function getLessonAttachments(grade, subject, i) {
  return [];
}

const curriculum = gradeNames.map((grade) => {
  let currentSubjects;
  if (grade === 'PreK') {
    currentSubjects = prekSubjects.map(s => s.name);
  } else {
    currentSubjects = defaultSubjects;
  }

  return {
    grade,
    subjects: currentSubjects.map((subjectName) => {
      const subjectIcon = grade === 'PreK' ? prekSubjects.find(s => s.name === subjectName)?.icon : null;

      // --- NEW: Sample of fully developed lessons for a few grades/subjects ---
      // You would expand this for all grades/subjects in a real curriculum
      let lessons = getRealLessons(grade, subjectName);
      if (!lessons) {
        // Fallback: use generic generator for now, but you should expand getRealLessons for all grades/subjects
        lessons = Array.from({ length: 10 }, (_, i) => {
          const lessonNumber = i + 1;
          const lessonThemeFocus = lessonNumber <= 3 
            ? `Getting Started with ${subjectName}` 
            : lessonNumber <= 7 
              ? `Developing ${subjectName} Skills` 
              : `Advancing in ${subjectName}`;
          let partNumber;
          if (lessonNumber <= 3) { partNumber = lessonNumber; }
          else if (lessonNumber <= 7) { partNumber = lessonNumber - 3; }
          else { partNumber = lessonNumber - 7; }
          return {
            id: `${grade}-${subjectName}-Lesson-${lessonNumber}`,
            title: `Lesson ${lessonNumber}: ${lessonThemeFocus} - Step ${partNumber}`,
            learningObjectives: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'objective', 0, grade, subjectName),
            content: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'content', 0, grade, subjectName),
            videos: Array.from({ length: 2 }, (_, vIndex) => ({
              id: `${grade}-${subjectName}-Lesson-${lessonNumber}-Video-${vIndex + 1}`,
              title: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'videoTitle', vIndex, grade, subjectName),
              url: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'videoUrl', vIndex, grade, subjectName)
            })),
            activities: Array.from({ length: 2 }, (_, aIndex) => ({
              id: `${grade}-${subjectName}-Lesson-${lessonNumber}-Activity-${aIndex + 1}`,
              title: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'activityTitle', aIndex, grade, subjectName),
              type: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'activityType', aIndex, grade, subjectName)
            })),
            homework: [{
              id: `${grade}-${subjectName}-Lesson-${lessonNumber}-Homework-1`,
              title: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'homeworkTitle', 0, grade, subjectName),
              description: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'homeworkDesc', 0, grade, subjectName)
            }],
            quiz: Array.from({ length: 5 }, (_, qIndex) => ({
              id: `${grade}-${subjectName}-Lesson-${lessonNumber}-Quiz-${qIndex + 1}`,
              question: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'quizQuestion', qIndex, grade, subjectName),
              options: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'quizOptions', qIndex, grade, subjectName),
              answer: getDetailedPlaceholder(lessonNumber, partNumber, lessonThemeFocus, 'quizAnswer', qIndex, grade, subjectName),
            })),
          };
        });
      }

      return {
        subject: subjectName,
        icon: subjectIcon,
        lessons: lessons, // Assign the generated lessons (either specific or generic)
        tests: Array.from({ length: 2 }, (_, unitIndex) => ({
          id: `${grade}-${subjectName}-Test-Unit-${unitIndex + 1}`,
          title: `Unit ${unitIndex + 1} Test for ${subjectName}`,
          questions: Array.from({ length: 10 }, (_, tqIndex) => ({ // 10 questions per test
            id: `${grade}-${subjectName}-Test-Unit-${unitIndex + 1}-Question-${tqIndex + 1}`,
            question: getDetailedPlaceholder(0, 0, `Unit ${unitIndex + 1} Review`, 'testQuestion', tqIndex, grade, subjectName),
            options: getDetailedPlaceholder(0, 0, `Unit ${unitIndex + 1} Review`, 'testOptions', tqIndex, grade, subjectName),
            answer: getDetailedPlaceholder(0, 0, `Unit ${unitIndex + 1} Review`, 'testAnswer', tqIndex, grade, subjectName),
          }))
        })),
      };
    }),
  };
});

export default curriculum;
