// priority: 1000
let $LMDamageTypes = Java.loadClass('net.minecraft.world.damagesource.DamageTypes')
let $LMResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey');
let $LMRegistries = Java.loadClass('net.minecraft.core.registries.Registries')
let $LMCriticalHitEvent = Java.loadClass('net.minecraftforge.event.entity.player.CriticalHitEvent')
let $LMFlame_Strike_Entity = Java.loadClass('com.github.L_Ender.cataclysm.entity.effect.Flame_Strike_Entity')
let $LMDeath_Laser_Beam_Entity = Java.loadClass('com.github.L_Ender.cataclysm.entity.projectile.Death_Laser_Beam_Entity')
let $LMModEntities = Java.loadClass('com.github.L_Ender.cataclysm.init.ModEntities')
let $BuiltInRegistries = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
let $LMMobEffectEvent$Applicable = Java.loadClass('net.minecraftforge.event.entity.living.MobEffectEvent$Applicable')
let $LMMobEffectEvent$Remove = Java.loadClass('net.minecraftforge.event.entity.living.MobEffectEvent$Remove')  


const difficultLevelDef = [
    { healthMulti: 1, attackMulti: 1, armorMulti: 1, toughnessMulti: 1 },
    { healthMulti: 5, attackMulti: 1, armorMulti: 1, toughnessMulti: 1 },
    { healthMulti: 10, attackMulti: 1, armorMulti: 1, toughnessMulti: 1 },
    { healthMulti: 50, attackMulti: 1.5, armorMulti: 1, toughnessMulti: 1 },
    { healthMulti: 100, attackMulti: 1.5, armorMulti: 1, toughnessMulti: 1 },
    { healthMulti: 200, attackMulti: 2, armorMulti: 1.5, toughnessMulti: 1.5 },
    { healthMulti: 300, attackMulti: 3, armorMulti: 1.5, toughnessMulti: 1.5 },
    { healthMulti: 500, attackMulti: 4, armorMulti: 2, toughnessMulti: 2 },
    { healthMulti: 1000, attackMulti: 5, armorMulti: 2, toughnessMulti: 2 },
    { healthMulti: 3000, attackMulti: 6, armorMulti: 2.5, toughnessMulti: 2.5 },
    { healthMulti: 5000, attackMulti: 7, armorMulti: 2.5, toughnessMulti: 2.5 },
    { healthMulti: 10000, attackMulti: 8, armorMulti: 3, toughnessMulti: 3 },
]

/**
 * 创建伤害类型
 * @param {String} modId 
 * @param {String} damageTypeName 
 * @returns 
 */
function createDamagetype(modId, damageTypeName) {
    return $LMResourceKey.create($LMRegistries.DAMAGE_TYPE,new ResourceLocation(modId,damageTypeName))
}

/**
 * 获取所有正面buff
 * @returns {Array<Internal.MobEffect>}
 */
function getAllBuff() {
    let mobEffects = $BuiltInRegistries.MOB_EFFECT.stream().toList()

    let positiveBuffs = [];

    mobEffects.forEach(effect => {
        // effect 是 Internal.MobEffect
        if (effect.isBeneficial()) { // 检查是否是正面效果
            positiveBuffs.push(effect);
        }
    });

    return positiveBuffs
}

/**
* 获取某个半径内的生物
* @param {Internal.Level} level
* @param {Vec3} pos
* @param {Number} radius
* @returns {Array<Internal.LivingEntity>}
*/
function lmgetLivingWithinRadius(level, pos, radius) {
    let area = new AABB.of(pos.x() - radius, pos.y() - radius, pos.z() - radius, pos.x() + radius, pos.y() + radius, pos.z() + radius)
    let entityAABBList = level.getEntitiesWithin(area)
    let entityList = []
    entityAABBList.forEach(entity => {
        if (entity.position() && entity.position().distanceTo(pos) <= radius) {
            entityList.push(entity)
        }
    })
    return entityList
}

