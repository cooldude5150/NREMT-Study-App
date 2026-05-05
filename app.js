document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentCategory = null;
    let quizLength = 0;
    let currentQuestionIndex = 0;
    let quizQuestions = [];
    let score = 0;
    let currentAnswers = []; // For Order questions
    let selectedOption = null; // For MCQ/TF
    let resultsSummaryData = [];
    let sortableInstance = null;
    let isChallengeMode = false;
    let challengeStreak = 0;

    // DOM Elements
    const screens = {
        landing: document.getElementById('landing-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen')
    };

    const categoryBtns = document.querySelectorAll('#category-selection .setup-btn:not(.disabled)');
    const lengthBtns = document.querySelectorAll('#length-selection .setup-btn');
    const startBtn = document.getElementById('start-quiz-btn');

    // Quiz Elements
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const categoryBadge = document.getElementById('category-badge');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const submitBtn = document.getElementById('submit-btn');
    
    // New Features Elements
    const infoBtn = document.getElementById('info-btn');
    const closeInfoBtn = document.getElementById('close-info-btn');
    const infoModal = document.getElementById('category-info-modal');
    
    const openStudyBtn = document.getElementById('open-study-btn');
    const closeStudyBtn = document.getElementById('close-study-btn');
    const studyScreen = document.getElementById('study-screen');
    const studyTabs = document.querySelectorAll('.study-tab');
    const studyContent = document.getElementById('study-content');
    const nextBtn = document.getElementById('next-btn');

    // Modal
    const feedbackModal = document.getElementById('feedback-modal');
    const modalContinueBtn = document.getElementById('modal-continue-btn');

    // Initialize Multipliers in LocalStorage
    function getLearningStats() {
        const stats = localStorage.getItem('nremt_learning_stats');
        return stats ? JSON.parse(stats) : {};
    }

    function saveLearningStats(stats) {
        localStorage.setItem('nremt_learning_stats', JSON.stringify(stats));
    }

    function updateQuestionStat(questionId, isCorrect) {
        const stats = getLearningStats();
        if (!stats[questionId]) {
            stats[questionId] = { streak: 0 };
        }

        if (isCorrect) {
            stats[questionId].streak = stats[questionId].streak > 0 ? stats[questionId].streak + 1 : 1;
        } else {
            stats[questionId].streak = stats[questionId].streak < 0 ? stats[questionId].streak - 1 : -1;
        }

        saveLearningStats(stats);
    }

    // Dynamic Learning Selection Algorithm
    function selectQuestions(category, count) {
        let allCategoryQuestions = [];
        if (category === 'Mixed') {
            allCategoryQuestions = [
                ...window.questionBank.skills,
                ...window.questionBank.understanding,
                ...window.questionBank.questions
            ];
        } else {
            allCategoryQuestions = window.questionBank[category.toLowerCase()] || [];
        }

        if (allCategoryQuestions.length === 0) return [];

        const stats = getLearningStats();
        
        // Calculate weight for each question
        let weightedQuestions = allCategoryQuestions.map(q => {
            let weight = 1.0;
            const qStats = stats[q.id];
            if (qStats) {
                if (qStats.streak < 0) {
                    // Wrong answers: 1x -> 1.1x, 2x -> 1.3x, 3x+ -> 1.5x
                    const wrongCount = Math.abs(qStats.streak);
                    if (wrongCount === 1) weight = 1.1;
                    else if (wrongCount === 2) weight = 1.3;
                    else weight = 1.5;
                } else if (qStats.streak > 0) {
                    // Correct answers: inverse of wrong multipliers (less likely to show)
                    const correctCount = qStats.streak;
                    if (correctCount === 1) weight = 0.9;
                    else if (correctCount === 2) weight = 0.7;
                    else weight = 0.5;
                }
            }
            // Add slight randomness to base weight
            weight = weight * (Math.random() * 0.5 + 0.5); 
            return { question: q, weight: weight };
        });

        // Sort by weight descending
        weightedQuestions.sort((a, b) => b.weight - a.weight);

        // Select top 'count' questions (or max available)
        const selected = weightedQuestions.slice(0, count).map(wq => wq.question);
        
        // Shuffle the selected questions
        return selected.sort(() => Math.random() - 0.5);
    }

    // Setup Event Listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            currentCategory = e.target.dataset.category;
            checkSetupReady();
        });
    });

    lengthBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            lengthBtns.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            const lengthVal = e.target.dataset.length;
            if (lengthVal === 'challenge') {
                quizLength = 'challenge';
            } else {
                quizLength = parseInt(lengthVal);
            }
            checkSetupReady();
        });
    });

    function checkSetupReady() {
        if (currentCategory && quizLength) {
            startBtn.removeAttribute('disabled');
        }
    }

    startBtn.addEventListener('click', () => {
        isChallengeMode = (quizLength === 'challenge');
        challengeStreak = 0;

        // Prepare Quiz
        let fetchCount = isChallengeMode ? 300 : quizLength;
        quizQuestions = selectQuestions(currentCategory, fetchCount);
        
        if (quizQuestions.length === 0) {
            alert('No questions available for this category yet.');
            return;
        }
        
        if (!isChallengeMode) {
            quizLength = Math.min(quizLength, quizQuestions.length);
            quizQuestions = quizQuestions.slice(0, quizLength);
        }

        currentQuestionIndex = 0;
        score = 0;
        resultsSummaryData = [];
        
        const standardProgress = document.getElementById('standard-progress');
        const challengeTracker = document.getElementById('challenge-tracker');
        const questionCounter = document.getElementById('question-counter');

        if (isChallengeMode) {
            standardProgress.classList.add('hidden');
            challengeTracker.classList.remove('hidden');
            questionCounter.classList.add('hidden');
            challengeTracker.innerHTML = '';
            for (let i = 0; i < 10; i++) {
                const blip = document.createElement('div');
                blip.className = 'challenge-blip';
                challengeTracker.appendChild(blip);
            }
        } else {
            standardProgress.classList.remove('hidden');
            challengeTracker.classList.add('hidden');
            questionCounter.classList.remove('hidden');
        }
        
        switchScreen('quiz');
        loadQuestion();
    });

    function switchScreen(screenName) {
        Object.values(screens).forEach(s => s.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    function loadQuestion() {
        // Endless reshuffle for challenge mode
        if (isChallengeMode && currentQuestionIndex >= quizQuestions.length) {
            quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
            currentQuestionIndex = 0;
        }

        const q = quizQuestions[currentQuestionIndex];
        
        // Update Meta
        categoryBadge.textContent = currentCategory;
        if (!isChallengeMode) {
            questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizLength}`;
            progressBar.style.width = `${((currentQuestionIndex) / quizLength) * 100}%`;
        }
        
        // Reset state
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        optionsContainer.innerHTML = '';
        selectedOption = null;
        if (sortableInstance) {
            sortableInstance.destroy();
            sortableInstance = null;
        }
        if (window.matchingSortables) {
            window.matchingSortables.forEach(s => s.destroy());
            window.matchingSortables = null;
        }

        questionText.textContent = q.question;

        if (q.type === 'MCQ' || q.type === 'TF') {
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedOption = opt;
                });
                optionsContainer.appendChild(btn);
            });
        } else if (q.type === 'ORDER') {
            const ul = document.createElement('ul');
            ul.className = 'sortable-list';
            ul.id = 'sortable-list';
            
            const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(opt => {
                const li = document.createElement('li');
                li.className = 'sortable-item';
                li.textContent = opt;
                li.dataset.value = opt;
                ul.appendChild(li);
            });
            optionsContainer.appendChild(ul);
            
            sortableInstance = new Sortable(ul, {
                animation: 150,
                ghostClass: 'sortable-ghost'
            });
            // Auto select for order, it just reads the DOM on submit
            selectedOption = "order-present"; 
        } else if (q.type === 'MATCHING') {
            const container = document.createElement('div');
            container.className = 'matching-container';
            
            const grid = document.createElement('div');
            grid.className = 'matching-grid';
            
            const bankWrapper = document.createElement('div');
            bankWrapper.className = 'matching-bank-wrapper';
            
            const bankTitle = document.createElement('div');
            bankTitle.className = 'matching-bank-title';
            bankTitle.textContent = 'Drag from here:';
            bankWrapper.appendChild(bankTitle);

            const bank = document.createElement('div');
            bank.className = 'matching-bank';
            bank.id = 'matching-bank';
            bankWrapper.appendChild(bank);
            
            const keys = Object.keys(q.pairs);
            const values = Object.values(q.pairs);
            const shuffledValues = [...values].sort(() => Math.random() - 0.5);
            
            window.matchingSortables = [];
            
            keys.forEach(key => {
                const row = document.createElement('div');
                row.className = 'matching-row';
                
                const keyEl = document.createElement('div');
                keyEl.className = 'matching-key';
                keyEl.textContent = key;
                
                const dropzone = document.createElement('div');
                dropzone.className = 'matching-dropzone';
                dropzone.dataset.key = key;
                
                row.appendChild(keyEl);
                row.appendChild(dropzone);
                grid.appendChild(row);
                
                const dzSortable = new Sortable(dropzone, {
                    group: { name: 'matching', put: function (to) { return to.el.children.length < 1; } },
                    animation: 150
                });
                window.matchingSortables.push(dzSortable);
            });
            
            shuffledValues.forEach(val => {
                const item = document.createElement('div');
                item.className = 'matching-item';
                item.textContent = val;
                item.dataset.value = val;
                bank.appendChild(item);
            });
            
            container.appendChild(grid);
            container.appendChild(bankWrapper);
            optionsContainer.appendChild(container);
            
            const bankSortable = new Sortable(bank, {
                group: 'matching',
                animation: 150
            });
            window.matchingSortables.push(bankSortable);
            
            selectedOption = "matching-present";
        }
    }

    submitBtn.addEventListener('click', () => {
        const q = quizQuestions[currentQuestionIndex];
        let isCorrect = false;

        if (q.type === 'ORDER') {
            const items = document.querySelectorAll('.sortable-item');
            const userOrder = Array.from(items).map(item => item.dataset.value);
            // Check if arrays are identical
            isCorrect = JSON.stringify(userOrder) === JSON.stringify(q.answer);
            
            items.forEach((item, index) => {
                if (item.dataset.value === q.answer[index]) {
                    item.style.borderColor = 'var(--correct-color)';
                    item.style.color = 'var(--correct-color)';
                } else {
                    item.style.borderColor = 'var(--wrong-color)';
                    item.style.color = 'var(--wrong-color)';
                }
            });
            if (sortableInstance) sortableInstance.options.disabled = true;

        } else if (q.type === 'MATCHING') {
            let allCorrect = true;
            const dropzones = document.querySelectorAll('.matching-dropzone');
            
            dropzones.forEach(dz => {
                const key = dz.dataset.key;
                const correctValue = q.pairs[key];
                
                if (dz.children.length === 0) {
                    allCorrect = false;
                    dz.style.borderColor = 'var(--wrong-color)';
                } else {
                    const droppedItem = dz.children[0];
                    if (droppedItem.dataset.value === correctValue) {
                        dz.style.borderColor = 'var(--correct-color)';
                        droppedItem.style.color = 'var(--correct-color)';
                    } else {
                        allCorrect = false;
                        dz.style.borderColor = 'var(--wrong-color)';
                        droppedItem.style.color = 'var(--wrong-color)';
                    }
                }
            });
            
            isCorrect = allCorrect;
            if (window.matchingSortables) {
                window.matchingSortables.forEach(s => s.options.disabled = true);
            }

        } else {
            if (!selectedOption) return; // Force selection
            isCorrect = (selectedOption === q.answer);
            
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.textContent === q.answer) {
                    btn.classList.add('correct');
                } else if (btn.classList.contains('selected') && !isCorrect) {
                    btn.classList.add('wrong');
                }
            });
        }

        if (isCorrect) score++;
        
        if (isChallengeMode) {
            if (isCorrect) {
                challengeStreak++;
            } else {
                challengeStreak = 0;
            }
        }
        
        updateQuestionStat(q.id, isCorrect);
        
        resultsSummaryData.push({
            question: q.question,
            correct: isCorrect
        });

        submitBtn.classList.add('hidden');
        
        // Show Feedback
        showFeedback(isCorrect, q.explanation);
    });

    function showFeedback(isCorrect, explanation) {
        feedbackModal.classList.remove('hidden');
        feedbackModal.classList.remove('correct-modal', 'wrong-modal');
        feedbackModal.classList.add(isCorrect ? 'correct-modal' : 'wrong-modal');
        
        document.getElementById('feedback-title').textContent = isCorrect ? 'Correct!' : 'Incorrect';
        document.getElementById('feedback-icon').textContent = isCorrect ? '✓' : '✗';
        document.getElementById('feedback-icon').style.color = isCorrect ? 'var(--correct-color)' : 'var(--wrong-color)';
        document.getElementById('feedback-explanation').textContent = explanation;
    }

    modalContinueBtn.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
        
        if (isChallengeMode) {
            // Update UI Blips
            const blips = document.querySelectorAll('.challenge-blip');
            blips.forEach((blip, idx) => {
                if (idx < challengeStreak) blip.classList.add('filled');
                else blip.classList.remove('filled');
            });

            if (challengeStreak === 10) {
                showResults();
            } else {
                currentQuestionIndex++;
                loadQuestion();
            }
        } else {
            progressBar.style.width = `${((currentQuestionIndex + 1) / quizLength) * 100}%`;
            if (currentQuestionIndex < quizLength - 1) {
                currentQuestionIndex++;
                loadQuestion();
            } else {
                showResults();
            }
        }
    });

    function showResults() {
        switchScreen('results');
        if (isChallengeMode) {
            document.getElementById('score-text').textContent = `10 in a row!`;
        } else {
            const percentage = Math.round((score / quizLength) * 100);
            document.getElementById('score-text').textContent = `${percentage}%`;
        }
        
        const summaryContainer = document.getElementById('results-summary');
        summaryContainer.innerHTML = '';
        
        resultsSummaryData.forEach((res, index) => {
            const div = document.createElement('div');
            div.className = 'summary-item';
            div.innerHTML = `
                <div class="summary-question">${index + 1}. ${res.question}</div>
                <div class="summary-status ${res.correct ? 'status-correct' : 'status-wrong'}">
                    ${res.correct ? '✓ Correct' : '✗ Incorrect'}
                </div>
            `;
            summaryContainer.appendChild(div);
        });
    }

    document.getElementById('restart-btn').addEventListener('click', () => {
        switchScreen('landing');
    });

    // Info Modal Logic
    if (infoBtn) infoBtn.addEventListener('click', () => infoModal.classList.remove('hidden'));
    if (closeInfoBtn) closeInfoBtn.addEventListener('click', () => infoModal.classList.add('hidden'));

    // Study Screen Logic
    if (openStudyBtn) openStudyBtn.addEventListener('click', () => {
        screens.landing.classList.remove('active');
        studyScreen.classList.add('active');
        document.getElementById('app-container').classList.add('study-mode');
        renderStudyContent('conditions'); // Default tab
    });

    if (closeStudyBtn) closeStudyBtn.addEventListener('click', () => {
        studyScreen.classList.remove('active');
        screens.landing.classList.add('active');
        document.getElementById('app-container').classList.remove('study-mode');
    });

    studyTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            studyTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            renderStudyContent(e.target.dataset.tab);
        });
    });

    function renderStudyContent(category) {
        if (!studyContent || !window.studyData || !window.studyData[category]) return;
        
        let html = '';
        window.studyData[category].forEach(item => {
            html += `<div class="study-item">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <ul>
                    ${item.points.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>`;
        });
        studyContent.innerHTML = html;
    }
});
