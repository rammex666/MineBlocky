/* =========================================
   BLOCS D'ÉVÉNEMENTS MINECRAFT
   ========================================= */

/**
 * Définit tous les blocs d'événements Minecraft
 * @param {Object} generator - Générateur Java
 */
function defineEventBlocks(generator) {

    /* ========================================
       ÉVÉNEMENTS JOUEUR
       ======================================== */

    // Join/Quit
    createEventBlock('event_player_join', 'Quand joueur REJOINT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_join', 'onJoin', 'PlayerJoinEvent');

    createEventBlock('event_player_quit', 'Quand joueur QUITTE', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_quit', 'onQuit', 'PlayerQuitEvent');

    // Chat
    createEventBlock('event_player_chat', 'Quand joueur TCHAT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_chat', 'onChat', 'AsyncPlayerChatEvent');

    // Interactions
    createEventBlock('event_player_interact', 'Quand joueur CLIQUE', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_interact', 'onInteract', 'PlayerInteractEvent');

    createEventBlock('event_player_interact_entity', 'Quand joueur CLIQUE sur entité', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_interact_entity', 'onInteractEntity', 'PlayerInteractEntityEvent');

    // Mouvement
    createEventBlock('event_player_move', 'Quand joueur BOUGE', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_move', 'onMove', 'PlayerMoveEvent');

    createEventBlock('event_player_teleport', 'Quand joueur se TÉLÉPORTE', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_teleport', 'onTeleport', 'PlayerTeleportEvent');

    // Mort/Respawn
    createEventBlock('event_player_death', 'Quand joueur MEURT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_death', 'onDeath', 'PlayerDeathEvent');

    createEventBlock('event_player_respawn', 'Quand joueur RÉAPPARAÎT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_respawn', 'onRespawn', 'PlayerRespawnEvent');

    // Actions
    createEventBlock('event_player_sneak', 'Quand joueur S\'ACCROUPIT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_sneak', 'onSneak', 'PlayerToggleSneakEvent');

    createEventBlock('event_player_sprint', 'Quand joueur COURT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_sprint', 'onSprint', 'PlayerToggleSprintEvent');

    createEventBlock('event_player_drop_item', 'Quand joueur JETTE item', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_drop_item', 'onDropItem', 'PlayerDropItemEvent');

    createEventBlock('event_player_pickup_item', 'Quand joueur RAMASSE item', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_pickup_item', 'onPickupItem', 'EntityPickupItemEvent');

    createEventBlock('event_player_consume', 'Quand joueur MANGE/BOIT', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_consume', 'onConsume', 'PlayerItemConsumeEvent');

    // Lit
    createEventBlock('event_player_bed_enter', 'Quand joueur ENTRE dans lit', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_bed_enter', 'onBedEnter', 'PlayerBedEnterEvent');

    createEventBlock('event_player_bed_leave', 'Quand joueur SORT du lit', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_bed_leave', 'onBedLeave', 'PlayerBedLeaveEvent');

    // Commandes
    createEventBlock('event_player_command', 'Quand joueur EXÉCUTE commande', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_command', 'onCommand', 'PlayerCommandPreprocessEvent');

    // Changements
    createEventBlock('event_player_gamemode_change', 'Quand MODE DE JEU change', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_gamemode_change', 'onGameModeChange', 'PlayerGameModeChangeEvent');

    createEventBlock('event_player_exp_change', 'Quand EXPÉRIENCE change', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_exp_change', 'onExpChange', 'PlayerExpChangeEvent');

    createEventBlock('event_player_level_change', 'Quand NIVEAU change', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_level_change', 'onLevelChange', 'PlayerLevelChangeEvent');

    // Pêche
    createEventBlock('event_player_fish', 'Quand joueur PÊCHE', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_fish', 'onFish', 'PlayerFishEvent');

    // Portail
    createEventBlock('event_player_portal', 'Quand joueur ENTRE dans portail', COLORS.EVENT_PLAYER);
    createEventGenerator(generator, 'event_player_portal', 'onPortal', 'PlayerPortalEvent');

    /* ========================================
       ÉVÉNEMENTS BLOC
       ======================================== */

    createEventBlock('event_block_break', 'Quand joueur CASSE bloc', COLORS.EVENT_BLOCK);
    createEventGenerator(generator, 'event_block_break', 'onBreak', 'BlockBreakEvent');

    createEventBlock('event_block_place', 'Quand joueur PLACE bloc', COLORS.EVENT_BLOCK);
    createEventGenerator(generator, 'event_block_place', 'onPlace', 'BlockPlaceEvent');

    createEventBlock('event_block_burn', 'Quand bloc BRÛLE', COLORS.EVENT_BLOCK);
    generator.forBlock['event_block_burn'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onBlockBurn(BlockBurnEvent event) {
${actions}}
`;
    };

    createEventBlock('event_block_explode', 'Quand bloc EXPLOSE', COLORS.EVENT_BLOCK);
    generator.forBlock['event_block_explode'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onBlockExplode(BlockExplodeEvent event) {
${actions}}
`;
    };

    createEventBlock('event_block_grow', 'Quand plante POUSSE', COLORS.EVENT_BLOCK);
    generator.forBlock['event_block_grow'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onBlockGrow(BlockGrowEvent event) {
${actions}}
`;
    };

    createEventBlock('event_block_ignite', 'Quand bloc S\'ENFLAMME', COLORS.EVENT_BLOCK);
    generator.forBlock['event_block_ignite'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onBlockIgnite(BlockIgniteEvent event) {
    Player player = event.getPlayer();
${actions}}
`;
    };

    createEventBlock('event_block_spread', 'Quand bloc SE PROPAGE', COLORS.EVENT_BLOCK);
    generator.forBlock['event_block_spread'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onBlockSpread(BlockSpreadEvent event) {
${actions}}
`;
    };

    createEventBlock('event_sign_change', 'Quand PANNEAU change', COLORS.EVENT_BLOCK);
    createEventGenerator(generator, 'event_sign_change', 'onSignChange', 'SignChangeEvent');

    /* ========================================
       ÉVÉNEMENTS ENTITÉ
       ======================================== */

    createEventBlock('event_entity_damage', 'Quand entité PREND DÉGÂTS', COLORS.EVENT_BLOCK);
    generator.forBlock['event_entity_damage'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onEntityDamage(EntityDamageEvent event) {
    if (event.getEntity() instanceof Player) {
        Player player = (Player) event.getEntity();
${actions}    }
}
`;
    };

    createEventBlock('event_entity_damage_by_entity', 'Quand entité FRAPPE entité', COLORS.EVENT_BLOCK);
    generator.forBlock['event_entity_damage_by_entity'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onEntityDamageByEntity(EntityDamageByEntityEvent event) {
    if (event.getDamager() instanceof Player) {
        Player player = (Player) event.getDamager();
${actions}    }
}
`;
    };

    createEventBlock('event_entity_death', 'Quand entité MEURT', COLORS.EVENT_BLOCK);
    generator.forBlock['event_entity_death'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onEntityDeath(EntityDeathEvent event) {
    if (event.getEntity().getKiller() != null) {
        Player player = event.getEntity().getKiller();
${actions}    }
}
`;
    };

    createEventBlock('event_entity_spawn', 'Quand entité APPARAÎT', COLORS.EVENT_BLOCK);
    generator.forBlock['event_entity_spawn'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onEntitySpawn(EntitySpawnEvent event) {
${actions}}
`;
    };

    createEventBlock('event_entity_explode', 'Quand entité EXPLOSE', COLORS.EVENT_BLOCK);
    generator.forBlock['event_entity_explode'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onEntityExplode(EntityExplodeEvent event) {
${actions}}
`;
    };

    createEventBlock('event_entity_target', 'Quand entité CIBLE joueur', COLORS.EVENT_BLOCK);
    generator.forBlock['event_entity_target'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onEntityTarget(EntityTargetEvent event) {
    if (event.getTarget() instanceof Player) {
        Player player = (Player) event.getTarget();
${actions}    }
}
`;
    };

    createEventBlock('event_projectile_hit', 'Quand PROJECTILE touche', COLORS.EVENT_BLOCK);
    generator.forBlock['event_projectile_hit'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onProjectileHit(ProjectileHitEvent event) {
    if (event.getEntity().getShooter() instanceof Player) {
        Player player = (Player) event.getEntity().getShooter();
${actions}    }
}
`;
    };

    createEventBlock('event_projectile_launch', 'Quand PROJECTILE lancé', COLORS.EVENT_BLOCK);
    generator.forBlock['event_projectile_launch'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onProjectileLaunch(ProjectileLaunchEvent event) {
    if (event.getEntity().getShooter() instanceof Player) {
        Player player = (Player) event.getEntity().getShooter();
${actions}    }
}
`;
    };

    /* ========================================
       ÉVÉNEMENTS INVENTAIRE
       ======================================== */

    createEventBlock('event_inventory_click', 'Quand joueur CLIQUE inventaire', '#8e44ad');
    generator.forBlock['event_inventory_click'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onInventoryClick(InventoryClickEvent event) {
    Player player = (Player) event.getWhoClicked();
${actions}}
`;
    };

    createEventBlock('event_inventory_close', 'Quand joueur FERME inventaire', '#8e44ad');
    generator.forBlock['event_inventory_close'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onInventoryClose(InventoryCloseEvent event) {
    Player player = (Player) event.getPlayer();
${actions}}
`;
    };

    createEventBlock('event_inventory_open', 'Quand joueur OUVRE inventaire', '#8e44ad');
    generator.forBlock['event_inventory_open'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onInventoryOpen(InventoryOpenEvent event) {
    Player player = (Player) event.getPlayer();
${actions}}
`;
    };

    createEventBlock('event_inventory_drag', 'Quand joueur GLISSE items', '#8e44ad');
    generator.forBlock['event_inventory_drag'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onInventoryDrag(InventoryDragEvent event) {
    Player player = (Player) event.getWhoClicked();
${actions}}
`;
    };

    createEventBlock('event_craft_item', 'Quand joueur CRAFT item', '#8e44ad');
    generator.forBlock['event_craft_item'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onCraftItem(CraftItemEvent event) {
    Player player = (Player) event.getWhoClicked();
${actions}}
`;
    };

    /* ========================================
       ÉVÉNEMENTS VÉHICULE
       ======================================== */

    createEventBlock('event_vehicle_enter', 'Quand joueur MONTE véhicule', '#16a085');
    generator.forBlock['event_vehicle_enter'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onVehicleEnter(VehicleEnterEvent event) {
    if (event.getEntered() instanceof Player) {
        Player player = (Player) event.getEntered();
${actions}    }
}
`;
    };

    createEventBlock('event_vehicle_exit', 'Quand joueur DESCEND véhicule', '#16a085');
    generator.forBlock['event_vehicle_exit'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onVehicleExit(VehicleExitEvent event) {
    if (event.getExited() instanceof Player) {
        Player player = (Player) event.getExited();
${actions}    }
}
`;
    };

    createEventBlock('event_vehicle_damage', 'Quand véhicule ENDOMMAGÉ', '#16a085');
    generator.forBlock['event_vehicle_damage'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onVehicleDamage(VehicleDamageEvent event) {
    if (event.getAttacker() instanceof Player) {
        Player player = (Player) event.getAttacker();
${actions}    }
}
`;
    };

    createEventBlock('event_vehicle_destroy', 'Quand véhicule DÉTRUIT', '#16a085');
    generator.forBlock['event_vehicle_destroy'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onVehicleDestroy(VehicleDestroyEvent event) {
    if (event.getAttacker() instanceof Player) {
        Player player = (Player) event.getAttacker();
${actions}    }
}
`;
    };

    /* ========================================
       ÉVÉNEMENTS MONDE
       ======================================== */

    createEventBlock('event_weather_change', 'Quand MÉTÉO change', '#27ae60');
    generator.forBlock['event_weather_change'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onWeatherChange(WeatherChangeEvent event) {
${actions}}
`;
    };

    createEventBlock('event_thunder_change', 'Quand ORAGE change', '#27ae60');
    generator.forBlock['event_thunder_change'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onThunderChange(ThunderChangeEvent event) {
${actions}}
`;
    };

    createEventBlock('event_chunk_load', 'Quand CHUNK charge', '#27ae60');
    generator.forBlock['event_chunk_load'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onChunkLoad(ChunkLoadEvent event) {
${actions}}
`;
    };

    createEventBlock('event_chunk_unload', 'Quand CHUNK décharge', '#27ae60');
    generator.forBlock['event_chunk_unload'] = function(block) {
        const actions = generator.statementToCode(block, 'ACTIONS');
        return `@EventHandler
public void onChunkUnload(ChunkUnloadEvent event) {
${actions}}
`;
    };
}
