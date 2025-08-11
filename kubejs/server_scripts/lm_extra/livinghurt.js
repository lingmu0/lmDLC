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
        if(sourceType === "bypasses_cooldown_melee") return
        if(sourceType === "player") {
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
        entity.attack(player.damageSources().source(createDamagetype('jerotes',"bypasses_cooldown_melee"), player), player.getAttributeValue('generic.attack_speed'))
    },
}
Object.assign(tetraPlayerAttackStrategies, lmTetraPlayerHurtStrategies);