/**
 * 检测生物脚下方块
 * @param {Internal.LivingEntity} entity 
 * @param {String} block 
 * @returns {Boolean} 是否为指定方块
 */
function checkDownBlock(entity, block) {
    let world = entity.level;
    let blockX = Math.floor(entity.x);
    let blockY = Math.floor(entity.y - 1); 
    let blockZ = Math.floor(entity.z);
    let targetBlock = world.getBlock(blockX, blockY, blockZ);

    return targetBlock.getId() === block;
}

function lmGetEffectEfficiency(itemstack, effectname) {
    if (itemstack.item instanceof $ModularItem) {
        return itemstack.item.getEffectEfficiency(itemstack, $ItemEffect.get(effectname))
    }
}


/**
 * 斩击
 * @param {Internal.LivingEntity} entity 
 * @param {number} count 
 * @param {number} step 
 * @param {Internal.ParticleOptions_} particleId 
 */
function lmdrawSlashParticleLine(entity, count, step, particleId) {
    const level = entity.level;
    if (count === undefined) count = 30
    if (step === undefined) step = 0.1
    if (particleId === undefined) particleId = "minecraft:end_rod"

    count = Math.max(2, count || 10);
    step = Math.max(0.1, step || 0.5); // 每个粒子的偏移量

    // 获取实体位置
    const ex = entity.x
    const ey = entity.y + entity.getBbHeight() / 2
    const ez = entity.z
    //player.tell("[调试] 融梦极光斩击实体位置: " + ex + ", " + ey + ", " + ez);
    let x = ex, ax = ex
    let y = ey, ay = ey
    let z = ez, az = ez

    // 正向粒子线
    for (let j = 0; j <= count / 2; j++) {
        level.runCommandSilent(`particle ${particleId} ${x} ${y} ${z} 0 0 0 0 1 force`)
        x += step
        y += step
        z += step
    }

    // 反向粒子线
    for (let j = count / 2; j < count; j++) {
        level.runCommandSilent(`particle ${particleId} ${ax} ${ay} ${az} 0 0 0 0 1 force`)
        ax -= step
        ay -= step
        az -= step
    }

    x = ex, ax = ex
    y = ey, ay = ey
    z = ez, az = ez


    // 正向粒子线
    for (let j = 0; j <= count / 2; j++) {
        level.runCommandSilent(`particle ${particleId} ${x} ${y} ${z} 0 0 0 0 1 force`)
        x += step
        y += step
        z -= step
    }

    // 反向粒子线
    for (let j = count / 2; j < count; j++) {
        level.runCommandSilent(`particle ${particleId} ${ax} ${ay} ${az} 0 0 0 0 1 force`)
        ax -= step
        ay -= step
        az += step
    }
}

/**
 * 随机偏移的斩击线
 * @param {Internal.LivingEntity} entity 
 * @param {String} particleType 
 * @param {Number} angleOffset 
 * @param {*} player 
 * @returns 
 */
