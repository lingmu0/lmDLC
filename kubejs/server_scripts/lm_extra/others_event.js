/**
 * 暴击事件
 */
NativeEvents.onEvent(Java.loadClass('net.minecraftforge.event.entity.player.CriticalHitEvent'), (/** @type{Internal.CriticalHitEvent} */event)=>{
    let player = event.entity
    if(!player.isPlayer()) return

    let item = player.getMainHandItem();
    if (!item.item instanceof $ModularItem) return;

    let effect = simpleGetTetraEffectLevel(item, "pearlescent_hand_protection")
    if(!effect) return
    event.setResult('deny')
})

/**
 * 药水移除
 */
NativeEvents.onEvent(Java.loadClass($LMMobEffectEvent$Remove), (/** @type{Internal.MobEffectEvent$Remove} */event) =>{
    let effectName = effectRegistry.get().getKey(event.getEffectInstance().getEffect())
})