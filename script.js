// MODERN PROFESSIONAL INTERACTIONS WITH THEME TOGGLE

function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a subtle animation to the page
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Immediately update navbar background based on new theme
    updateNavbarBackground(newTheme);
}

function updateNavbarBackground(theme) {
    const nav = document.querySelector('nav');
    const isScrolled = window.scrollY > 50;
    
    if (theme === 'dark') {
        if (isScrolled) {
            nav.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
        }
    } else {
        if (isScrolled) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    }
}

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    document.documentElement.setAttribute('data-theme', theme);
}

// Smooth scroll behavior for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initializeTheme();
    
    // Initialize navbar background
    const initialTheme = document.documentElement.getAttribute('data-theme');
    updateNavbarBackground(initialTheme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateNavbarBackground(newTheme);
        }
    });

    // Add fade-in animation to sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add active state to navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Add navbar background on scroll
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        const theme = document.documentElement.getAttribute('data-theme');
        updateNavbarBackground(theme);
        
        if (window.scrollY > 50) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });

    // Smooth hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Initialize chatbot
    initializeChatbot();
});

// CHATBOT FUNCTIONALITY
function initializeChatbot() {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Toggle chatbot window
    chatbotToggle.addEventListener('click', function() {
        const isOpen = chatbotWindow.classList.contains('open');
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    });

    // Close chatbot
    chatbotClose.addEventListener('click', closeChatbot);

    // Send message on button click
    chatbotSend.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle suggestion button clicks
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            chatbotInput.value = question;
            sendMessage();
        });
    });

    function openChatbot() {
        chatbotWindow.classList.add('open');
        chatbotToggle.classList.add('active');
        chatbotToggle.classList.add('minimized');
        chatbotInput.focus();
    }

    function closeChatbot() {
        chatbotWindow.classList.remove('open');
        chatbotToggle.classList.remove('active');
        chatbotToggle.classList.remove('minimized');
    }

    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate AI response delay
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    function addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'U' : 'JP';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${content}</p>`;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator show';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">JP</div>
            <div class="message-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Helper function to check for fuzzy matching and common misspellings
    function fuzzyMatch(input, keywords) {
        const inputLower = input.toLowerCase();
        return keywords.some(keyword => {
            // Direct match
            if (inputLower.includes(keyword)) return true;
            
            // Check for common misspellings and variations
            const variations = getWordVariations(keyword);
            return variations.some(variation => inputLower.includes(variation));
        });
    }

    function getWordVariations(word) {
        const variations = [word];
        
        // Common misspellings and variations
        const misspellings = {
            'experience': ['experiance', 'experence', 'expirience', 'exp', 'work', 'job'],
            'programming': ['programing', 'coding', 'code', 'prog', 'software'],
            'language': ['langugage', 'lang', 'langs', 'languages'],
            'project': ['projet', 'projects', 'proj'],
            'education': ['educaton', 'school', 'university', 'degree', 'study'],
            'skill': ['skil', 'skills', 'talent', 'ability'],
            'hobby': ['hobbies', 'hobbie', 'interest', 'interests', 'free time', 'fun'],
            'korean': ['korea', 'korean language', 'hangul'],
            'english': ['enlgish', 'english language'],
            'french': ['france', 'french language'],
            'tennis': ['tenis', 'tennis ball'],
            'soccer': ['football', 'futbol', 'soccar'],
            'hiking': ['hike', 'walking', 'trekking'],
            'running': ['run', 'jog', 'jogging'],
            'contact': ['reach', 'email', 'linkedin', 'connect'],
            'name': ['legal name', 'real name', 'full name', 'ganghoon'],
            'dog': ['pet', 'puppy', 'dogs']
        };

        if (misspellings[word]) {
            variations.push(...misspellings[word]);
        }

        return variations;
    }

    function generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Name-related responses
        if (fuzzyMatch(lowerMessage, ['name', 'legal name', 'real name', 'full name', 'ganghoon'])) {
            return "James goes by James Park professionally, but his legal name is Ganghoon Park. He uses 'James' as his preferred English name for easier pronunciation and professional networking. You can call him either James or Ganghoon!";
        }
        
        // Language-related responses
        if (fuzzyMatch(lowerMessage, ['language', 'korean', 'english', 'french', 'speak', 'bilingual', 'multilingual'])) {
            return "James is multilingual! He's fluent in both Korean and English, which helps him work with diverse international teams. He also knows a little bit of French, which he's been learning in his spare time. His language skills have been valuable in his international work experience and connecting with global clients.";
        }
        
        // Hobbies and interests responses
        if (fuzzyMatch(lowerMessage, ['hobby', 'hobbies', 'interest', 'fun', 'free time', 'tennis', 'soccer', 'hiking', 'running', 'dog', 'sport', 'exercise', 'fitness'])) {
            return "James has an active lifestyle and enjoys various sports and outdoor activities! He loves playing tennis and soccer, which keep him competitive and fit. He's also passionate about hiking and exploring nature trails. One of his favorite activities is running with his dog - it's great exercise for both of them and a wonderful way to bond. These hobbies help him maintain work-life balance and stay energized for his demanding tech career.";
        }
        
        // Experience-related responses
        if (fuzzyMatch(lowerMessage, ['experience', 'work', 'job', 'career', 'professional'])) {
            return "James has 3+ years of professional experience! He's currently an AI Coding Expert & AI Trainer at Outlier, training Gen AI models across multiple programming languages. Previously, he worked as a Sales Engineer at SOTI Inc. for 2 years, where he led technical demos for 50+ enterprise customers and reduced deployment time by 200%. He also has experience as a Client Support Engineer at Andorix Inc. and has been creating technical content on YouTube since 2020.";
        }
        
        // Skills-related responses
        if (fuzzyMatch(lowerMessage, ['skill', 'programming', 'language', 'technology', 'tech', 'code', 'coding'])) {
            return "James is proficient in multiple programming languages including Java, Python, JavaScript/TypeScript, C/C++, C#, SQL, and Go. He has expertise in frameworks like React, Node.js, Express, Spring Boot, and Angular. For databases, he works with MongoDB and PostgreSQL. He's also experienced with cloud platforms (Azure, AWS), DevOps tools (Docker, Git, CI/CD), and enterprise solutions like Salesforce and Jira.";
        }
        
        // Projects-related responses
        if (fuzzyMatch(lowerMessage, ['project', 'portfolio', 'build', 'created', 'github', 'code'])) {
            return "James has worked on several impressive projects! His notable ones include a Virtual Dragon Boat Coach using OpenCap and OpenSim APIs for biomechanical analysis, SecureChat - an encrypted communication app with KDC, a Random Flag Generator using Canvas API, an AI ChatBot with NLP capabilities, and comprehensive Interview Questions & Study Notes for technical preparation. Each project showcases different aspects of his technical expertise from AI/ML to security and web development.";
        }
        
        // Education-related responses
        if (fuzzyMatch(lowerMessage, ['education', 'degree', 'university', 'study', 'school', 'mcmaster', 'engineering'])) {
            return "James holds a Bachelor of Engineering (B.Eng.) degree from McMaster University in Canada. He also has professional certifications including Microsoft Azure for Cloud Solutions, Google Analytics for Data Analysis, and Salesforce for CRM Solutions. His educational background combined with hands-on experience has given him a strong foundation in both theoretical concepts and practical applications.";
        }
        
        // Contact-related responses
        if (fuzzyMatch(lowerMessage, ['contact', 'reach', 'email', 'linkedin', 'connect', 'hire', 'work together'])) {
            return "You can reach James through his email at jamesparkgh@gmail.com or connect with him on LinkedIn at linkedin.com/in/jamesparkg/. He's also active on GitHub where you can check out his projects. Feel free to reach out for collaboration opportunities, technical discussions, or any questions about his work!";
        }
        
        // YouTube/Content creation responses
        if (fuzzyMatch(lowerMessage, ['youtube', 'content', 'tutorial', 'video', 'creator', 'channel'])) {
            return "James is an active YouTube creator specializing in programming tutorials! His content has reached over 600,000+ views and he has built an audience of 10,000+ monthly users. He creates educational content about programming, software development, and technical topics. His expertise extends to video production using Adobe Premiere Pro, Photoshop, and DaVinci Resolve.";
        }
        
        // AI/Machine Learning responses
        if (fuzzyMatch(lowerMessage, ['ai', 'artificial intelligence', 'machine learning', 'ml', 'outlier', 'rlhf'])) {
            return "James is currently working as an AI Coding Expert & AI Trainer at Outlier, where he trains Gen AI models across multiple programming languages including Java, Python, JavaScript/TypeScript, C++, Swift, and Verilog. He reviews code and debugs AI-generated solutions using RLHF (Reinforcement Learning from Human Feedback) for accuracy and scalability. His AI projects include an intelligent chatbot with NLP capabilities and various machine learning implementations.";
        }
        
        // Personal life and background
        if (fuzzyMatch(lowerMessage, ['personal', 'about', 'background', 'tell me about', 'who is', 'bio'])) {
            return "James (legal name: Ganghoon Park) is a passionate Software Engineer and AI expert from Canada. He's multilingual, speaking Korean, English, and some French. In his free time, he enjoys staying active with tennis, soccer, hiking, and running with his dog. He graduated from McMaster University with a B.Eng. and has built a successful career in tech while maintaining an active YouTube channel with 600K+ views.";
        }
        
        // Sports and fitness
        if (fuzzyMatch(lowerMessage, ['sport', 'tennis', 'soccer', 'football', 'fitness', 'exercise', 'active'])) {
            return "James is very athletic and loves staying active! He plays tennis regularly, which helps with his hand-eye coordination and strategic thinking. He also enjoys soccer (football), which keeps him in great shape and teaches teamwork. These sports complement his tech career by providing physical activity and mental breaks from coding.";
        }
        
        // Outdoor activities
        if (fuzzyMatch(lowerMessage, ['outdoor', 'hiking', 'running', 'dog', 'nature', 'trail'])) {
            return "James loves outdoor activities! He's an avid hiker who enjoys exploring nature trails and scenic routes. One of his favorite activities is running with his dog - it's a perfect combination of exercise, bonding time, and stress relief. These outdoor activities help him maintain work-life balance and often inspire creative solutions to technical problems.";
        }
        
        // General greeting responses
        if (fuzzyMatch(lowerMessage, ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'])) {
            return "Hello! Great to meet you! I'm here to tell you all about James Park (Ganghoon Park) - his experience, skills, projects, hobbies, and background. What would you like to know about him?";
        }
        
        // Achievements/accomplishments
        if (fuzzyMatch(lowerMessage, ['achievement', 'accomplishment', 'success', 'impressive', 'proud'])) {
            return "James has achieved quite a lot! He's served 50+ enterprise clients, reached 600K+ YouTube views, reduced deployment time by 200% at SOTI Inc., and has 3+ years of professional experience. He's currently training cutting-edge AI models at Outlier and has built a strong portfolio of technical projects. He's also maintained an active lifestyle with multiple sports and speaks three languages!";
        }
        
        // Default response with improved suggestions
        return "That's a great question! James (Ganghoon Park) is a versatile Software Engineer and AI Coding Expert with experience in full-stack development, AI/ML, and enterprise solutions. He's also multilingual and very athletic! Could you be more specific about what you'd like to know? You can ask about his:\n\n• Professional experience and skills\n• Projects and technical work\n• Education and certifications\n• Languages (Korean, English, French)\n• Hobbies (tennis, soccer, hiking, running)\n• Contact information\n• Personal background";
    }
}