function lmdrawSingleRandomSlashLineWithOffset(entity, particleType, angleOffset, player) {

    // 检查实体坐标是否有效
    if (!entity || !entity.x || !entity.y || !entity.z) {
        return
    }

    let randomAngle = Math.random() * 2.094 // 120度的弧度值
    let angle = (angleOffset * 3.1415926 / 180) + randomAngle // 转换为弧度并加上偏移


    // 检查角度计算是否有效
    if (isNaN(angle)) {
        return
    }

    let distance = 4 + Math.random() * 2 // 4-6格距离
    let startX = entity.x + Math.cos(angle) * distance
    let startZ = entity.z + Math.sin(angle) * distance

    // 增加斩击的倾斜度 - 确保Y坐标有效
    let heightVariation = 2 + Math.random() * 2 // 2-4格的高度变化
    let startY, endY

    //从上往下或是从下往上
    if (Math.random() < 0.5) {
        startY = entity.y + heightVariation
        endY = entity.y - 0.5
    } else {
        startY = entity.y - 0.5
        endY = entity.y + heightVariation
    }

    // 检查Y坐标是否有效
    if (isNaN(startY) || isNaN(endY)) {
        return
    }

    // 终点在敌人的对面，形成倾斜的斩击线
    let endX = entity.x - Math.cos(angle) * distance
    let endZ = entity.z - Math.sin(angle) * distance

    // 检查所有坐标是否有效
    if (isNaN(startX) || isNaN(startZ) || isNaN(endX) || isNaN(endZ)) {
        return
    }

    // 计算斩击线的步数
    let dx = endX - startX
    let dy = endY - startY
    let dz = endZ - startZ
    let totalDistance = Math.sqrt(dx * dx + dy * dy + dz * dz)

    // 检查距离计算是否有效
    if (isNaN(totalDistance) || totalDistance <= 0) {
        return
    }

    let steps = Math.min(Math.floor(totalDistance * 3.0), 40) // 最大步数限制为40（避免过多性能消耗）
    if (steps < 32) {
        steps = 32 // 最少粒子数提升至32（原16）
    }

    // 绘制倾斜的斩击线
    for (let i = 0; i <= steps; i++) {
        let progress = i / steps
        let particleX = startX + dx * progress
        let particleY = startY + dy * progress
        let particleZ = startZ + dz * progress

        // 检查粒子坐标是否有效
        if (isNaN(particleX) || isNaN(particleY) || isNaN(particleZ)) {
            continue
        }

        // 随机偏移
        let randomOffset = 0.1
        let offsetX = (Math.random() - 0.5) * randomOffset
        let offsetY = (Math.random() - 0.5) * randomOffset * 0.5 // Y轴偏移减少，保持斩击线的方向性
        let offsetZ = (Math.random() - 0.5) * randomOffset

        entity.level.spawnParticles(particleType, true,
            particleX + offsetX, particleY + offsetY, particleZ + offsetZ,
            0, 0, 0, 0.05, 4) // 每个位置粒子数为4
    }
}

/**
 * DFS / BFS 搜索
 * @param {BlockPos} startPos 起始方块位置
 * @param {String} prefix 方块前缀
 * @param {number} requiredCount 所需数量
 * @param {Internal.Level} level
 * @returns 
 */
function lmsearchBlocks(startPos, prefix, requiredCount, level) {
    let visited = new Set(); // 记录访问过的方块
    let stack = [startPos];  // 用栈 DFS，换成队列就是 BFS

    let found = 0;

    while (stack.length > 0 && found < requiredCount) {
        let current = stack.pop();
        let key = `${current.x},${current.y},${current.z}`;
        if (visited.has(key)) continue;
        visited.add(key);

        let blockId = level.getBlock(current).id.toString();
        if (!blockId.startsWith(prefix)) continue;

        found++;

        // 相邻 6 个方向
        let offsets = [
            [ 1, 0, 0],
            [-1, 0, 0],
            [ 0, 1, 0],
            [ 0,-1, 0],
            [ 0, 0, 1],
            [ 0, 0,-1]
        ];

        for (let [dx, dy, dz] of offsets) {
            let newPos = current.offset(dx, dy, dz);
            let newKey = `${newPos.x},${newPos.y},${newPos.z}`;
            if (!visited.has(newKey)) {
                stack.push(newPos);
            }
        }
    }

    return found;
}
/**
 * 
 * @param {Internal.Level} level 
 * @param {String} entityid 
 * @param {number} x
 * @param {number} y
 * @param {number} z
 */
function lmsummonCreature(level, entityid, x, y, z) {
        let entity = level.createEntity(entityid)
        entity.setPosition(x, y, z)
        entity.spawn()
}

/**
 * 暴击特效
 * @param {Internal.Player} player 
 * @param {Internal.Entity} entity 
 */
let critHit = (player, entity) => {
    let { level, x, y, z, soundSource } = player

    level.playSound(
        null,
        x,
        y,
        z,
        'minecraft:entity.player.attack.crit',
        soundSource,
        1,
        1
    )
    player.crit(entity)
}

