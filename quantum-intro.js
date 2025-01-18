class QuantumIntro {
    constructor() {
        this.createIntroOverlay();
        this.addParticles();
    }

    createIntroOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'quantum-intro-overlay';
        
        const container = document.createElement('div');
        container.className = 'quantum-intro-container';
        
        container.innerHTML = `
            <div class="quantum-particles-intro"></div>
            <div class="quantum-intro-header">
                <h2>欢迎来到量子婚姻模拟器</h2>
            </div>
            <div class="quantum-intro-content">
                <div class="quantum-concept game-intro">
                    <div class="concept-title">
                        <span class="concept-icon">🎮</span>
                        游戏介绍
                    </div>
                    <div class="concept-description">
                        在这个独特的婚姻模拟器中，你将扮演一位丈夫，通过量子力学的视角来经营你的婚姻。你的妻子的情感状态遵循量子力学规律，处于多种可能性的叠加态。每天你都需要：
                        <ul>
                            <li>观察和测量妻子的情感属性（爱情、心情、信任）</li>
                            <li>做出影响婚姻状态的选择</li>
                            <li>平衡测量频率，避免系统不稳定</li>
                            <li>理解和利用量子纠缠效应</li>
                        </ul>
                        记住：过度观测会导致系统不稳定，而忽视观测则可能错过重要变化。在量子婚姻中，你需要在确定性和不确定性之间找到平衡。
                    </div>
                </div>

                <div class="quantum-concept">
                    <div class="concept-title">
                        <span class="concept-icon">🌊</span>
                        波函数叠加与情感状态
                    </div>
                    <div class="concept-formula">
                        |ψ⟩ = Σ cᵢ|φᵢ⟩
                    </div>
                    <div class="concept-description">
                        在量子力学中，粒子可以同时处于多个状态的叠加。这个公式描述了波函数的叠加态，其中|ψ⟩是系统的状态，cᵢ是各个基态|φᵢ⟩的概率幅。在游戏中，你的妻子的情感状态也处于多种可能性的叠加态。每个属性（爱情、心情、信任）都是一个量子态，直到你通过互动和观察使其坍缩为特定状态。
                    </div>
                </div>
                
                <div class="quantum-concept">
                    <div class="concept-title">
                        <span class="concept-icon">📊</span>
                        测不准原理与情感测量
                    </div>
                    <div class="concept-formula">
                        ΔxΔp ≥ ℏ/2
                    </div>
                    <div class="concept-description">
                        海森堡测不准原理告诉我们，我们无法同时精确测量粒子的位置和动量。在游戏中，这表现为：当你仔细观察某个情感属性时，其他属性会变得更加不确定。例如，过分关注爱情值可能导致心情值的波动增大。你需要谨慎选择测量的时机和频率。
                    </div>
                </div>
                
                <div class="quantum-concept">
                    <div class="concept-title">
                        <span class="concept-icon">🔄</span>
                        量子纠缠与情感联系
                    </div>
                    <div class="concept-formula">
                        |ψ⟩ = (|↑₁↓₂⟩ - |↓₁↑₂⟩)/√2
                    </div>
                    <div class="concept-description">
                        量子纠缠是一种奇妙的现象，两个粒子的状态会相互影响。在游戏中，这体现为不同情感属性之间的关联。例如，信任值的突然下降可能立即影响心情值，爱情值的提升可能增加信任值的稳定性。理解这些关联对于维持婚姻稳定至关重要。
                    </div>
                </div>
                
                <div class="quantum-concept">
                    <div class="concept-title">
                        <span class="concept-icon">💫</span>
                        波函数坍缩与关键选择
                    </div>
                    <div class="concept-formula">
                        P(φᵢ) = |⟨φᵢ|ψ⟩|²
                    </div>
                    <div class="concept-description">
                        在量子系统中，观测会导致波函数坍缩到某个确定状态。这个公式表示测量得到特定状态的概率。在游戏中，每次重要的互动选择都可能导致情感状态的"坍缩"。系统的稳定性会影响坍缩的结果，过低的稳定性可能导致意外的情感状态改变。你需要在关键时刻做出明智的选择，避免婚姻状态的完全坍缩。
                    </div>
                </div>

                <div class="quantum-concept game-tips">
                    <div class="concept-title">
                        <span class="concept-icon">💡</span>
                        游戏提示
                    </div>
                    <div class="concept-description">
                        <ul>
                            <li>关注系统稳定性指标，它决定了你的选择的影响程度</li>
                            <li>合理分配每日测量次数，避免过度观测</li>
                            <li>注意属性之间的纠缠效应，利用正面影响，规避负面连锁反应</li>
                            <li>在关键时刻保持耐心，有时不做选择也是一种选择</li>
                            <li>通过成就系统了解不同的婚姻发展路径</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="quantum-intro-footer">
                <button class="start-game-btn">开始量子之旅</button>
            </div>
        `;
        
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        
        // 添加动画类
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);
        
        // 绑定开始按钮事件
        const startBtn = container.querySelector('.start-game-btn');
        startBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        });
    }

    addParticles() {
        const container = document.querySelector('.quantum-particles-intro');
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle-intro';
            
            // 随机位置和移动方向
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.setProperty('--move-x', (Math.random() * 200 - 100) + 'px');
            particle.style.setProperty('--move-y', (Math.random() * 200 - 100) + 'px');
            
            // 随机延迟
            particle.style.animationDelay = Math.random() * 5 + 's';
            
            container.appendChild(particle);
            
            // 动画结束后重新生成粒子
            particle.addEventListener('animationend', () => {
                particle.remove();
                this.addSingleParticle(container);
            });
        }
    }

    addSingleParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'quantum-particle-intro';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.setProperty('--move-x', (Math.random() * 200 - 100) + 'px');
        particle.style.setProperty('--move-y', (Math.random() * 200 - 100) + 'px');
        
        container.appendChild(particle);
        
        particle.addEventListener('animationend', () => {
            particle.remove();
            this.addSingleParticle(container);
        });
    }
} 