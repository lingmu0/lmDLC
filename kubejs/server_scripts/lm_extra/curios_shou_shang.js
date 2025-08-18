// priority: 7

let lmcuriostetraplayerhurtStrategies = {
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "nature_heart": function (event, player, effectValue, item, originalEffectName) {
        let {amount}= event
        if(checkDownBlock(player, "minecraft:grass_block")) {
            event.setAmount(amount * 0.8)
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
    "moonworm_queen": function (event, player, effectValue, item, originalEffectName) {
        let {amount, source}= event
        event.setAmount(amount * 0.9)
        let entity = source.actual
        if (entity && entity.isLiving()) {
            entity.potionEffects.add('glowing', 20 * 60, 0)
        }
    },
}
Object.assign(curiostetraplayerhurtStrategies, lmcuriostetraplayerhurtStrategies);