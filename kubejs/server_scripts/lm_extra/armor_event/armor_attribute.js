// priority: 7
//如果想移除装备时，移除增幅，记得填remove_attribute_and_persistentData
const lmarmor_tetra_attribute_Strategies = {
    // 娜迦速度
    'naga_scale': function (event, player, effectLevel, originalEffectName) {
        player.modifyAttribute('kubejs:generic.naga_speed', originalEffectName + 'armor', effectLevel, 'addition')
    },
}
Object.assign(armor_tetra_attribute_Strategies, lmarmor_tetra_attribute_Strategies)