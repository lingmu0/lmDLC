// priority: 8

// 玩家对生物造成伤害事件(livinghurt)
let lmTetraPlayerHurtStrategies = {
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "rage_blade": function (event, player, effectValue, item, originalEffectName) {
        let {source}= event
        let sourceType = source.getType()
        if(sourceType !== "player") return
        if (player.hasEffect('minecraft:haste')) {
            let amplifier  = player.getEffect('minecraft:haste').getAmplifier()
            player.potionEffects.add('minecraft:haste', 20 * 5, Math.min(4, amplifier + 1));
        } else {
            player.potionEffects.add('minecraft:haste', 20 * 5, 0);
        }
    },
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "maodie_breathe_out": function (event, player, effectValue, item, originalEffectName) {
        let {entity, source}= event
        let sourceType = source.getType()
        if(sourceType === "sonic_boom") return
        let attackSpeed = Math.ceil(player.getAttributeValue('generic.attack_speed'))
        if(sourceType === "player") {
            player.persistentData.putInt(originalEffectName, attackSpeed * 2)
            player.level.playSound(
                null,
                player.x,
                player.y,
                player.z,
                'lm_extra:haqi',
                player.soundSource,
                1,
                1
            )
        }
        let attackSpeedCount = player.persistentData.getInt(originalEffectName) ?? 0
        if(attackSpeedCount--) {
            player.persistentData.putInt(originalEffectName, attackSpeedCount)
            entity.invulnerableTime = 0
            entity.attack(player.damageSources().source($LMDamageTypes.SONIC_BOOM, player), 1)
        }
    },
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} itemstack 
     * @param {*} originalEffectName 
     */
    "sacred_sword": function (event, player, effectValue, itemstack, originalEffectName) {
        let {amount, source} = event;
        let hasPearlescentHand = false;
        let criticalStrikeLevel = 0;
        let critMultiplier = 1; // 默认暴击倍率
        
        // 获取所有效果
        let effects = getAllEffects(itemstack);
        for(let effectName of effects) {
            if(effectName.key === "pearlescent_hand_protection") {
                hasPearlescentHand = true;
            }
            else if(effectName.key === "criticalStrike") {
                criticalStrikeLevel = simpleGetTetraEffectLevel(itemstack, "criticalStrike");
                // 获取暴击倍率（假设通过效率值或固定倍率）
                critMultiplier = itemstack.item.getEffectEfficiency(itemstack, "criticalStrike") || 1.5;
            }
        }
        
        // 仅当暴击率超过100%且满足触发条件时处理
        if(criticalStrikeLevel > 100 && (hasPearlescentHand || source.getType() === "player")) {
            // 计算满100%的部分（例如：250% → 2个完整的100%）
            let fullHundreds = Math.floor((criticalStrikeLevel - 100) / 100);
            // 计算剩余百分比（例如：250% → 50%）
            let remainingPercent = (criticalStrikeLevel - 100) % 100;
            
            // 总暴击倍率 = 基础伤害 × (暴击倍率^必触发次数) × (概率触发 ? 暴击倍率 : 1)
            let finalMultiplier = Math.pow(critMultiplier, fullHundreds);
            
            if(Math.random() < (remainingPercent / 100)) {
                finalMultiplier *= critMultiplier;
            }
            
            event.setAmount(amount * finalMultiplier);
        }
    },
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} itemstack 
     * @param {*} originalEffectName 
     */
    "manbo": function (event, player, effectValue, itemstack, originalEffectName) {
        let { source}= event
        if(source.getType() !== "player") return
        let effects = getAllEffects(itemstack);
        for(let effectName of effects){
            if(effectName.key == "criticalStrike"){
                let critEffectValue = simpleGetTetraEffectLevel(itemstack, "criticalStrike");
                if (player.hasEffect('lm_extra:luck')) {
                    let amplifier  = player.getEffect('lm_extra:luck').getAmplifier()
                    player.potionEffects.add('lm_extra:luck', 20 * 5, Math.min(critEffectValue/20 - 1, amplifier + 1));
                } else {
                    player.potionEffects.add('lm_extra:luck', 20 * 5, 0);
                }
            }
        };
        player.level.playSound(
            null,
            player.x,
            player.y,
            player.z,
            'lm_extra:manbo',
            player.soundSource,
            1,
            1
        )
    },
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} itemstack 
     * @param {*} originalEffectName 
     */
    "pearlescent_hand_protection": function (event, player, effectValue, itemstack, originalEffectName) {
        let {source, amount}= event
        if(source.getType() === "player") return
        let effects = getAllEffects(itemstack);
        for(let effectName of effects){
            if(effectName.key == "criticalStrike"){
                let critEffectValue = simpleGetTetraEffectLevel(itemstack, "criticalStrike");
                let efficiency = itemstack.item.getEffectEfficiency(itemstack, "criticalStrike")
                if(efficiency < 1) return
                if(player.getRandom().nextDouble() < critEffectValue/100) {
                    event.setAmount(amount * efficiency)
                }
            }
        };
    },
    "gambling": function (event, player, effectValue, itemstack, originalEffectName) {
        let {amount}= event
        if(player.getRandom().nextDouble() < 0.4) {
            event.setAmount(amount * 0.5)
        }else {
            event.setAmount(amount * 4)
        }
    },
    "wildly_arrogant": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity,amount}= event
        if(entity.getMaxHealth() == entity.getHealth()) {
            event.setAmount(amount * 10)
        }
    },
    /**
     * 朱赤之蝶
     * @param {Internal.LivingAttackEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    'butterfly_of_zhuchi': function (event, player, effectValue, item, originalEffectName) {
        let {entity, amount} = event
        if(event.source.getType() !== "player") return
        // 蝶引来生
        if (player.hasEffect('lm_extra:butterfly_rebirth')) {
            
            let fire_damage = player.getAttributeValue('attributeslib:fire_damage')
            let attack_damage = Math.min(player.getAttributeValue('generic.attack_damage'), amount)
            if(effectValue != 6) {
                entity.invulnerableTime = 0
                entity.attack(player.damageSources().source(createDamagetype('attributeslib',"fire_damage"), player), (attack_damage + fire_damage) * 3)
                lmdrawSlashParticleLine(entity, 30, 0.1, 'minecraft:flame')
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:flame', 0 , player)
            } else {
                entity.invulnerableTime = 0
                entity.attack(player.damageSources().source(createDamagetype('attributeslib',"fire_damage"), player), (attack_damage + fire_damage) * 6)
                lmdrawSlashParticleLine(entity, 30, 0.1, 'minecraft:soul_fire_flame')
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:soul_fire_flame', 0 , player)
            }
        }
    },
    //覆盖幸运横扫
    'lucky_sweep': function (event, player, effectValue, item, originalEffectName) {
        // 检查冷却时间，避免循环触发
        let time = player.persistentData.getInt(originalEffectName) ?? 0
        let CD = Math.abs(player.age - time)
        if (CD < 20) return
        player.persistentData.putInt(originalEffectName, player.age)

        // 武器上获取lucky_sweep效果等级
        let luckyLevel = simpleGetTetraEffectLevel(item, 'lucky_sweep')

        // 根据武器lucky_sweep来给予效果
        player.potionEffects.add('minecraft:luck', 20 * 3, luckyLevel - 1)

        // 获取玩家面板幸运
        let luckValue = (player.getAttributeTotalValue('pasterdream:luck') + player.getAttributeTotalValue('minecraft:generic.luck')) * 0.5

        // 延迟1tick触发横扫效果
        player.server.scheduleInTicks(1, () => {
            // 横扫伤害算法：基础伤害的12.5% * 幸运等级*0.5
            let baseDamage = player.getAttributeTotalValue('minecraft:generic.attack_damage')
            let sweepDamage = Math.max(1, baseDamage * 0.5) * Math.max(1, luckValue * 1.75)
            
            //珠光护手暴击
            if(event.source.getType() === "player") {
                let pearlescentLevel = simpleGetTetraEffectLevel(item,"pearlescent_hand_protection")
                if(pearlescentLevel) {
                    let critLevel = simpleGetTetraEffectLevel(item,"criticalStrike")
                    let critEfficiency = lmGetEffectEfficiency(item,"criticalStrike")
                    if(critEfficiency < 1) return
                    if(player.getRandom().nextDouble() < critLevel/100) {
                        sweepDamage *= critEfficiency
                    }
                }
            }

            
            // 横扫范围
            let sweepRange = Math.max(1, luckValue * 0.75)

            // 获取被攻击实体周围的所有生物实体
            let targetEntity = event.entity
            let entityList = getLivingWithinRadius(targetEntity.getLevel(), targetEntity.position(), sweepRange)

            // 对范围内的实体造成横扫伤害（排除玩家自己）
            entityList.forEach(entity => {
                if (entity.isLiving() && entity != player) {
                    let time = entity.invulnerableTime
                    // 设置无敌时间为0，确保伤害能够造成
                    entity.invulnerableTime = 0
                    // 造成横扫伤害
                    entity.attack(event.source, sweepDamage)
                    entity.invulnerableTime = time
                }
            })

            //横扫粒子效果
            player.server.runCommandSilent(`execute at ${player.name.string} run particle minecraft:sweep_attack ~ ~1 ~ 0 0 0 0 1`)

            //横扫音效
            player.server.runCommandSilent(`execute at ${player.name.string} run playsound minecraft:entity.player.attack.sweep player @a ~ ~ ~ 1 1`)

        })
    },
}
Object.assign(tetraPlayerAttackStrategies, lmTetraPlayerHurtStrategies);