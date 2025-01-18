class Wife {
    constructor() {
        // 属性的真实值是不确定的，只存储波函数
        this.attributes = {
            love: new QuantumAttribute('love', 100, 10),    // 初始均值100，标准差10
            mood: new QuantumAttribute('mood', 100, 10),
            trust: new QuantumAttribute('trust', 100, 10)
        };
        
        this.waveFunction = new WaveFunction();
        this.isCollapsed = false;
        this.lastMeasuredAttribute = null;  // 记录上次测量的属性
        this.measurementsToday = 0;         // 今天已测量次数
        this.systemStability = 1;           // 整体系统稳定性
        this.events = this.generateEvents();
    }

    // 测量属性，会影响其他属性（测不准原理）
    measureAttribute(attributeName, strength = 1) {
        if (this.measurementsToday >= 1) {
            throw new Error('今天已经进行过测量了！');
        }

        const attribute = this.attributes[attributeName];
        if (!attribute) {
            throw new Error('无效的属性名');
        }

        // 测量会影响其他属性（不确定性原理）
        const measurement = attribute.measure(strength);
        this.measurementsToday++;
        this.lastMeasuredAttribute = attributeName;

        // 更新系统稳定性
        this.systemStability *= Math.max(0.8, 1 - (strength * 0.1));

        // 测量导致其他属性的不确定性增加
        for (let name in this.attributes) {
            if (name !== attributeName) {
                this.attributes[name].increaseUncertainty(strength);
            }
        }

        return {
            ...measurement,
            systemStability: this.systemStability
        };
    }

    // 重置每日测量次数
    resetDailyMeasurements() {
        this.measurementsToday = 0;
        this.lastMeasuredAttribute = null;
        
        // 系统每天自然恢复一些稳定性
        this.systemStability = Math.min(1, this.systemStability + 0.1);
        
        // 所有属性的不确定性自然增加
        for (let name in this.attributes) {
            this.attributes[name].naturalUncertaintyIncrease();
        }
    }

    // 更新状态（通过外部干涉）
    updateStatus(effect, waveAction) {
        // 更新波函数状态
        if (waveAction && waveAction.type) {
            this.waveFunction.updateState(waveAction);
        }
        
        // 通过效果影响属性的概率分布
        if (effect) {
            for (let attr in effect) {
                if (this.attributes[attr]) {
                    // 效果受系统稳定性影响
                    const effectiveChange = effect[attr] * this.systemStability;
                    this.attributes[attr].applyEffect(effectiveChange);
                }
            }
        }

        // 检查是否游戏结束
        this.checkCollapse();
    }

    // 检查是否坍缩
    checkCollapse() {
        // 获取所有属性的崩溃概率
        const collapseProbabilities = {};
        let totalCollapseRisk = 0;
        
        for (let attr in this.attributes) {
            const attrStatus = this.attributes[attr].getStatusReport();
            collapseProbabilities[attr] = this.attributes[attr].getCollapseProbability();
            totalCollapseRisk += attrStatus.collapseRisk;
        }

        // 如果任何属性的崩溃概率超过阈值，或者系统总体风险过高，则发生坍缩
        const suspiciousProb = this.waveFunction.getStateProbabilities().suspicious;
        if (Object.values(collapseProbabilities).some(p => p > 0.7) || 
            suspiciousProb > 0.6 || 
            totalCollapseRisk > 2 || 
            this.systemStability < 0.3) {
            this.collapse();
        }
    }

    collapse() {
        this.isCollapsed = true;
    }

    getRandomEvents(count = 3) {
        // 根据系统稳定性调整事件概率
        const events = this.events.map(event => ({
            ...event,
            probability: this.calculateEventProbability(event)
        }));

        // 按概率排序并选择事件
        const sortedEvents = events.sort((a, b) => b.probability - a.probability);
        return sortedEvents.slice(0, count);
    }

    calculateEventProbability(event) {
        // 基础概率
        let probability = 1;

        // 负面事件在系统不稳定时更容易发生
        if (event.effect && (event.effect.love < 0 || event.effect.mood < 0 || event.effect.trust < 0)) {
            probability *= (2 - this.systemStability);
        }

        // 测量事件在不确定性高时更重要
        if (event.isMeasurement) {
            const attr = this.attributes[event.measureAttribute];
            const status = attr.getStatusReport();
            probability *= (status.uncertainty / 20);
        }

        return probability;
    }

    // 获取状态信息
    getStatus() {
        const waveState = this.waveFunction.getMostProbableState();
        const probabilities = this.waveFunction.getStateProbabilities();
        
        // 获取所有属性的状态
        const attributes = {};
        for (let attr in this.attributes) {
            if (attr === this.lastMeasuredAttribute) {
                const measurement = this.attributes[attr].getLastMeasurement();
                attributes[attr] = {
                    value: measurement.value,
                    uncertainty: measurement.uncertainty,
                    risk: measurement.risk,
                    measured: true
                };
            } else {
                const status = this.attributes[attr].getStatusReport();
                attributes[attr] = {
                    range: status.range,
                    uncertainty: status.uncertainty,
                    stability: status.stability,
                    measured: false
                };
            }
        }

        return {
            attributes: attributes,
            isCollapsed: this.isCollapsed,
            waveState: waveState.state,
            waveProbability: waveState.probability,
            probabilities: probabilities,
            entanglement: this.waveFunction.getEntanglement(),
            measurementsToday: this.measurementsToday,
            systemStability: this.systemStability
        };
    }

    generateEvents() {
        return [
            {
                text: "谨慎测量爱情值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'love',
                measurementStrength: 0.7
            },
            {
                text: "深入测量爱情值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'love',
                measurementStrength: 1.5
            },
            {
                text: "谨慎测量心情值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'mood',
                measurementStrength: 0.7
            },
            {
                text: "深入测量心情值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'mood',
                measurementStrength: 1.5
            },
            {
                text: "谨慎测量信任值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'trust',
                measurementStrength: 0.7
            },
            {
                text: "深入测量信任值",
                effect: {},
                waveAction: { type: 'NEUTRAL' },
                isMeasurement: true,
                measureAttribute: 'trust',
                measurementStrength: 1.5
            },
            {
                text: "陪老婆逛街购物",
                effect: {
                    love: 10,
                    mood: 15,
                    trust: 5
                },
                waveAction: { type: 'POSITIVE' }
            },
            {
                text: "给老婆做一顿美食",
                effect: {
                    love: 15,
                    mood: 10,
                    trust: 5
                },
                waveAction: { type: 'POSITIVE' }
            },
            {
                text: "和老婆一起看电影",
                effect: {
                    love: 8,
                    mood: 12,
                    trust: 3
                },
                waveAction: { type: 'POSITIVE' }
            },
            {
                text: "加班到很晚",
                effect: {
                    love: -10,
                    mood: -15,
                    trust: -5
                },
                waveAction: { type: 'NEGATIVE' }
            },
            {
                text: "忘记结婚纪念日",
                effect: {
                    love: -20,
                    mood: -25,
                    trust: -15
                },
                waveAction: { type: 'NEGATIVE' }
            },
            {
                text: "和异性同事单独吃饭",
                effect: {
                    love: -15,
                    mood: -10,
                    trust: -20
                },
                waveAction: { type: 'SUSPICIOUS' }
            },
            {
                text: "深夜收到异性短信",
                effect: {
                    love: -10,
                    mood: -5,
                    trust: -15
                },
                waveAction: { type: 'SUSPICIOUS' }
            },
            {
                text: "送老婆惊喜礼物",
                effect: {
                    love: 20,
                    mood: 20,
                    trust: 10
                },
                waveAction: { type: 'POSITIVE' }
            }
        ];
    }
} 