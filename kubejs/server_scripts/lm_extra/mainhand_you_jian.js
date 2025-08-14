// priority: 8
let lmtetra_player_you_jian_strategies = {   
    /**
     * 朱赤之蝶
     * @param {Internal.ItemClickedEventJS} event 
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
    /**
     * 娜迦奖杯
     * @param {Internal.ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "naga_trophy": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity, amount}= event
        let time = player.persistentData.getInt(originalEffectName) ?? 0

        let x0 = player.x
        let y0 = player.y + 0.9
        let z0 = player.z
        //let laser = new $LMDeath_Laser_Beam_Entity($LMModEntities.DEATH_LASER_BEAM.get(), player.level, player, player.x, player.y + 2.9, player.z,  ((player.yHeadRot + 90) * JavaMath.PI / 180),  (-player.getViewXRot() * JavaMath.PI / 180), 60, 1,1);
                
        // let laser = new $LMDeath_Laser_Beam_Entity($LMModEntities.DEATH_LASER_BEAM.get(), player.level, player, x0, y0, z0, (player.yHeadRot + 90) * JavaMath.PI / 180, -player.getViewXRot(1) * JavaMath.PI / 180, 200, 10, 10)
        
        // player.level.addFreshEntity(laser)

        let CD = Math.abs(player.age - time)
        if (CD < 20 * 10){
            player.tell("娜迦冲锋还在冷却中")
            return
        } 
        player.persistentData.putInt(originalEffectName, player.age)
        if (player.hasEffect('lm_extra:naga_speed')) {
            let amplifier = player.getEffect('lm_extra:naga_speed').getAmplifier();
            player.potionEffects.add('lm_extra:naga_speed', 20 * 5, amplifier + player.getAttributeValue('kubejs:generic.naga_speed'));
        } else {
            player.potionEffects.add('lm_extra:naga_speed', 20 * 5, player.getAttributeValue('kubejs:generic.naga_speed'));
        }
    },
    /**
     * 九头蛇奖杯
     * @param {Internal.ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "hydra_trophy": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity, amount, level}= event
        let time = player.persistentData.getInt(originalEffectName) ?? 0

        let CD = Math.abs(player.age - time)
        if (CD < 20 * 1){
            player.tell("烈焰风暴还在冷却中")
            return
        } 
        player.persistentData.putInt(originalEffectName, player.age)

        let flame_strike_entity = new $LMFlame_Strike_Entity(level, player.x, player.y, player.z, player.YHeadRot, 100, 0, 0, 10, 6, 0, false, player)
        level.addFreshEntity(flame_strike_entity)
    },
}
Object.assign(tetra_player_you_jian_strategies, lmtetra_player_you_jian_strategies)