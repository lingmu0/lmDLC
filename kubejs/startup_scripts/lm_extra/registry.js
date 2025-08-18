StartupEvents.registry('item', event => {
    event.create("lm_extra:white_silk","basic")
    event.create("lm_extra:black_silk","basic")
    event.create("lm_extra:rage_blade","basic")
    event.create("lm_extra:maodie_breathe_out","basic")
    event.create("lm_extra:rainbow_gemstone","basic")
    event.create("lm_extra:color_ingot","basic")
    event.create("lm_extra:nature_heart","basic")
    event.create("lm_extra:glory","basic")
    event.create("lm_extra:gambling","basic")
    event.create("lm_extra:manbo","basic")
    event.create("lm_extra:wildly_arrogant","basic")
    event.create("lm_extra:dominate","basic")
    event.create("lm_extra:pearlescent_hand_protection","basic")
    event.create("lm_extra:sacred_sword","basic")
    event.create("lm_extra:polearm_billet", "basic")
    event.create("lm_extra:final_metal_ingot", "basic")

    event.create("lm_extra:staff_of_homa","sword")
        .attackDamageBaseline(10)
        .speedBaseline(-2.4)
        .maxDamage(10000)
        .maxStackSize(1)


    event.createCustom('tetra:staff_of_homa', () =>
        new Builder("staff_of_homa")
            .honeBase(240)
            .addMajorModuleKey('staff_of_homa1', 4, -4, true)
            .addMajorModuleKey("sword/hilt", 4, 20, true)
            .addMinorModuleKey("staff_of_homa2", -14, -2)
            .addMinorModuleKey("sword/fuller", -24, 12)
            .addMinorModuleKey("sword/guard", -14, 26)
            .setAttributeMode('tetra')
            .setSlotType("mainhand")
            .build()
    );
})

StartupEvents.registry('sound_event', event => {
    event.create("lm_extra:haqi")
    event.create("lm_extra:manbo")
})


StartupEvents.registry('mob_effect', event => {
    event.create("lm_extra:luck").beneficial().color(Color.GREEN)
        .modifyAttribute("minecraft:generic.luck","lm_extra_minecraft_luck",0.1, "multiply_total")
        .modifyAttribute("pasterdream:luck","lm_extra_pasterdream_luck",0.1, "multiply_total")
        
    
    event.create("lm_extra:butterfly_rebirth").beneficial().color(Color.RED)
        .modifyAttribute("generic.attack_damage","rebirth_attack_damage",0.1, "multiply_total")
    
    event.create("lm_extra:naga_speed").beneficial().color(Color.DARK_GREEN)
        .modifyAttribute("generic.movement_speed","naga_speed_movement_speed",0.1, "multiply_total")

    event.create("lm_extra:forbid_heal").harmful().color(Color.RED)
        .modifyAttribute("attributeslib:healing_received","forbid_heal_healing_received",-0.1, "multiply_base")

    event.create("lm_extra:blurring").beneficial().color(Color.BLACK)
})

const $RangedAttribute = Java.loadClass(
    'net.minecraft.world.entity.ai.attributes.RangedAttribute'
)

StartupEvents.registry('attribute', event => {
    event.createCustom('kubejs:generic.naga_speed', () => {
        return new $RangedAttribute(
            'attribute.name.generic.naga_speed',
            0.0,
            0.0,
            1000.0
        )
    })
    event.createCustom('kubejs:generic.lm_cold_damage', () => {
        return new $RangedAttribute(
            'attribute.name.generic.lm_cold_damage',
            0.0,
            0.0,
            10000000.0
        )
    })
})

ForgeModEvents.onEvent(
    'net.minecraftforge.event.entity.EntityAttributeModificationEvent', event => {
        if(!event.has('player','kubejs:generic.naga_speed')) {
            event.add('player','kubejs:generic.naga_speed')
            event.add('player','kubejs:generic.lm_cold_damage')
        }
    }
)