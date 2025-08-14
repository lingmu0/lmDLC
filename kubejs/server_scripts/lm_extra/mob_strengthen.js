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


NativeEvents.onEvent($LivingTickEvent, (/** @type{Internal.LivingEvent$LivingTickEvent} */event) => {
    /** @type{Internal.LivingEntity} */
    let entity = event.entity
    if (entity.age % 150 != 0) return
    if (entity.type === 'twilightforest:minoshroom') {
        let target = entity.getTarget();
        if (!target || !target.isLiving()) {
            return; // 没有仇恨目标则不生成
        }
        
        let level = entity.level
        
        let x0 = entity.x
        let y0 = entity.y + 1.5
        let z0 = entity.z
               
        let laser = new $LMDeath_Laser_Beam_Entity($LMModEntities.DEATH_LASER_BEAM.get(), level, entity, x0, y0, z0, (entity.yHeadRot + 90) * JavaMath.PI / 180, -entity.getViewXRot(1) * JavaMath.PI / 180, 100, 10, 0)
        
        level.addFreshEntity(laser)
    }
})

NativeEvents.onEvent($LivingTickEvent, (/** @type{Internal.LivingEvent$LivingTickEvent} */event) => {
    /** @type{Internal.LivingEntity} */
    let entity = event.entity;
    
    // 每10秒(200tick)执行一次
    if (entity.age % 200 !== 0) return;
    
    // 只对九头蛇实体生效
    if (entity.type === 'twilightforest:hydra') {
        // 检查九头蛇是否有仇恨目标（目标存在且是生物）
        let target = entity.getTarget();
        if (!target || !target.isLiving()) {
            return; // 没有仇恨目标则不生成
        }
        
        let level = entity.level;
        let x0 = entity.x;
        let y0 = entity.y;
        let z0 = entity.z;
        
        // 存储已生成实体的位置，用于距离校验
        let spawnedPositions = [];
        // 需要生成的总数量（包含目标脚下的1个）
        const totalCount = 5;
        
        // ===== 第一步：优先在仇恨目标脚下生成1个实体 =====
        // 获取目标的位置
        let targetX = target.x;
        let targetZ = target.z;
        
        // 在目标脚下生成第一个实体，并记录位置
        let targetFlameStrike = new $LMFlame_Strike_Entity(
            level, 
            targetX, // 目标X坐标（保持小数，更精准）
            target.y, 
            targetZ, // 目标Z坐标
            entity.YHeadRot, 
            60, 20, 0, 4, 20, 0, false, 
            entity
        );
        level.addFreshEntity(targetFlameStrike);
        spawnedPositions.push({x: targetX, z: targetZ});
        
        // ===== 第二步：生成剩余实体，确保与已有实体（包括目标脚下的）距离>6格 =====
        // 循环生成剩余实体（最多尝试30次，避免无限循环）
        for (let attempt = 0; attempt < 30 && spawnedPositions.length < totalCount; attempt++) {
            // 计算20格半径内的随机平面位置
            let angle = Math.random() * JavaMath.PI * 2;
            let distance = Math.random() * 20;
            let xOffset = Math.cos(angle) * distance;
            let zOffset = Math.sin(angle) * distance;
            
            // 计算基础XZ坐标
            let spawnX = x0 + xOffset;
            let spawnZ = z0 + zOffset;
            let blockX = Math.floor(spawnX);
            let blockZ = Math.floor(spawnZ);
            
            // 查找地形表面高度
            let surfaceY = -1;
            for (let y = Math.floor(y0) + 10; y >= 0; y--) {
                let block = level.getBlock(blockX, y, blockZ).getBlockState();
                let aboveBlock = level.getBlock(blockX, y + 1, blockZ).getBlockState();
                if (block.isSolid() && !aboveBlock.isSolid()) {
                    surfaceY = y + 1;
                    break;
                }
            }
            // 若未找到地面，使用默认高度
            if (surfaceY === -1) {
                surfaceY = y0;
            }
            
            // 检查与所有已生成实体（包括目标脚下的）的水平距离是否>6格
            let isDistanceValid = true;
            for (let pos of spawnedPositions) {
                let dx = spawnX - pos.x;
                let dz = spawnZ - pos.z;
                let horizontalDistance = Math.sqrt(dx * dx + dz * dz);
                
                if (horizontalDistance <= 6) {
                    isDistanceValid = false;
                    break;
                }
            }
            
            // 如果距离有效，则生成实体并记录位置
            if (isDistanceValid) {
                let flameStrike = new $LMFlame_Strike_Entity(
                    level, 
                    spawnX, 
                    surfaceY, 
                    spawnZ, 
                    entity.YHeadRot, 
                    60, 0, 0, 4, 6, 0, false, 
                    entity
                );
                level.addFreshEntity(flameStrike);
                spawnedPositions.push({x: spawnX, z: spawnZ});
            }
        }
    }
});

    


ServerEvents.tick(event => {
    event.server.entities.forEach(entity => {
        if (entity.type == 'cataclysm:death_laser_beam') {
            /** @type{Internal.LivingEntity} */
            let caster = entity.caster
            if(caster.type !== 'twilightforest:minoshroom') return
            entity.setYaw( (caster.yHeadRot + 90) * JavaMath.PI / 180);
            entity.setPitch( -caster.getViewXRot(1) * JavaMath.PI / 180);
            entity.setPos(caster.getX() ,caster.getY() + 1.5 , caster.getZ());
        }
    })
})
