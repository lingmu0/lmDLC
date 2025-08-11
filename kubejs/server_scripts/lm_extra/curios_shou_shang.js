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
}
Object.assign(curiostetraplayerhurtStrategies, lmcuriostetraplayerhurtStrategies);