// priority: 8
const lmCuriosTetraPlayergongjiStrategies = {
    /**
     * 魔豆
     * @param {Internal.LivingDamageEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "magic_beans": function (event, player, effectValue, item, originalEffectName) {
        let {entity, amount}= event
        if (entity && entity.isLiving()) {
            let entityHealth = entity.getMaxHealth()
            if(entityHealth > 100) {
                event.setAmount(Math.min(amount, entityHealth*0.1))
            }
        }
    },
    'default': function (event, player, effectLevel, originalEffectName) {
        return
    }
}

NativeEvents.onEvent($LivingDamageEvent, (/** @type{Internal.LivingDamageEvent} */event) => {
        lmtetracuriosdamagegongjievent(event)
        lmtetracuriosdamageshoushangevent(event)
});

function lmtetracuriosdamagegongjievent(event) {
    let player = event.source.player;
    if (!player) return;

    // 获取所有tetra饰品
    let tetraItems = getTetraCurios(player);
    if (!tetraItems || tetraItems.length === 0) return;

    // 用于累加相同效果的总等级
    let totalEffectLevels = {};

    // 遍历所有饰品，累加相同效果的等级
    for (let curioItem of tetraItems) {
        let effects = getAllEffects(curioItem);
        if (!effects) return

        effects.forEach(effectName => {
            let originalEffectName = effectName.key
            let effectLevel = simpleGetTetraEffectLevel(curioItem, originalEffectName);

            // 累加效果等级
            if (!totalEffectLevels[originalEffectName]) {
                totalEffectLevels[originalEffectName] = effectLevel
            } else {
                totalEffectLevels[originalEffectName] += effectLevel
            }
        })
    }

    // 第二步：遍历所有累加后的效果，执行对应策略
    for (let originalEffectName in totalEffectLevels) {
        let totalLevel = totalEffectLevels[originalEffectName];

        // 查找对应的策略并执行（传入总等级）
        let strategy = lmCuriosTetraPlayergongjiStrategies[originalEffectName] || lmCuriosTetraPlayergongjiStrategies.default;
        strategy(event, player, totalLevel, originalEffectName);
    }
}