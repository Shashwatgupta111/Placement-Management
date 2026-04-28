/**
 * Skill descriptions for common technical skills
 * Provides brief explanations to help students understand what each skill entails
 */

export const skillDescriptions = {
  // Programming Languages
  'JavaScript': 'A versatile programming language essential for web development, both frontend and backend. Used for creating interactive web applications and server-side logic.',
  'Python': 'A high-level programming language widely used in data science, machine learning, web development, and automation. Known for its simple syntax and extensive libraries.',
  'Java': 'A robust, object-oriented programming language commonly used in enterprise applications, Android development, and large-scale systems.',
  'C++': 'A high-performance programming language used for system programming, game development, and applications requiring low-level memory management.',
  'TypeScript': 'A typed superset of JavaScript that adds static typing, making code more maintainable and suitable for large-scale applications.',
  'Go': 'A modern programming language designed for building scalable, high-performance network services and concurrent systems.',
  'Rust': 'A systems programming language focused on safety, performance, and concurrency, ideal for system-level programming.',
  'Swift': 'Apple\'s programming language for developing iOS, macOS, and other Apple platform applications.',
  'Kotlin': 'A modern programming language for Android development, fully interoperable with Java and offering more concise syntax.',

  // Web Technologies
  'React': 'A popular JavaScript library for building user interfaces, particularly single-page applications with component-based architecture.',
  'Vue.js': 'A progressive JavaScript framework for building user interfaces, known for its simplicity and flexibility.',
  'Angular': 'A comprehensive JavaScript framework for building complex web applications with TypeScript.',
  'Node.js': 'A JavaScript runtime built on Chrome\'s V8 engine for server-side development and building scalable network applications.',
  'HTML/CSS': 'Fundamental web technologies - HTML for structuring content and CSS for styling and layout of web pages.',
  'Next.js': 'A React framework that enables server-side rendering, static site generation, and optimized performance for React applications.',
  'Express.js': 'A minimal and flexible Node.js web application framework for building APIs and web applications.',

  // Databases
  'SQL': 'A domain-specific language for managing and querying relational databases. Essential for data manipulation and retrieval.',
  'MongoDB': 'A NoSQL document database that provides flexibility for storing and managing unstructured data.',
  'PostgreSQL': 'A powerful open-source relational database known for its reliability, feature robustness, and SQL compliance.',
  'MySQL': 'A popular open-source relational database management system widely used in web applications.',
  'Redis': 'An in-memory data structure store used as a database, cache, and message broker for high-performance applications.',

  // Cloud & DevOps
  'AWS': 'Amazon Web Services - A comprehensive cloud computing platform offering various services for computing, storage, and deployment.',
  'Docker': 'A platform for developing, shipping, and running applications in containers, ensuring consistency across environments.',
  'Kubernetes': 'An open-source container orchestration platform for automating deployment, scaling, and management of containerized applications.',
  'Azure': 'Microsoft\'s cloud computing platform providing a wide range of cloud services for building, deploying, and managing applications.',
  'Google Cloud': 'Google\'s cloud computing platform offering various services for computing, storage, machine learning, and data analytics.',
  'CI/CD': 'Continuous Integration/Continuous Deployment - Practices for automating software development, testing, and deployment processes.',

  // Data Science & Machine Learning
  'Machine Learning': 'The field of study that enables computers to learn and make decisions from data without being explicitly programmed.',
  'Data Science': 'An interdisciplinary field that uses scientific methods, processes, and algorithms to extract knowledge and insights from data.',
  'TensorFlow': 'An open-source machine learning framework developed by Google for building and training neural networks.',
  'PyTorch': 'An open-source machine learning library for Python based on Torch, used for applications such as computer vision and NLP.',
  'Pandas': 'A Python library for data manipulation and analysis, providing data structures and operations for manipulating numerical tables.',
  'NumPy': 'A Python library for numerical computing, providing support for large, multi-dimensional arrays and matrices.',
  'Scikit-learn': 'A Python machine learning library featuring various classification, regression, and clustering algorithms.',

  // Mobile Development
  'React Native': 'A framework for building native mobile apps using React, allowing code sharing between iOS and Android platforms.',
  'Flutter': 'Google\'s UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.',
  'iOS Development': 'The process of creating applications for Apple\'s iOS operating system using Swift or Objective-C.',
  'Android Development': 'The process of creating applications for the Android operating system using Kotlin, Java, or other supported languages.',

  // Backend & System Design
  'System Design': 'The process of designing the architecture of software systems, including components, interfaces, and interactions.',
  'Microservices': 'An architectural style that structures an application as a collection of loosely coupled, independently deployable services.',
  'REST API': 'Representational State Transfer API - An architectural style for designing networked applications using HTTP requests.',
  'GraphQL': 'A query language and runtime for APIs that allows clients to request exactly the data they need.',
  'API Design': 'The process of designing application programming interfaces that enable communication between different software systems.',
  'Authentication': 'The process of verifying user identity to ensure secure access to systems and applications.',
  'Security': 'The practice of protecting systems, networks, and data from digital attacks, unauthorized access, and damage.',

  // Tools & Frameworks
  'Git': 'A distributed version control system for tracking changes in source code during software development.',
  'GitLab': 'A web-based DevOps platform that provides Git repository management, CI/CD, and collaboration features.',
  'Jenkins': 'An open-source automation server used for building, testing, and deploying software applications.',
  'Webpack': 'A module bundler for JavaScript applications that packages and optimizes assets for web deployment.',
  'Babel': 'A JavaScript compiler that transforms ECMAScript 2015+ code into backward-compatible JavaScript.',
  'Sass': 'A CSS preprocessor that adds features like variables, nesting, and mixins to make CSS more maintainable and powerful.',

  // Testing
  'Unit Testing': 'The practice of testing individual components or functions in isolation to ensure they work as expected.',
  'Integration Testing': 'Testing how different components or modules work together to identify interface and integration issues.',
  'E2E Testing': 'End-to-end testing that validates the entire application workflow from user perspective to ensure all components work together.',

  // Other Skills
  'Agile': 'An iterative approach to project management and software development that emphasizes flexibility, collaboration, and customer feedback.',
  'Scrum': 'An agile framework for managing complex projects, focusing on iterative progress through sprints and regular team collaboration.',
  'Problem Solving': 'The ability to analyze complex problems, identify solutions, and implement effective strategies to overcome challenges.',
  'Communication': 'The skill of effectively conveying information, ideas, and feedback to team members and stakeholders.',
  'Leadership': 'The ability to guide, motivate, and influence team members to achieve common goals and objectives.',
  'Time Management': 'The practice of organizing and planning how to divide time between different activities to maximize productivity and efficiency.',
  'Teamwork': 'The collaborative effort of a group to achieve a common goal, requiring effective communication and coordination.',
  'Critical Thinking': 'The objective analysis and evaluation of information to form reasoned judgments and make informed decisions.'
};

/**
 * Get description for a skill
 * @param {string} skill - The skill name
 * @returns {string} - Description of the skill or a default message
 */
export const getSkillDescription = (skill) => {
  return skillDescriptions[skill] || 
    `${skill} is a technical skill that may require specific knowledge and practice for software development and career advancement. Click AI Tutor to get personalized learning guidance.`;
};

/**
 * Check if a skill has a detailed description
 * @param {string} skill - The skill name
 * @returns {boolean} - Whether the skill has a detailed description
 */
export const hasSkillDescription = (skill) => {
  return skillDescriptions.hasOwnProperty(skill);
};
