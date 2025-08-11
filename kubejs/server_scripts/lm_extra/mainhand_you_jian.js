// priority: 8
let lmtetra_player_you_jian_strategies = {   
    /**
     * 朱赤之蝶
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    'butterfly_of_zhuchi': function (event, player, effectValue, item, originalEffectName) {
        let time = player.persistentData.getInt(originalEffectName) ?? 0
        let CD = Math.abs(player.age - time)
        if (CD < 20 * 12){
            player.tell("蝶引来生还在冷却中")
            return
        } 
        player.persistentData.putInt(originalEffectName, player.age)
        
        player.setHealth(player.getHealth() * 0.7)
        let amplifier = effectValue * 3 - 1
        player.potionEffects.add('lm_extra:butterfly_rebirth', 20 * 10, Math.max(1, amplifier));
    },
}
Object.assign(tetra_player_you_jian_strategies, lmtetra_player_you_jian_strategies)