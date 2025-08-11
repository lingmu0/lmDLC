// priority: 8
let lmtetraPlayerkeybindStrategies = {   
    /**
     * 朱赤之蝶
     * @param {*} event 
     * @param {Internal.Player} player 
     * @param {*} effectValue 
     * @param {*} item 
     * @param {*} originalEffectName 
     */
    'butterfly_of_zhuchi': function (event, player, effectValue, item, originalEffectName) {
        let time = player.persistentData.getInt("anxin_secret_method") ?? 0
        let CD = Math.abs(player.age - time)
        if (CD < 20 * 20){
            player.tell("安神秘法还在冷却中")
            return
        } 
        player.persistentData.putInt("anxin_secret_method", player.age)

        let entityList = getLivingWithinRadius(player.getLevel(), player.position(), 6)
        let attack_damage = player.getAttributeValue('generic.attack_damage')
        let fire_damage = player.getAttributeValue('attributeslib:fire_damage')

        let particleId = "minecraft:flame"

        if(effectValue == 6) {
            attack_damage *= 2
            fire_damage *= 2
            particleId = "minecraft:soul_fire_flame"
        }

        // 对范围内的实体造成横扫伤害（排除玩家自己）
        entityList.forEach(entity => {
            if (entity.isLiving() && entity != player) {
                player.heal(player.getMaxHealth() * 0.3)
                let time = entity.invulnerableTime
                // 设置无敌时间为0，确保伤害能够造成
                entity.invulnerableTime = 0
                entity.attack(player.damageSources().source(createDamagetype('attributeslib',"fire_damage"), player), (attack_damage+fire_damage) * 30 * effectValue )
                entity.invulnerableTime = time
            }
        })
        
        // 在玩家周围生成旋转一圈的火焰粒子动画（从玩家面向方向开始）
        let level = player.getLevel();
        let radius = 6;
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
}
Object.assign(tetraPlayerkeybindStrategies, lmtetraPlayerkeybindStrategies)