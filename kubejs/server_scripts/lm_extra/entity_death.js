NativeEvents.onEvent($LivingDeathEvent, (/**@type{Internal.LivingDeathEvent}*/event) => {
    let {entity, source} = event
    let player = source.player
    if(entity.isLiving() && entity.isMonster() && player){
        // 检查实体类型是否以cataclysm:开头
        if(entity.type.startsWith('cataclysm:')){
            if(Math.random() < 0.05){
                entity.level.getBlock(Math.floor(entity.x), Math.floor(entity.y), Math.floor(entity.z)).popItem('lm_extra:polearm_billet')
            }
        }

        // 检查玩家物品栏是否有荣耀
        let has = player.inventory.items.some(item => {
            return item.id === 'lm_extra:glory'
        })

        let has1 = player.getOffHandItem().id === 'lm_extra:glory'
        let has2 = player.getMainHandItem().id === 'lm_extra:glory'
        
        if(has||has1||has2){
            let count = player.persistentData.getInt('glory') ?? 0
            player.persistentData.putInt('glory',count+1)
        }
    }
})