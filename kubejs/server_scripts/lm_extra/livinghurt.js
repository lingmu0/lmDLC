// priority: 8

// 玩家对生物造成伤害事件(livinghurt)
let lmTetraPlayerHurtStrategies = {
    /**
     * 羊刀
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
     * 耄耋哈气
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
     * 神圣之剑
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
     * 曼波
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
     * 珠光护手
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} itemstack 
     * @param {*} originalEffectName 
     */
    "pearlescent_hand_protection": function (event, player, effectValue, itemstack, originalEffectName) {
        let {source, amount, entity}= event
        let effects = getAllEffects(itemstack);
        for(let effectName of effects){
            if(effectName.key == "criticalStrike"){
                let critEffectValue = simpleGetTetraEffectLevel(itemstack, "criticalStrike");
                let efficiency = itemstack.item.getEffectEfficiency(itemstack, "criticalStrike")
                if(efficiency < 1) return
                if(player.getRandom().nextDouble() < critEffectValue/100) {
                    if(source.getType() === "player") {
                        critHit(player, entity)
                    }
                    event.setAmount(amount * efficiency)
                }
            }
        };
    },
    // 赌徒
    "gambling": function (event, player, effectValue, itemstack, originalEffectName) {
        let {amount}= event
        if(player.getRandom().nextDouble() < 0.4) {
            event.setAmount(amount * 0.5)
        }else {
            event.setAmount(amount * 4)
        }
    },
    // 狂妄
    "wildly_arrogant": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity,amount}= event
        if(entity.getMaxHealth() == entity.getHealth()) {
            event.setAmount(amount * 10)
        }
    },
    /**
     * 朱赤之蝶
     * @param {Internal.LivingHurtEvent} event 
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
                //lmdrawSlashParticleLine(entity, 30, 0.1, 'minecraft:flame')
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:flame', 0 , player)
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:flame', 0 , player)
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:flame', 0 , player)
            } else {
                entity.invulnerableTime = 0
                entity.attack(player.damageSources().source(createDamagetype('attributeslib',"fire_damage"), player), (attack_damage + fire_damage) * 6)
                //lmdrawSlashParticleLine(entity, 30, 0.1, 'minecraft:soul_fire_flame')
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:soul_fire_flame', 0 , player)
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:soul_fire_flame', 0 , player)
                lmdrawSingleRandomSlashLineWithOffset(entity, 'minecraft:soul_fire_flame', 0 , player)
            }
        }
    },
    /**
     * 巫妖奖杯
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    'lich_trophy': function (event, player, effectValue, item, originalEffectName) {
        let {entity, amount} = event
        if(event.source.getType() !== "player") return
        let time = player.persistentData.getInt(originalEffectName) ?? 0
        let CD = Math.abs(player.age - time)
        if (CD < 10) return
        player.persistentData.putInt(originalEffectName, player.age)
        // 定义所有可能的效果函数（按原逻辑拆分）
        let effects = [
            // 效果1：增加10点吸收值
            () => {
                if(player.absorptionAmount>=50) return
                player.absorptionAmount += 10
            },
            // 效果2：执行魔法攻击
            () => {
                simpleAttackEntity(
                    true, 
                    player, 
                    entity, 
                    "magic", 
                    Math.min(amount, player.getAttributeValue("generic.attack_damage")) * player.getAttributeValue('generic.attack_speed')
                );
            },
            // 效果3：对范围内实体施加凋零效果
            () => {
                let entityList = getLivingWithinRadius(player.getLevel(), player.position(), 5);
                entityList.forEach(entity => {
                    if (entity.isLiving() && entity !== player) {
                        if (entity.hasEffect('wither')) {
                            let amplifier = entity.getEffect('wither').getAmplifier();
                            entity.potionEffects.add('wither', 20 * 5, amplifier + 2);
                        } else {
                            entity.potionEffects.add('wither', 20 * 5, 1);
                        }
                    }
                });
            },
            // 效果4：基于吸收值提升伤害并清空吸收值
            () => {
                event.setAmount(amount * (1 + player.absorptionAmount * 0.1));
                player.absorptionAmount = Math.max(0, player.absorptionAmount-5);
            }
        ];

        // 随机选择2个不同的效果（无重复）
        let selectedEffects = [];
        // 生成两个不重复的随机索引（0-3）
        while (selectedEffects.length < 2) {
            let randomIndex = Math.floor(Math.random() * effects.length);
            // 确保不重复选择同一个效果
            if (!selectedEffects.includes(randomIndex)) {
                selectedEffects.push(randomIndex);
            }
        }

        // 执行选中的两个效果
        selectedEffects.forEach(index => {
            effects[index]();
        });
    },
    /**
     * 娜迦奖杯
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "naga_trophy": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity, amount}= event
        if(player.hasEffect('lm_extra:naga_speed')) {
            event.setAmount(amount * (1+ player.getAttributeValue('generic.movement_speed')))
            player.removeEffect('lm_extra:naga_speed')
        }
    },
}
Object.assign(tetraPlayerAttackStrategies, lmTetraPlayerHurtStrategies);


let oldPlayerAttack = playerattack;

playerattack = function(event) {
    myExtraAttackHandler(event); // 新逻辑
    oldPlayerAttack(event);   // 原逻辑
}

function myExtraAttackHandler(/** @type{Internal.LivingHurtEvent} */event){
    let player = event.source.player
    let {entity, amount} = event
    
    let coldDamageAmount = player.getAttributeValue('kubejs:generic.lm_cold_damage')
    let type = event.source.getType()

    if (type === 'player' && coldDamageAmount) {
        simpleAttackEntity(true, player, entity, 'attributeslib:cold_damage', coldDamageAmount)
        entity.potionEffects.add('slowness', 20 * 10, Math.min(4, coldDamageAmount / 50))
    } else if(type === 'attributeslib:cold_damage') {
        if(Math.random() < 0.1) {
            entity.potionEffects.add('twilightforest:frosted', 20 * 2, 0)
        }
    } else if(type === 'attributeslib:fire_damage') {
        if(entity.hasEffect('twilightforest:frosted')) {
            entity.removeEffect('twilightforest:frosted')
            event.setAmount(amount * 2)
        }
        else if(entity.hasEffect('slowness')) {
            entity.removeEffect('slowness')
            event.setAmount(amount * 1.2)
        }
    }
}