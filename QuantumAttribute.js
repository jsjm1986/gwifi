class QuantumAttribute {
    constructor(name, initialMean, initialUncertainty) {
        this.name = name;
        this.mean = initialMean;
        this.uncertainty = initialUncertainty;
        this.lastMeasurement = null;
        this.measurementHistory = [];
        this.collapseRisk = 0;          // 坍缩风险
        this.measurementStrength = 1;    // 测量强度（可调节）
        this.stabilityFactor = 1;        // 稳定性因子
    }

    // 测量属性，返回一个具体值
    measure(strength = 1) {
        this.measurementStrength = Math.max(0.5, Math.min(2, strength));
        
        // 根据测量强度调整测量结果
        const measurement = this.gaussianRandom(this.mean, this.uncertainty * this.measurementStrength);
        this.lastMeasurement = Math.max(0, Math.min(100, measurement));
        
        // 测量强度影响不确定性的减少
        const uncertaintyReduction = this.measurementStrength * 0.3;
        this.uncertainty = Math.max(5, this.uncertainty * (1 - uncertaintyReduction));
        
        // 更新平均值（考虑测量强度）
        const meanShift = (this.lastMeasurement - this.mean) * (this.measurementStrength * 0.5);
        this.mean = this.mean + meanShift;
        
        // 计算测量对系统的影响
        this.calculateMeasurementImpact();
        
        this.measurementHistory.push({
            value: this.lastMeasurement,
            uncertainty: this.uncertainty,
            strength: this.measurementStrength,
            impact: this.collapseRisk,
            timestamp: Date.now()
        });

        return {
            value: this.lastMeasurement,
            uncertainty: this.uncertainty,
            risk: this.collapseRisk
        };
    }

    // 计算测量对系统的影响
    calculateMeasurementImpact() {
        // 测量强度增加坍缩风险
        this.collapseRisk += this.measurementStrength * 0.1;
        
        // 系统稳定性影响
        this.stabilityFactor *= Math.max(0.7, 1 - (this.measurementStrength * 0.1));
        
        // 随时间自然恢复
        this.collapseRisk = Math.max(0, this.collapseRisk - 0.05);
    }

    // 增加不确定性（当测量其他属性时）
    increaseUncertainty(otherAttrStrength = 1) {
        // 其他属性的测量强度会影响不确定性增加的程度
        const increase = 1.3 * otherAttrStrength;
        this.uncertainty = Math.min(30, this.uncertainty * increase);
        
        // 不确定性增加会轻微影响平均值
        const meanShift = (Math.random() - 0.5) * this.uncertainty * 0.1;
        this.mean = Math.max(0, Math.min(100, this.mean + meanShift));
    }

    // 自然增加不确定性（随时间推移）
    naturalUncertaintyIncrease() {
        // 考虑系统稳定性
        const increase = 1.1 * (2 - this.stabilityFactor);
        this.uncertainty = Math.min(30, this.uncertainty * increase);
        
        // 稳定性自然恢复
        this.stabilityFactor = Math.min(1, this.stabilityFactor + 0.05);
    }

    // 应用效果（通过事件）
    applyEffect(effect) {
        // 效果受系统稳定性影响
        const effectiveChange = effect * this.stabilityFactor;
        this.mean = Math.max(0, Math.min(100, this.mean + effectiveChange));
        
        // 效果会增加不确定性，但增加程度受稳定性影响
        const uncertaintyIncrease = 1.1 * (2 - this.stabilityFactor);
        this.uncertainty = Math.min(30, this.uncertainty * uncertaintyIncrease);
    }

    // 获取最后的测量值
    getLastMeasurement() {
        return {
            value: this.lastMeasurement,
            uncertainty: this.uncertainty,
            risk: this.collapseRisk
        };
    }

    // 获取当前不确定性
    getUncertainty() {
        return {
            value: this.uncertainty,
            stability: this.stabilityFactor
        };
    }

    // 获取当前可能的值范围
    getUncertaintyRange() {
        // 范围受系统稳定性影响
        const effectiveUncertainty = this.uncertainty / this.stabilityFactor;
        const min = Math.max(0, this.mean - effectiveUncertainty * 2);
        const max = Math.min(100, this.mean + effectiveUncertainty * 2);
        return { 
            min, 
            max,
            confidence: this.stabilityFactor
        };
    }

    // 获取崩溃概率
    getCollapseProbability() {
        const range = this.getUncertaintyRange();
        let baseProbability = 0;
        
        // 低值风险
        if (range.min < 20) {
            baseProbability = Math.max(baseProbability, (20 - range.min) / 20);
        }
        
        // 考虑测量带来的额外风险
        const totalRisk = baseProbability + (this.collapseRisk * (2 - this.stabilityFactor));
        return Math.min(1, totalRisk);
    }

    // 获取系统状态报告
    getStatusReport() {
        return {
            mean: this.mean,
            uncertainty: this.uncertainty,
            stability: this.stabilityFactor,
            collapseRisk: this.collapseRisk,
            measurementCount: this.measurementHistory.length,
            lastMeasurement: this.lastMeasurement,
            range: this.getUncertaintyRange()
        };
    }

    // 高斯随机数生成器
    gaussianRandom(mean, standardDeviation) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        
        const normal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return mean + standardDeviation * normal;
    }
} 