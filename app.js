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
    let isExamMode = false;
    let examDifficulty = 5;
    let examTimer = null;
    let examTimeRemaining = 7200; // 2 hours in seconds
    let examStartTime = null;
    let examCategoryStats = {};

    // DOM Elements
    const screens = {
        landing: document.getElementById('landing-screen'),
        quiz: document.getElementById('quiz-screen'),
        results: document.getElementById('results-screen'),
        dev: document.getElementById('dev-screen'),
        examInstructions: document.getElementById('exam-instructions-screen'),
        examResults: document.getElementById('exam-results-screen')
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
    const hintBtn = document.getElementById('hint-btn');
    const hintDisplay = document.getElementById('hint-display');
    
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
        if (isExamMode) {
            questionCounter.textContent = `Question ${examQuestionsAnswered + 1}`;
            categoryBadge.classList.add('hidden');
            document.getElementById('standard-progress').classList.add('hidden');
        } else if (!isChallengeMode) {
            categoryBadge.classList.remove('hidden');
            questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${quizLength}`;
            progressBar.style.width = `${((currentQuestionIndex) / quizLength) * 100}%`;
        }
        
        // Reset state
        submitBtn.removeAttribute('disabled');
        submitBtn.classList.remove('hidden');
        nextBtn.classList.add('hidden');
        hintDisplay.classList.add('hidden');
        hintDisplay.textContent = '';
        if (isChallengeMode || isExamMode) {
            hintBtn.style.display = 'none';
        } else {
            hintBtn.style.display = 'inline-block';
        }
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

    hintBtn.addEventListener('click', () => {
        const q = quizQuestions[currentQuestionIndex];
        if (q && q.hint) {
            hintDisplay.textContent = q.hint;
            hintDisplay.classList.remove('hidden');
        }
    });

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
            correct: isCorrect,
            difficulty: q.difficulty || 5
        });

        submitBtn.classList.add('hidden');
        hintBtn.style.display = 'none';
        
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
        } else if (isExamMode) {
            const examEnded = processExamAnswer(resultsSummaryData[resultsSummaryData.length - 1].correct);
            if (!examEnded) {
                currentQuestionIndex++;
                quizLength = currentQuestionIndex + 1; // Update for progress bar
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
        isExamMode = false;
        if (examTimer) clearInterval(examTimer);
        examTimerEl.classList.add('hidden');
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


    // --- Developer Menu Logic ---
    const devTrigger = document.getElementById('dev-trigger');
    const devScreen = document.getElementById('dev-screen');
    const devBackBtn = document.getElementById('dev-back-btn');
    const devDiffBtns = document.querySelectorAll('.dev-diff-btn');
    const devLoadDbBtn = document.getElementById('dev-load-db-btn');
    const devDbViewer = document.getElementById('dev-db-viewer');
    
    let devClickCount = 0;
    let devClickTimer = null;

    if (devTrigger) {
        devTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            devClickCount++;
            if (devClickCount === 1) {
                devClickTimer = setTimeout(() => {
                    devClickCount = 0;
                }, 5000);
            }
            if (devClickCount >= 4) {
                clearTimeout(devClickTimer);
                devClickCount = 0;
                // Open Dev Menu - hide ALL screens including study
                Object.values(screens).forEach(s => s?.classList?.remove('active'));
                if (studyScreen) studyScreen.classList.remove('active');
                document.getElementById('app-container').classList.remove('study-mode');
                devScreen.classList.add('active');
            }
        });
    }

    if (devBackBtn) {
        devBackBtn.addEventListener('click', () => {
            devScreen.classList.remove('active');
            screens.landing.classList.add('active');
        });
    }

    // Update dev buttons with counts
    devDiffBtns.forEach(btn => {
        const d = parseInt(btn.dataset.diff);
        let count = 0;
        ['skills', 'understanding', 'questions'].forEach(cat => {
            if (window.questionBank[cat]) {
                count += window.questionBank[cat].filter(q => q.difficulty === d).length;
            }
        });
        btn.textContent = `Diff ${d} (${count})`;
    });

    devDiffBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetDiff = parseInt(e.target.dataset.diff);
            
            // Gather all questions of this difficulty
            let diffQuestions = [];
            ['skills', 'understanding', 'questions'].forEach(cat => {
                if (window.questionBank[cat]) {
                    diffQuestions = diffQuestions.concat(
                        window.questionBank[cat].filter(q => q.difficulty === targetDiff)
                    );
                }
            });
            
            if (diffQuestions.length === 0) {
                alert("No questions found with difficulty " + targetDiff);
                return;
            }
            
            // Start Quiz Overrides
            quizQuestions = diffQuestions.sort(() => 0.5 - Math.random());
            quizLength = quizQuestions.length;
            currentCategory = `Difficulty ${targetDiff}`;
            isChallengeMode = false;
            
            devScreen.classList.remove('active');
            startQuizCore();
        });
    });
    
    // Abstracted start sequence for dev overrides
    function startQuizCore() {
        score = 0;
        currentQuestionIndex = 0;
        resultsSummaryData = [];
        challengeStreak = 0;
        
        if (isChallengeMode) {
            document.getElementById('challenge-tracker').classList.remove('hidden');
        } else {
            const ct = document.getElementById('challenge-tracker');
            if (ct) ct.classList.add('hidden');
        }

        screens.landing.classList.remove('active');
        screens.quiz.classList.add('active');
        loadQuestion();
    }

    if (devLoadDbBtn) {
        devLoadDbBtn.addEventListener('click', () => {
            let html = '';
            ['skills', 'understanding', 'questions'].forEach(cat => {
                if (window.questionBank[cat]) {
                    html += `<h3>Category: ${cat.toUpperCase()}</h3>`;
                    window.questionBank[cat].forEach(q => {
                        html += `<div style="margin-bottom: 15px; border-bottom: 1px solid #444; padding-bottom: 10px;">
                            <strong>[${q.id}] (Diff: ${q.difficulty})</strong><br>
                            <em>Q:</em> ${q.question}<br>
                            <span style="color: #4CAF50;"><em>Ans:</em> ${q.answer}</span>
                        </div>`;
                    });
                }
            });
            devDbViewer.innerHTML = html;
            devDbViewer.classList.remove('hidden');
            devLoadDbBtn.classList.add('hidden');
        });
    }

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

    // =============================================
    // === SIMULATED NREMT EXAM ENGINE ===
    // =============================================

    const examStartBtn = document.getElementById('start-exam-btn');
    const examBeginBtn = document.getElementById('exam-begin-btn');
    const examCancelBtn = document.getElementById('exam-cancel-btn');
    const examReturnBtn = document.getElementById('exam-return-btn');
    const examTimerEl = document.getElementById('exam-timer');

    if (examStartBtn) {
        examStartBtn.addEventListener('click', () => {
            switchScreen('examInstructions');
        });
    }

    if (examCancelBtn) {
        examCancelBtn.addEventListener('click', () => {
            switchScreen('landing');
        });
    }

    if (examReturnBtn) {
        examReturnBtn.addEventListener('click', () => {
            switchScreen('landing');
        });
    }

    if (examBeginBtn) {
        examBeginBtn.addEventListener('click', () => {
            startSimulatedExam();
        });
    }

    function buildExamPool() {
        // Gather ALL MCQ and TF questions (skip ORDER and MATCHING for exam realism)
        let pool = [];
        ['skills', 'understanding', 'questions'].forEach(cat => {
            if (window.questionBank[cat]) {
                window.questionBank[cat].forEach(q => {
                    if (q.type === 'MCQ' || q.type === 'TF') {
                        pool.push(q);
                    }
                });
            }
        });
        return pool;
    }

    function selectExamQuestions() {
        const pool = buildExamPool();
        
        // Target total between 70-120
        const totalQuestions = 70 + Math.floor(Math.random() * 51); // 70-120
        
        // Calculate targets per category based on NREMT percentages
        const targets = {
            primary_assessment: Math.round(totalQuestions * (0.39 + Math.random() * 0.04)),
            treatment_transport: Math.round(totalQuestions * (0.20 + Math.random() * 0.04)),
            scene_safety: Math.round(totalQuestions * (0.15 + Math.random() * 0.04)),
            operations: Math.round(totalQuestions * (0.10 + Math.random() * 0.04)),
            secondary_assessment: Math.round(totalQuestions * (0.05 + Math.random() * 0.04))
        };
        
        // Bucket questions by category and difficulty
        const buckets = {};
        pool.forEach(q => {
            const cat = q.nremtCategory || 'primary_assessment';
            if (!buckets[cat]) buckets[cat] = {};
            const diff = q.difficulty || 5;
            if (!buckets[cat][diff]) buckets[cat][diff] = [];
            buckets[cat][diff].push(q);
        });
        
        // Select questions per category
        let selected = [];
        Object.keys(targets).forEach(cat => {
            const needed = targets[cat];
            let catPool = pool.filter(q => (q.nremtCategory || 'primary_assessment') === cat);
            catPool = catPool.sort(() => Math.random() - 0.5);
            selected = selected.concat(catPool.slice(0, needed));
        });
        
        // Fill remaining from any category if needed
        while (selected.length < 70) {
            const remaining = pool.filter(q => !selected.includes(q));
            if (remaining.length === 0) break;
            selected.push(remaining[Math.floor(Math.random() * remaining.length)]);
        }
        
        return selected;
    }

    function sortExamByDifficulty(questions, startDiff) {
        // Sort so we start around the target difficulty and can pull adaptively
        const byDiff = {};
        questions.forEach(q => {
            const d = q.difficulty || 5;
            if (!byDiff[d]) byDiff[d] = [];
            byDiff[d].push(q);
        });
        // Shuffle within each difficulty
        Object.values(byDiff).forEach(arr => arr.sort(() => Math.random() - 0.5));
        return byDiff;
    }

    let examQuestionsByDiff = {};
    let examTotalQuestions = 0;
    let examQuestionsAnswered = 0;
    let examCorrectCount = 0;
    let examMinQuestions = 70;
    let examMaxQuestions = 120;
    let examConsecutiveAbove = 0;
    let examConsecutiveBelow = 0;

    function startSimulatedExam() {
        isExamMode = true;
        isChallengeMode = false;
        examDifficulty = 5;
        examQuestionsAnswered = 0;
        examCorrectCount = 0;
        examConsecutiveAbove = 0;
        examConsecutiveBelow = 0;
        score = 0;
        currentQuestionIndex = 0;
        resultsSummaryData = [];
        examCategoryStats = {
            primary_assessment: { correct: 0, total: 0 },
            treatment_transport: { correct: 0, total: 0 },
            scene_safety: { correct: 0, total: 0 },
            operations: { correct: 0, total: 0 },
            secondary_assessment: { correct: 0, total: 0 }
        };
        
        const allExamQuestions = selectExamQuestions();
        examTotalQuestions = allExamQuestions.length;
        examMinQuestions = Math.min(70, allExamQuestions.length);
        examMaxQuestions = Math.min(120, allExamQuestions.length);
        examQuestionsByDiff = sortExamByDifficulty(allExamQuestions, 5);
        
        // Pick first question at difficulty 5
        quizQuestions = [pickExamQuestion(5)];
        quizLength = examMaxQuestions;
        currentCategory = 'NREMT Exam';
        
        // Start Timer
        examTimeRemaining = 7200;
        examStartTime = Date.now();
        examTimerEl.classList.remove('hidden', 'warning');
        examTimerEl.textContent = '2:00:00';
        
        if (examTimer) clearInterval(examTimer);
        examTimer = setInterval(() => {
            examTimeRemaining--;
            const h = Math.floor(examTimeRemaining / 3600);
            const m = Math.floor((examTimeRemaining % 3600) / 60);
            const s = examTimeRemaining % 60;
            examTimerEl.textContent = `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            
            if (examTimeRemaining <= 600) { // Last 10 minutes
                examTimerEl.classList.add('warning');
            }
            if (examTimeRemaining <= 0) {
                clearInterval(examTimer);
                finishExam();
            }
        }, 1000);
        
        // Hide progress bar and challenge tracker for exam
        document.getElementById('standard-progress').classList.add('hidden');
        document.getElementById('challenge-tracker').classList.add('hidden');
        document.getElementById('question-counter').classList.remove('hidden');
        
        switchScreen('quiz');
        loadQuestion();
    }

    function pickExamQuestion(targetDiff) {
        // Try exact difficulty first, then expand outward
        for (let offset = 0; offset <= 9; offset++) {
            for (let dir of [0, 1, -1]) {
                const d = targetDiff + (dir * offset);
                if (d >= 1 && d <= 10 && examQuestionsByDiff[d] && examQuestionsByDiff[d].length > 0) {
                    return examQuestionsByDiff[d].shift();
                }
            }
        }
        // Absolute fallback: return any remaining question
        for (let d = 1; d <= 10; d++) {
            if (examQuestionsByDiff[d] && examQuestionsByDiff[d].length > 0) {
                return examQuestionsByDiff[d].shift();
            }
        }
        return null;
    }

    function shouldExamEnd() {
        if (examQuestionsAnswered < examMinQuestions) return false;
        if (examQuestionsAnswered >= examMaxQuestions) return true;
        
        // Adaptive termination based on confidence:
        // If performance is clearly above or below competency, end sooner.
        // If performance is mixed/ambiguous, keep testing up to max.
        const accuracy = examCorrectCount / examQuestionsAnswered;
        const questionsAfterMin = examQuestionsAnswered - examMinQuestions;
        
        // Clear pass: consistently getting 75%+ correct AND on a hot streak
        if (accuracy >= 0.75 && examConsecutiveAbove >= 8) return true;
        
        // Clear fail: consistently getting <55% AND on a cold streak
        if (accuracy < 0.55 && examConsecutiveBelow >= 8) return true;
        
        // Moderate confidence after 85+ questions with a strong trend
        if (examQuestionsAnswered >= 85) {
            if (accuracy >= 0.72 && examConsecutiveAbove >= 5) return true;
            if (accuracy < 0.50 && examConsecutiveBelow >= 5) return true;
        }
        
        // Mixed performance: keep going toward 120
        return false;
    }

    function processExamAnswer(isCorrect) {
        examQuestionsAnswered++;
        if (isCorrect) {
            examCorrectCount++;
            examConsecutiveAbove++;
            examConsecutiveBelow = 0;
        } else {
            examConsecutiveBelow++;
            examConsecutiveAbove = 0;
        }
        
        // Track category stats
        const q = quizQuestions[currentQuestionIndex];
        const cat = q.nremtCategory || 'primary_assessment';
        if (examCategoryStats[cat]) {
            examCategoryStats[cat].total++;
            if (isCorrect) examCategoryStats[cat].correct++;
        }
        
        // Adapt difficulty
        if (isCorrect) {
            examDifficulty = Math.min(10, examDifficulty + 1);
        } else {
            examDifficulty = Math.max(1, examDifficulty - 1);
        }
        
        // Check if exam should end
        if (shouldExamEnd()) {
            clearInterval(examTimer);
            finishExam();
            return true; // signals exam ended
        }
        
        // Queue next question
        const nextQ = pickExamQuestion(examDifficulty);
        if (!nextQ) {
            clearInterval(examTimer);
            finishExam();
            return true;
        }
        quizQuestions.push(nextQ);
        return false; // exam continues
    }

    function finishExam() {
        isExamMode = false;
        examTimerEl.classList.add('hidden');
        
        // ---- NREMT Scaled Scoring Algorithm (100-1500, pass = 950) ----
        // The score weights BOTH accuracy AND the difficulty of questions answered correctly.
        // A competent EMT (~70%+ accuracy on adaptive difficulty) should land around 950+.
        
        const accuracy = examCorrectCount / examQuestionsAnswered;
        
        // Calculate difficulty-weighted performance
        // Each correct answer earns points proportional to its difficulty.
        // Each wrong answer on an easy question penalizes more (should have gotten it).
        let weightedEarned = 0;
        let weightedMax = 0;
        
        resultsSummaryData.forEach(r => {
            const diff = r.difficulty || 5;
            // Points available scale with difficulty: easy=1x, hard=3x
            const weight = 1 + (diff - 1) * 0.22; // diff 1 = 1.0, diff 5 = 1.88, diff 10 = 2.98
            weightedMax += weight;
            if (r.correct) {
                weightedEarned += weight;
            }
        });
        
        const weightedRatio = weightedMax > 0 ? weightedEarned / weightedMax : 0;
        
        // Blend raw accuracy (40%) with weighted performance (60%)
        // This ensures that someone who answers hard questions correctly scores higher
        // than someone who only gets easy ones right.
        const blendedScore = (accuracy * 0.4) + (weightedRatio * 0.6);
        
        // Map blended score to the 100-1500 scale.
        // A blended score of ~0.61 (roughly 70% accuracy on moderate difficulty) = 950
        // Formula: score = 100 + (blendedScore * 2295.08)
        // At blendedScore 0.61: 100 + (0.61 * 2295.08) = 100 + 1400 = 1500... 
        // We need: at 0.61 -> 950. At 1.0 -> 1500. At 0.0 -> 100.
        // Linear: score = 100 + blendedScore * 1400  => at 0.61 => 954. Close enough.
        // But let's use a curve that compresses the bottom and expands around the pass mark.
        
        let scaledScore;
        if (blendedScore >= 0.60) {
            // Above competency line: map 0.60-1.0 to 950-1500
            scaledScore = Math.round(950 + ((blendedScore - 0.60) / 0.40) * 550);
        } else {
            // Below competency line: map 0.0-0.60 to 100-949
            scaledScore = Math.round(100 + (blendedScore / 0.60) * 849);
        }
        
        scaledScore = Math.max(100, Math.min(1500, scaledScore));
        const passed = scaledScore >= 950;
        
        // Calculate time used
        const elapsed = Math.round((Date.now() - examStartTime) / 1000);
        const elapsedMin = Math.floor(elapsed / 60);
        const elapsedSec = elapsed % 60;
        
        // Populate results
        const verdict = document.getElementById('exam-result-verdict');
        verdict.textContent = passed ? 'PASS' : 'FAIL';
        verdict.className = 'exam-verdict ' + (passed ? 'pass' : 'fail');
        
        document.getElementById('exam-scaled-score').textContent = scaledScore;
        document.getElementById('exam-stat-questions').textContent = examQuestionsAnswered;
        document.getElementById('exam-stat-correct').textContent = examCorrectCount;
        document.getElementById('exam-stat-accuracy').textContent = Math.round(accuracy * 100) + '%';
        document.getElementById('exam-stat-time').textContent = `${elapsedMin}:${String(elapsedSec).padStart(2,'0')}`;
        
        // Category breakdown
        const breakdownEl = document.getElementById('exam-category-breakdown');
        const catNames = {
            primary_assessment: 'Primary Assessment',
            treatment_transport: 'Patient Treatment & Transport',
            scene_safety: 'Scene Size-Up & Safety',
            operations: 'Operations',
            secondary_assessment: 'Secondary Assessment'
        };
        let breakdownHtml = '<h4>Category Breakdown</h4>';
        Object.keys(catNames).forEach(cat => {
            const stats = examCategoryStats[cat];
            if (stats && stats.total > 0) {
                const pct = Math.round((stats.correct / stats.total) * 100);
                const cls = pct >= 70 ? 'good' : 'poor';
                breakdownHtml += `<div class="exam-breakdown-item">
                    <span class="breakdown-label">${catNames[cat]}</span>
                    <span class="breakdown-value ${cls}">${stats.correct}/${stats.total} (${pct}%)</span>
                </div>`;
            }
        });
        breakdownEl.innerHTML = breakdownHtml;
        
        switchScreen('examResults');
    }
});
