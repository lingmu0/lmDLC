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
    /**
     * 雪怪首领奖杯
     * @param {Internal.ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "alpha_yeti_trophy": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity, amount, level}= event
        let time = player.persistentData.getInt(originalEffectName) ?? 0

        let CD = Math.abs(player.age - time)
        if (CD < 20 * 20){
            player.tell("冰爆术还在冷却中")
            return
        } 
        player.persistentData.putInt(originalEffectName, player.age)
        let coldDamageAmount = player.getAttributeValue('kubejs:generic.lm_cold_damage')

        let entityList = getLivingWithinRadius(level, player.position(), 10);
        entityList.forEach(entity => {
            if (entity.isLiving() && entity != player) {
                entity.potionEffects.add('twilightforest:frosted', 20 * 10, 9)
                simpleAttackEntity(true, player, entity, 'attributeslib:cold_damage', coldDamageAmount * 5)
            }
        });

        // 在玩家周围生成旋转一圈的冰霜粒子动画（从玩家面向方向开始）
        let particleId = "minecraft:snowflake"
        let radius = 10;
        let particleCountPerFrame = 10; // 每帧生成的水平粒子数量（控制密度）
        let verticalLayers = 5; // 垂直层数
        let layerSpacing = 0.5; // 层间距
        let totalFrames = 12; // 旋转一圈的总帧数（数值越小旋转越快）
        let anglePerFrame = (2 * JavaMath.PI) / totalFrames; // 每帧递增的角度（弧度）

        // 获取玩家面向的初始角度（关键修改）
        // 玩家水平旋转角（度，-180~180，0°=向南，90°=向西，180°=向北，-90°=向东）
        let playerYawRadians = player.YHeadRot * (JavaMath.PI / 180);

        // 定义每帧执行的任务
        function spawnFrame(frame, particle) {
            // 若已完成所有帧，停止调度
            if (frame >= totalFrames) {
                return;
            }

            // 计算当前帧的角度：玩家初始朝向 + 每帧递增角度（关键修改）
            let currentAngle = playerYawRadians + frame * anglePerFrame;

            // 生成当前角度的垂直多层粒子
            for (let v = 0; v < verticalLayers; v++) {
                // 计算垂直位置
                let yOffset = (v - (verticalLayers - 1) / 2) * layerSpacing;
                let y = player.y + 1.5 + yOffset;

                // 每帧在当前角度周围生成粒子
                for (let i = 0; i < particleCountPerFrame; i++) {
                    // 基于当前角度微调，增加密度
                    let angle = currentAngle + (i / particleCountPerFrame) * anglePerFrame;
                    let x = player.x + radius * Math.cos(angle);
                    let z = player.z + radius * Math.sin(angle);

                    level.runCommandSilent(`/particle ${particle} ${x} ${y} ${z} 0 0 0 1 1 force`);
                }
            }

            // 调度下一帧（1tick后执行）
            player.server.scheduleInTicks(1, () => spawnFrame(frame + 1, particle));
        }

        // 启动动画（从第0帧开始）
        spawnFrame(0, particleId);
    },
    /**
     * 暮初恶魂奖杯
     * @param {Internal.ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "ur_ghast_trophy": function (event, player, effectValue, itemstack, originalEffectName) {
        let {entity, amount, level}= event
        let time = player.persistentData.getInt(originalEffectName) ?? 0

        let CD = Math.abs(player.age - time)
        if (CD < 20 * 20){
            player.tell("火之泪伤还在冷却中")
            return
        } 
        //player.persistentData.putInt(originalEffectName, player.age)

        let entityList = getLivingWithinRadius(level, player.position(), 10);
        player.potionEffects.add('regeneration', 20 * 5, entityList.length - 1)
        
        // 持续时间 & tick 计数
        let duration = 20 * 5; // 10秒 = 200 tick
        let tickCount = 0;

        let repeat = player.server.scheduleRepeatingInTicks(1, () => {
            // 每 5tick 给每个实体刷粒子
            if (tickCount % 5 === 0) {
                entityList.forEach(target => {
                    if (!target.isLiving() || !target.isAlive() || target == player) return
                    level.spawnParticles('twilightforest:boss_tear', true,
                        target.getX() + (target.getRandom().nextDouble() - 0.5) * target.getBbWidth() * 0.1,
                        target.getY() + target.getRandom().nextDouble() * target.getBbHeight() * 0.5 + 5,
                        target.getZ() + (target.getRandom().nextDouble() - 0.5) * target.getBbWidth() * 0.1,
                        0, 0, 0,
                        0, 0
                    );
                });
            }

            tickCount++;

            // 每 10 tick 造成一次攻击
            if (tickCount % 10 === 0) {
                entityList.forEach(target => {
                    if (!target.isLiving() || !target.isAlive() || target == player) return
                    simpleAttackEntity(true, player, target, 'twilightforest:ghast_tear', player.getAttributeValue('attributeslib:fire_damage'));
                });
            }

            // 10秒后停止
            if (tickCount >= duration) {
                repeat.clear() // 停止任务
            }
        }); // 每 1 tick 执行一次

    },
    /**
     * 蛇之救赎
     * @param {Internal.ItemClickedEventJS} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    "hydralBond": function (event, player, effectValue, itemstack, originalEffectName) {
        let firetime = Math.max(0, player.remainingFireTicks * 0.05)
        player.tell("剩余燃烧时间："+firetime.toFixed(1)+" s")
    },
}
Object.assign(tetra_player_you_jian_strategies, lmtetra_player_you_jian_strategies)