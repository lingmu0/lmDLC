ItemEvents.rightClicked('lm_extra:glory',event =>{
    let {player} = event
    if(!player) return
    let count = player.persistentData.getInt('glory') ?? 0
    if(player.isCrouching()) {
        if(count) {
            let entityList = getLivingWithinRadius(player.getLevel(), player.position(), 10)
            // 对范围内的实体造成伤害（排除玩家自己）
            entityList.forEach(entity => {
                if (entity.isLiving() && entity != player) {
                    let time = entity.invulnerableTime
                    // 设置无敌时间为0，确保伤害能够造成
                    entity.invulnerableTime = 0
                    // 造成横扫伤害
                    entity.attack(player.damageSources().source($LMDamageTypes.PLAYER_ATTACK, player), count)
                    entity.invulnerableTime = time
                    
                }
            })
            player.persistentData.putInt('glory',0)
            player.getServer().runCommandSilent('playsound minecraft:entity.generic.explode player @a ' + player.x + ' ' + player.y + ' ' + player.z)
    
        }
        else {
            player.tell(`当前荣耀值：0`)
        }
    }
    else {
        player.tell(`当前荣耀值：${count}`)
    }
})