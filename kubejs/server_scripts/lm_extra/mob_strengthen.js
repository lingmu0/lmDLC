// 借用脆骨症的代码
EntityEvents.spawned(event => {
    /**
    * @type {Internal.LivingEntity}
    */
    let entity = event.entity
    let dimension = event.level.dimension.toString()
    if (!entity || dimension !== "twilightforest:twilight_forest") return
    let player = entity.getLevel().getNearestPlayer(entity, 240)
    let entityName = entity.type
    if (!player) return
    if ((!entity.isLiving() || !entity.isMonster()) && entityName !== "jerotesvillage:second_rounder_golem") return
    if (entity.persistentData.contains('diffLevel') || entity.persistentData.contains("owner")) return
    // let diffStage = player.stages.getAll().toArray().find(ele => ele.startsWith('difficult_level_'))
    // if (!diffStage) {
    //     entity.persistentData.putInt('diffLevel', 1)
    //     return
    //}
    //let diffLevelNum = diffStage.match('difficult_level_(\\d+)')[1]
    let diffLevelNum = 10
    let diffLevel = difficultLevelDef[diffLevelNum - 1]
    entity.persistentData.putInt('diffLevel', diffLevelNum)
    if (diffLevel.healthMulti != 0 && entity.attributes.hasAttribute('minecraft:generic.max_health')) {
        entity.setAttributeBaseValue('minecraft:generic.max_health', entity.getAttribute('minecraft:generic.max_health').getValue() * diffLevel.healthMulti)
        entity.setHealth(entity.getMaxHealth())
    }
    // if (diffLevel.attackMulti != 0 && entity.attributes.hasAttribute('minecraft:generic.attack_damage')) {
    //     entity.setAttributeBaseValue('minecraft:generic.attack_damage', entity.getAttribute('minecraft:generic.attack_damage').getValue() * diffLevel.attackMulti)
    // }
    if (diffLevel.armorMulti != 0 && entity.attributes.hasAttribute('minecraft:generic.armor')) {
        entity.setAttributeBaseValue('minecraft:generic.armor', entity.getAttribute('minecraft:generic.armor').getValue() * diffLevel.armorMulti)
    }
    if (diffLevel.toughnessMulti != 0 && entity.attributes.hasAttribute('minecraft:generic.armor_toughness')) {
        entity.setAttributeBaseValue('minecraft:generic.armor_toughness', entity.getAttribute('minecraft:generic.armor_toughness').getValue() * diffLevel.toughnessMulti)
    }
})

NativeEvents.onEvent($LivingHurtEvent, (/** @type{Internal.LivingHurtEvent} */event) =>{
    let {source, amount, entity} = event
    if(entity.level.dimension.toString() !== "twilightforest:twilight_forest") return
    let sourceActual = source.actual
    if((sourceActual && sourceActual.isLiving() && sourceActual.isMonster()) || sourceActual.type === "jerotesvillage:second_rounder_golem") {
        if(sourceActual.persistentData.contains("owner")) return
        let diffLevelNum = 10
        let diffLevel = difficultLevelDef[diffLevelNum - 1]
        event.setAmount(amount * diffLevel.attackMulti)
    }
})
