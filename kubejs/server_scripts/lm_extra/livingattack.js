// priority: 8
const lmtetraPlayerAttackStrategies = {
    /**
     * 
     * @param {Internal.LivingAttackEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "towerwood": function (event, player, effectValue, item, originalEffectName) {
        if(event.source.getType() === "arrow") {
            event.entity.invulnerableTime = 0
        }
    },
    /**
     * 
     * @param {Internal.LivingAttackEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "rage_blade": function (event, player, effectValue, item, originalEffectName) {
        if(event.source.getType() === "player" && player.getAttributeValue('minecraft:generic.attack_speed') > 5) {
            event.entity.invulnerableTime = 0
        }
    },
    'default': function (event, player, effectValue, item, originalEffectName) {
        return
    }
}


// 攻击事件(livingattck)
NativeEvents.onEvent($LivingAttackEvent, (/** @type{Internal.LivingAttackEvent} */event) => {
    let player = event.source.player
    let entity = event.entity
    if(entity && entity.isLiving()) {
        if (entity.hasEffect('lm_extra:blurring')) {
            event.setCanceled(true)
        }
        else if (player) {
            //player.tell(event.source.getType())
            lmtetraplayerattackevent(event)
        }
    }

});

function lmtetraplayerattackevent(event) {
    
    let player = event.source.player
    let item = player.getMainHandItem();
    if (!item.item instanceof $ModularItem) return;

    let effects = getAllEffects(item);
    effects.forEach(effectName => {

        let originalEffectName = effectName.key
        let effectValue = simpleGetTetraEffectLevel(item, originalEffectName);
        let strategy = lmtetraPlayerAttackStrategies[originalEffectName] || lmtetraPlayerAttackStrategies.default;
        strategy(event, player, effectValue, item, originalEffectName);
    });
}