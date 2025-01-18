class EventSystem {
    constructor() {
        this.day = 1;
        this.month = 1;
        this.dailyEvents = this.generateDailyEvents();
    }

    getDateString() {
        return `第${this.month}月 第${this.day}天`;
    }

    advanceDay() {
        this.day++;
        if (this.day > 30) {
            this.day = 1;
            this.month++;
        }
        this.dailyEvents = this.generateDailyEvents();
    }

    generateDailyEvents() {
        // 基础事件池
        const baseEvents = [
            {
                type: 'measurement',
                text: '🔍 测量她的爱情值',
                description: '通过某种方式测量她对你的爱情程度',
                measureAttribute: 'love',
                isMeasurement: true,
                uncertainty: 0.2
            },
            {
                type: 'measurement',
                text: '🎭 观察她的心情',
                description: '试图了解她现在的心情状态',
                measureAttribute: 'mood',
                isMeasurement: true,
                uncertainty: 0.2
            },
            {
                type: 'measurement',
                text: '🤝 试探她的信任度',
                description: '通过交谈来了解她对你的信任程度',
                measureAttribute: 'trust',
                isMeasurement: true,
                uncertainty: 0.2
            }
        ];

        // 量子互动事件池
        const quantumEvents = [
            {
                type: 'quantum',
                text: '💝 送她一份礼物',
                description: '选择一份礼物送给她，但她的反应将处于量子叠加态',
                possibleOutcomes: [
                    {
                        probability: 0.4,
                        result: '她非常喜欢这份礼物',
                        effect: { love: 15, mood: 10, trust: 5 },
                        waveAction: 'strengthen'
                    },
                    {
                        probability: 0.3,
                        result: '她觉得这份礼物一般',
                        effect: { love: 5, mood: 0, trust: 0 },
                        waveAction: 'neutral'
                    },
                    {
                        probability: 0.3,
                        result: '她对这份礼物感到困惑',
                        effect: { love: -5, mood: -5, trust: -2 },
                        waveAction: 'weaken'
                    }
                ],
                uncertainty: 0.3
            },
            {
                type: 'quantum',
                text: '🎭 一起看电影',
                description: '选择一部电影一起观看，但观影体验将处于量子叠加态',
                possibleOutcomes: [
                    {
                        probability: 0.35,
                        result: '这是她喜欢的类型，看得很开心',
                        effect: { love: 10, mood: 15, trust: 5 },
                        waveAction: 'strengthen'
                    },
                    {
                        probability: 0.35,
                        result: '电影情节让她陷入沉思',
                        effect: { love: 5, mood: -5, trust: 10 },
                        waveAction: 'entangle'
                    },
                    {
                        probability: 0.3,
                        result: '她觉得这部电影很无聊',
                        effect: { love: -5, mood: -10, trust: 0 },
                        waveAction: 'weaken'
                    }
                ],
                uncertainty: 0.25
            },
            {
                type: 'quantum',
                text: '🗣️ 深入交谈',
                description: '尝试与她进行深入的交谈，但对话走向将处于量子叠加态',
                possibleOutcomes: [
                    {
                        probability: 0.3,
                        result: '你们敞开心扉，交流愉快',
                        effect: { love: 10, mood: 10, trust: 15 },
                        waveAction: 'strengthen'
                    },
                    {
                        probability: 0.4,
                        result: '谈话陷入了一些敏感话题',
                        effect: { love: 0, mood: -5, trust: 5 },
                        waveAction: 'entangle'
                    },
                    {
                        probability: 0.3,
                        result: '交谈变得尴尬而沉默',
                        effect: { love: -5, mood: -10, trust: -5 },
                        waveAction: 'weaken'
                    }
                ],
                uncertainty: 0.35
            },
            {
                type: 'quantum',
                text: '🎮 一起玩游戏',
                description: '邀请她一起玩游戏，但游戏体验将处于量子叠加态',
                possibleOutcomes: [
                    {
                        probability: 0.4,
                        result: '你们配合默契，玩得很开心',
                        effect: { love: 8, mood: 12, trust: 8 },
                        waveAction: 'strengthen'
                    },
                    {
                        probability: 0.3,
                        result: '她对游戏规则感到困惑',
                        effect: { love: 0, mood: -5, trust: 5 },
                        waveAction: 'neutral'
                    },
                    {
                        probability: 0.3,
                        result: '游戏引发了一些小矛盾',
                        effect: { love: -5, mood: -8, trust: -5 },
                        waveAction: 'weaken'
                    }
                ],
                uncertainty: 0.3
            },
            {
                type: 'quantum',
                text: '📱 发送信息',
                description: '给她发送一条信息，但她的回应将处于量子叠加态',
                possibleOutcomes: [
                    {
                        probability: 0.35,
                        result: '她秒回了，并且很感动',
                        effect: { love: 12, mood: 8, trust: 5 },
                        waveAction: 'strengthen'
                    },
                    {
                        probability: 0.35,
                        result: '她过了一会才回复，态度平淡',
                        effect: { love: 0, mood: 0, trust: 0 },
                        waveAction: 'neutral'
                    },
                    {
                        probability: 0.3,
                        result: '她没有回复，让你感到忐忑',
                        effect: { love: -8, mood: -5, trust: -10 },
                        waveAction: 'weaken'
                    }
                ],
                uncertainty: 0.4
            }
        ];

        // 特殊事件池（基于日期或状态触发）
        const specialEvents = [
            {
                type: 'special',
                text: '🎂 今天是她的生日',
                description: '要不要准备一个特别的惊喜？',
                condition: () => this.day === 1 && this.month === 1,
                possibleOutcomes: [
                    {
                        probability: 0.5,
                        result: '你的惊喜让她感动得流泪',
                        effect: { love: 20, mood: 15, trust: 10 },
                        waveAction: 'strengthen'
                    },
                    {
                        probability: 0.3,
                        result: '她欣赏你的心意，但似乎期待更多',
                        effect: { love: 5, mood: 5, trust: 5 },
                        waveAction: 'neutral'
                    },
                    {
                        probability: 0.2,
                        result: '你的安排与她的期待有些差距',
                        effect: { love: -10, mood: -15, trust: -5 },
                        waveAction: 'weaken'
                    }
                ],
                uncertainty: 0.5
            }
        ];

        // 随机选择当天的事件
        let dailyEvents = [...baseEvents];
        
        // 添加2-3个量子事件
        const quantumEventCount = 2 + Math.floor(Math.random() * 2);
        const shuffledQuantumEvents = this.shuffleArray([...quantumEvents]);
        dailyEvents = dailyEvents.concat(shuffledQuantumEvents.slice(0, quantumEventCount));

        // 检查是否触发特殊事件
        specialEvents.forEach(event => {
            if (event.condition()) {
                dailyEvents.push(event);
            }
        });

        return dailyEvents;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getRandomEvents() {
        return this.dailyEvents;
    }
} 