// priority: 8
const lmcuriostetraTimeStrategies = {
    // 蛋白粉
    'protein_powder': function (event, player, effectLevel, originalEffectName) {
        let flag = player.persistentData.getInt(originalEffectName) ?? 0;
        if(flag) {
            let count = player.persistentData.getInt(YingYangCount)
            if(count === 0 ) {
                player.persistentData.putInt(originalEffectName, 0)
                player.tell('停止注射蛋白粉')
                return
            }
            updateYingYangCount(player, count-5)
        }
    }
};
Object.assign(curiostetraTimeStrategies, lmcuriostetraTimeStrategies)