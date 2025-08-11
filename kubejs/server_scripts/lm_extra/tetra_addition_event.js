//浴火锻兵
TetraAdditionEvents.craft(event => {
    let { player, level, currentSchematic, currentSlot, targetStack, upgradedStack, materials } = event
    if (level.clientSide) return
    let a = upgradedStack.nbt.getInt("staff_of_homa1:staff_of_homa/hone_refine") || 0
    let b = targetStack.nbt.getInt("staff_of_homa1:staff_of_homa/hone_refine") || 0
    if (a == b ||a != 5 || b != 4) return

    let random = Math.random()
    if (random < 0.75) {
        remove_improvement(upgradedStack, 'staff_of_homa/hone_refine', false)
        player.tell('锻造失败')
    }

    player.getServer().runCommandSilent('playsound minecraft:entity.generic.explode player @a ' + player.x + ' ' + player.y + ' ' + player.z)
    let flame_strike_entity = new $LMFlame_Strike_Entity(level, player.x, player.y, player.z, player.YHeadRot, 100, 10, 5, 3, 0, 6, false, player)
    level.addFreshEntity(flame_strike_entity)
})

// 修复护摩之杖锻造师等级加成高质量
//不同等级的锻造师获取加成
TetraAdditionEvents.craft(event =>{
    let player = event.player
    let level = event.level
    //防止单人的时候client侧出问题
    if (level.clientSide) return

    //学徒
    if (player.persistentData.contains("forge_grade_apprentice")){
        lmforge_grade_addition(event,0)
    }
    //入门
    if (player.persistentData.contains("forge_grade_novice")){
        lmforge_grade_addition(event,1)
    }
    //精英
    if (player.persistentData.contains("forge_grade_elite")){
        lmforge_grade_addition(event,2)
    }
    //传奇
    if (player.persistentData.contains("forge_grade_legendary")){
        lmforge_grade_addition(event,3)
    }
})
function lmforge_grade_addition(event, grade) {
    let item = event.upgradedStack;
    switch (item) {
        case "1 staff_of_homa":
            let gripQuality = item.nbt.getInt("sword/hilt:quality");
            if (gripQuality < grade) {
                $ItemModuleMajor.addImprovement(item, "sword/hilt", "quality", grade);
            }
            let plateQuality = item.nbt.getInt("staff_of_homa1:quality");
            if (plateQuality < grade) {
                $ItemModuleMajor.addImprovement(item, "staff_of_homa1", "quality", grade);
            }
            break;
    }
}