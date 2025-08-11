// priority: 7

let lmCuriosTetraPlayerAttackStrategies = {
    /**
     * 
     * @param {Internal.LivingHurtEvent} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "rainbow_gemstone": function (event, player, effectValue, item, originalEffectName) {
        let {entity,source}= event
        let sourceType = source.getType()
        if(sourceType !== "player") return
        let attackSpeed =  player.getAttributeValue('generic.attack_speed')
        for(let i=0; i < attackSpeed; i+=2.5) {
            entity.attack(player.damageSources().source(createDamagetype('cataclysm',"shredder"), player), 1)
            entity.invulnerableTime = 0
            entity.attack(player.damageSources().source(createDamagetype('attributeslib',"cold_damage"), player), 1)
            entity.invulnerableTime = 0
            entity.attack(player.damageSources().source(createDamagetype('attributeslib',"fire_damage"), player), 1)
            entity.invulnerableTime = 0
            entity.attack(player.damageSources().source(createDamagetype('minecraft',"pestilence"), player), 1)
            entity.invulnerableTime = 0
            entity.attack(player.damageSources().source($LMDamageTypes.MAGIC, player), 1)
            entity.invulnerableTime = 0
            entity.attack(player.damageSources().source($LMDamageTypes.LIGHTNING_BOLT, player), 1)
        }
    },
}
Object.assign(CuriosTetraPlayerAttackStrategies, lmCuriosTetraPlayerAttackStrategies);