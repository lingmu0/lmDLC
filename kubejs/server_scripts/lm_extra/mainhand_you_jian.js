// priority: 8
let lmtetra_player_you_jian_strategies = {   
    /**
     * 神威
     * @param {ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    'final_metal_ingot': function (event, player, effectValue, item, originalEffectName) {
        if(!player.isCrouching()) return
        let target = player.rayTrace(32, true);
        if (!target) return;
        let hitX = target.hitX;
        let hitY = target.hitY;
        let hitZ = target.hitZ;
        let level = player.getLevel();
        let r = 6;

        // 移除范围内实体
        let entityList = lmgetLivingWithinRadius(level, new Vec3d(hitX, hitY, hitZ), r);
        entityList.forEach(entity => {
            if (!entity.isPlayer()) {
                entity.remove('discarded');
            }
        });

        // 移除范围内方块
        for (let x = -r; x <= r; x++) {
            for (let y = -r; y <= r; y++) {
                for (let z = -r; z <= r; z++) {
                    let bx = Math.floor(hitX + x);
                    let by = Math.floor(hitY + y);
                    let bz = Math.floor(hitZ + z);

                    // 判断是否在球体范围内
                    if (x * x + y * y + z * z <= r * r) {
                        let blockPos = BlockPos(bx, by, bz);

                        // 检查方块是否为空气，避免多余操作
                        let blockState = level.getBlockState(blockPos);
                        if (!blockState.isAir()) {
                            // true 表示掉落方块，false 表示不掉落,有粒子特效导致卡顿
                            //level.destroyBlock(blockPos, false);
                            level.setBlock(blockPos, Blocks.AIR.defaultBlockState(), 3);
                        }
                    }
                }
            }
        }

        // 粒子与动画参数
        let particleId = "minecraft:end_rod";
        let totalFrames = 8;   
        let rotations = 0.15;    
        let anglePerFrame = (2 * JavaMath.PI * rotations) / totalFrames;

        // 卍图案参数
        let radius = 4;       
        let arms = 4;
        let steps = 60;

        let playerYawRadians = player.YHeadRot * (JavaMath.PI / 180);

        function spawnWan(frame) {
            if (frame >= totalFrames) return;

            let currentAngle = frame * anglePerFrame;

            for (let arm = 0; arm < arms; arm++) {
                let angleOffset = arm * (JavaMath.PI / 2);
                for (let i = 0; i < steps; i++) {
                    let t = i / steps;  // 0 -> 1
                    let scale = 1 - t;  // 越靠近中心缩放越小

                    // 保持弯曲，同时收束
                    let localX = Math.cos(t * JavaMath.PI + angleOffset + currentAngle) * (radius + t*0.3) * scale;
                    let localY = Math.sin(t * JavaMath.PI + angleOffset + currentAngle) * (radius + t*0.3) * scale;

                    let rotatedX = localX * Math.cos(playerYawRadians);
                    let rotatedZ = localX * Math.sin(playerYawRadians);

                    level.spawnParticles(
                        particleId, true,
                        hitX + rotatedX, hitY + localY, hitZ + rotatedZ,
                        0, 0, 0,
                        0, 0.01
                    );
                }
            }

            player.server.scheduleInTicks(1, () => spawnWan(frame + 1));
        }

        spawnWan(0);

    },
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
        if (CD < 20 * 15){
            player.tell("魂火轰击还在冷却中")
            return
        } 
        player.persistentData.putInt(originalEffectName, player.age)

        let flame_strike_entity = new $LMFlame_Strike_Entity(level, player.x, player.y, player.z, player.YHeadRot, 20*7.5, 0, 0, 10, player.getAttributeValue('attributeslib:fire_damage'), 0, true, player)
        level.addFreshEntity(flame_strike_entity)
    },
    /**
     * 米诺菇奖杯
     * @param {Internal.ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "minoshroom_trophy": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity, amount, level}= event
        let time = player.persistentData.getInt(originalEffectName) ?? 0

        let CD = Math.abs(player.age - time)
        if (CD < 20 * 15){
            player.tell("死亡激光还在冷却中")
            return
        } 
        player.persistentData.putInt(originalEffectName, player.age)

        let x0 = player.x
        let y0 = player.y + 0.9
        let z0 = player.z
              
        let laser = new $LMDeath_Laser_Beam_Entity($LMModEntities.DEATH_LASER_BEAM.get(), player.level, player, x0, y0, z0, (player.yHeadRot + 90) * JavaMath.PI / 180, -player.getViewXRot(1) * JavaMath.PI / 180, 20 * 5, 100, 0)
        
        player.level.addFreshEntity(laser)
    },
}
Object.assign(tetra_player_you_jian_strategies, lmtetra_player_you_jian_strategies)