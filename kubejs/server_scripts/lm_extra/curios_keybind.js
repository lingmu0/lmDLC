// priority: 8
const lmcurios_tetra_keybind_Strategies = {
    // 蛋白粉
    'protein_powder': function (event, player, effectLevel, originalEffectName) {
        let check_name = 'bio_lab'
        if (effect_check(player, check_name)) {
            let flag = player.persistentData.getInt(originalEffectName) ?? 0;
            if(!flag) {
                player.persistentData.putInt(originalEffectName, 1)
                player.tell('开始注射蛋白粉')
            }
            else {
                player.persistentData.putInt(originalEffectName, 0)
                player.tell('停止注射蛋白粉')
            }
        }
    }
}

Object.assign(curios_tetra_keybind_Strategies, lmcurios_tetra_keybind_Strategies)