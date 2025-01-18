class Game {
    constructor() {
        this.wife = new Wife();
        this.eventSystem = new EventSystem();
        this.achievements = new Achievements();
        this.previousState = null;
        this.dailyChoiceMade = false;
        this.initialize();
    }

    initialize() {
        this.updateUI();
        this.generateOptions();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('nextDay').addEventListener('click', () => this.advanceDay());
        document.getElementById('showAchievements').addEventListener('click', () => this.showAchievements());
    }

    updateUI() {
        const status = this.wife.getStatus();
        
        // 更新系统稳定性
        document.getElementById('stabilityValue').textContent = `${Math.round(status.systemStability * 100)}%`;
        document.getElementById('stabilityBar').style.width = `${status.systemStability * 100}%`;
        document.getElementById('stabilityBar').className = `progress stability`;

        // 更新属性显示
        this.updateAttributeDisplay('love', status.attributes.love);
        this.updateAttributeDisplay('mood', status.attributes.mood);
        this.updateAttributeDisplay('trust', status.attributes.trust);

        // 更新量子态显示
        this.updateQuantumStates(status.probabilities);
        
        // 更新纠缠度
        document.getElementById('entanglementBar').style.width = `${status.entanglement * 100}%`;
        document.getElementById('entanglementBar').className = `progress ${status.entanglement > 0.5 ? 'risk' : 'measured'}`;

        // 更新日期显示
        document.getElementById('dateDisplay').textContent = this.eventSystem.getDateString();

        // 更新状态显示
        const wifeStatus = document.getElementById('wifeStatus');
        const wifeImage = document.getElementById('wifeImage');
        
        if (status.isCollapsed) {
            wifeStatus.textContent = '状态: 波函数坍缩（游戏结束）';
            wifeImage.textContent = '💔';
            document.getElementById('gameMessage').textContent = '你的老婆已经不再爱你了！游戏结束！';
            document.getElementById('options').innerHTML = `
                <button class="option-button" onclick="location.reload()">重新开始</button>
            `;
            document.getElementById('nextDay').disabled = true;
        } else {
            const stateEmoji = this.getStateEmoji(status.waveState);
            const probability = Math.round(status.waveProbability * 100);
            wifeStatus.textContent = `状态: ${stateEmoji} ${this.getStateText(status.waveState)} (${probability}%)`;
            this.updateWifeEmoji(status);
            
            // 更新下一天按钮状态
            const nextDayButton = document.getElementById('nextDay');
            nextDayButton.disabled = !this.dailyChoiceMade;
            nextDayButton.title = this.dailyChoiceMade ? 
                '进入下一天' : 
                '请先做出今天的选择';
        }

        // 检查成就
        const newAchievements = this.achievements.checkAchievements(status, this.previousState);
        if (newAchievements.length > 0) {
            this.showAchievementUnlock(newAchievements);
        }

        this.previousState = status;
    }

    updateAttributeDisplay(attrName, attrData) {
        const bar = document.getElementById(`${attrName}Bar`);
        const measurementInfo = document.getElementById(`${attrName}Measurement`);
        const uncertaintyIndicator = document.getElementById(`${attrName}Uncertainty`);
        const riskIndicator = document.getElementById(`${attrName}Risk`);
        const stabilityIndicator = document.getElementById(`${attrName}Stability`);

        // 检查所有必需的元素是否存在
        if (!bar || !measurementInfo || !uncertaintyIndicator || !riskIndicator || !stabilityIndicator) {
            console.error(`Missing UI elements for attribute: ${attrName}`);
            return;
        }
        
        if (attrData.measured) {
            // 显示具体测量值
            bar.style.width = `${attrData.value}%`;
            bar.className = 'progress measured';
            measurementInfo.textContent = `${Math.round(attrData.value)} ±${Math.round(attrData.uncertainty)}`;
            
            // 设置不确定性指示器
            uncertaintyIndicator.style.width = `${attrData.uncertainty * 4}%`;
            uncertaintyIndicator.style.left = `${Math.max(0, attrData.value - attrData.uncertainty * 2)}%`;
            
            // 显示风险和稳定性
            riskIndicator.textContent = `风险: ${Math.round(attrData.risk * 100)}%`;
            stabilityIndicator.textContent = `稳定性: ${Math.round(attrData.stability * 100)}%`;
        } else {
            // 显示不确定区间
            const range = attrData.range;
            const width = range.max - range.min;
            bar.style.width = `${width}%`;
            bar.style.marginLeft = `${range.min}%`;
            bar.className = 'progress unmeasured';
            
            measurementInfo.textContent = `${Math.round(range.min)}-${Math.round(range.max)} (未测量)`;
            
            // 设置不确定性指示器
            uncertaintyIndicator.style.width = '100%';
            uncertaintyIndicator.style.left = '0';
            
            // 显示稳定性
            riskIndicator.textContent = '未测量';
            stabilityIndicator.textContent = `稳定性: ${Math.round(attrData.stability * 100)}%`;
        }
    }

    updateQuantumStates(probabilities) {
        const container = document.getElementById('quantumStates');
        container.innerHTML = '';
        
        Object.entries(probabilities).forEach(([state, prob]) => {
            const stateElement = document.createElement('div');
            stateElement.className = 'quantum-state-item';
            stateElement.innerHTML = `
                <div class="quantum-state-emoji">${this.getStateEmoji(state)}</div>
                <div class="quantum-state-probability">${Math.round(prob * 100)}%</div>
            `;
            container.appendChild(stateElement);
        });
    }

    getAttributeLabel(attr) {
        const labels = {
            love: '爱情值',
            mood: '心情值',
            trust: '信任值'
        };
        return labels[attr] || attr;
    }

    generateOptions() {
        if (this.dailyChoiceMade) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'daily-choice-message';
            messageDiv.textContent = '今天的选择已经做出。请点击"下一天"继续游戏。';
            document.getElementById('options').innerHTML = '';
            document.getElementById('options').appendChild(messageDiv);
            return;
        }

        const optionsContainer = document.getElementById('options');
        const eventPanel = document.getElementById('eventPanel');
        optionsContainer.innerHTML = '';

        if (this.wife.isCollapsed) {
            return;
        }

        // 如果今天已经做出选择，显示等待信息
        if (this.dailyChoiceMade) {
            optionsContainer.innerHTML = `
                <div class="daily-choice-message">
                    今天的选择已经做出，请点击"进入下一天"继续游戏
                </div>
            `;
            return;
        }

        const events = this.eventSystem.getRandomEvents();
        events.forEach(event => {
            const button = document.createElement('button');
            button.className = 'option-button quantum-option';
            
            // 添加量子态指示器
            const quantumIndicator = document.createElement('div');
            quantumIndicator.className = 'quantum-indicator';
            
            // 设置按钮文本和描述
            button.innerHTML = `
                <div class="option-content">
                    <div class="option-text">${event.text}</div>
                    <div class="option-description">${event.description}</div>
                    ${event.type === 'quantum' ? `
                        <div class="quantum-states">
                            ${event.possibleOutcomes.map(outcome => `
                                <div class="quantum-state-preview">
                                    <div class="probability">${Math.round(outcome.probability * 100)}%</div>
                                    <div class="outcome">${outcome.result}</div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="uncertainty-level">不确定性: ${Math.round(event.uncertainty * 100)}%</div>
                </div>
            `;
            
            // 处理测量选项
            if (event.isMeasurement && this.wife.measurementsToday >= 2) {
                button.disabled = true;
                button.title = '今天已经进行过太多测量了';
            }

            button.onclick = () => {
                // 防止重复点击
                if (this.dailyChoiceMade) {
                    return;
                }

                if (event.isMeasurement) {
                    try {
                        const measurement = this.wife.measureAttribute(event.measureAttribute);
                        this.showMeasurementResult(event.measureAttribute, measurement);
                    } catch (error) {
                        alert(error.message);
                        return;
                    }
                } else if (event.type === 'quantum') {
                    // 处理量子事件
                    const outcome = this.resolveQuantumOutcome(event.possibleOutcomes);
                    this.showEventResult(outcome, event);
                    this.wife.updateStatus(outcome.effect, outcome.waveAction);
                }
                
                // 设置今天已做出选择
                this.dailyChoiceMade = true;
                
                // 禁用所有选项按钮
                const allButtons = optionsContainer.querySelectorAll('.option-button');
                allButtons.forEach(btn => {
                    btn.disabled = true;
                    btn.classList.add('disabled');
                });
                
                this.updateUI();
                
                // 显示提示信息
                optionsContainer.insertAdjacentHTML('afterbegin', `
                    <div class="daily-choice-message">
                        今天的选择已经做出，请点击"进入下一天"继续游戏
                    </div>
                `);
            };

            optionsContainer.appendChild(button);
        });
    }

    resolveQuantumOutcome(outcomes) {
        const random = Math.random();
        let cumulativeProbability = 0;
        
        for (const outcome of outcomes) {
            cumulativeProbability += outcome.probability;
            if (random <= cumulativeProbability) {
                return outcome;
            }
        }
        
        return outcomes[outcomes.length - 1];
    }

    showEventResult(outcome, event) {
        const notification = document.createElement('div');
        notification.className = 'event-notification';
        notification.innerHTML = `
            <div class="event-title">${event.text}</div>
            <div class="event-outcome">${outcome.result}</div>
            <div class="event-effects">
                ${Object.entries(outcome.effect).map(([attr, value]) => `
                    <div class="effect-item ${value >= 0 ? 'positive' : 'negative'}">
                        ${this.getAttributeLabel(attr)}: ${value >= 0 ? '+' : ''}${value}
                    </div>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    showMeasurementResult(attribute, measurement) {
        const notification = document.createElement('div');
        notification.className = 'measurement-notification';
        notification.innerHTML = `
            <div class="measurement-title">测量结果</div>
            <div class="measurement-value">
                ${this.getAttributeLabel(attribute)}: ${Math.round(measurement.value)}
                <span class="tooltip" data-tooltip="测量的不确定性范围">±${Math.round(measurement.uncertainty)}</span>
            </div>
            <div class="measurement-details">
                <div class="measurement-impact">
                    <span>测量风险: ${Math.round(measurement.risk * 100)}%</span>
                    <span>系统稳定性: ${Math.round(measurement.systemStability * 100)}%</span>
                </div>
            </div>
            <div class="measurement-note">测量导致其他属性的不确定性增加</div>
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    handleChoice(event) {
        if (this.dailyChoiceMade) return;
        
        if (!event.isMeasurement) {
            this.wife.updateStatus(event.effect, event.waveAction);
        }
        
        this.dailyChoiceMade = true;
        this.updateUI();
        this.generateOptions();
    }

    advanceDay() {
        if (!this.dailyChoiceMade && !this.wife.isCollapsed) {
            alert('请先做出今天的选择！');
            return;
        }
        this.dailyChoiceMade = false;
        this.wife.resetDailyMeasurements();
        this.eventSystem.advanceDay();
        this.generateOptions();
        this.updateUI();
    }

    showAchievementUnlock(achievements) {
        achievements.forEach(achievement => {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">解锁成就：${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                </div>
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        });
    }

    getStateEmoji(state) {
        const emojiMap = {
            'happy': '😊',
            'angry': '😠',
            'neutral': '😐',
            'suspicious': '🤨'
        };
        return emojiMap[state] || '🤔';
    }

    getStateText(state) {
        const textMap = {
            'happy': '开心',
            'angry': '生气',
            'neutral': '平静',
            'suspicious': '怀疑'
        };
        return textMap[state] || '未知';
    }

    updateWifeEmoji(status) {
        const wifeImage = document.getElementById('wifeImage');
        const waveState = status.waveState;
        const probability = status.waveProbability;

        if (waveState === 'happy' && probability > 0.6) {
            wifeImage.textContent = '😍';
        } else if (waveState === 'angry' && probability > 0.6) {
            wifeImage.textContent = '😡';
        } else if (waveState === 'suspicious' && probability > 0.4) {
            wifeImage.textContent = '🧐';
        } else {
            wifeImage.textContent = '🤔';
        }
    }

    showAchievements() {
        const achievementsPanel = document.getElementById('achievementsPanel');
        const achievementsList = document.getElementById('achievementsList');
        achievementsList.innerHTML = '';

        const allAchievements = this.achievements.getAllAchievements();
        for (let key in allAchievements) {
            const achievement = allAchievements[key];
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    ${achievement.progress !== undefined ? 
                        `<div class="achievement-progress">进度: ${achievement.progress}/${achievement.maxProgress}</div>` : 
                        ''}
                </div>
            `;
            achievementsList.appendChild(achievementElement);
        }

        achievementsPanel.classList.remove('hidden');
    }
}

// 启动游戏
window.onload = () => {
    new Game();
}; 