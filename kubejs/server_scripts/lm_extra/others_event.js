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
NativeEvents.onEvent($LMMobEffectEvent$Remove, (/** @type{Internal.MobEffectEvent$Remove} */event) =>{
    let entity = event.entity
    if(!entity.isLiving()) return
    let effectName = lmeffectRegistry.get().getKey(event.getEffect())
    if(effectName == "lm_extra:steroid") {
        entity.server.scheduleInTicks(1, callback =>{
            entity.potionEffects.add('slowness', 20 * 15, 3)
            entity.potionEffects.add('weakness', 20 * 15, 9)
            entity.potionEffects.add('nausea', 20 * 15, 0)
        })
    }
})

NativeEvents.onEvent(Java.loadClass('net.minecraftforge.event.entity.living.MobEffectEvent$Expired'), (/** @type{Internal.MobEffectEvent$Expired} */event) =>{
    let entity = event.entity
    if(!entity.isLiving()) return
    let effectName = lmeffectRegistry.get().getKey(event.getEffectInstance().getEffect())
    if(effectName == "lm_extra:steroid") {
        entity.server.scheduleInTicks(1, callback =>{
            entity.potionEffects.add('slowness', 20 * 15, 3)
            entity.potionEffects.add('weakness', 20 * 15, 9)
            entity.potionEffects.add('nausea', 20 * 15, 0)
        })
    }
})