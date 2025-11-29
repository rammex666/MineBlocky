/* =========================================
   FICHIER PRINCIPAL - MINEBLOCKLY
   ========================================= */

// Variables globales
var workspace = null;
var javaGenerator = new Blockly.Generator('JAVA');
var cachedCode = {
    listenerClasses: {},
    commandClasses: {},
    commandsList: {},
    guiManager: "",
    main: "",
    pom: "",
    pluginYml: ""
};

// Configuration du générateur Java
javaGenerator.ORDER_ATOMIC = 0;
javaGenerator.ORDER_NONE = 99;

javaGenerator.scrub_ = function(block, code, opt_thisOnly) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = opt_thisOnly ? '' : javaGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

/* =========================================
   INITIALISATION
   ========================================= */
document.addEventListener("DOMContentLoaded", function () {
    // Définir le thème
    const darkTheme = Blockly.Theme.defineTheme('darkCustom', DARK_THEME);

    // Définir la toolbox
    const toolboxXML = `
    <xml>
      <category name="Logique & Si" colour="${COLORS.LOGIC}">
        <block type="controls_if"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>

      <category name="Conditions MC" colour="${COLORS.CONDITIONS}">
        <block type="player_has_permission"></block>
        <block type="player_is_op"></block>
        <block type="math_chance"></block>
      </category>

      <sep></sep>

      <category name="Events: Joueur" colour="${COLORS.EVENT_PLAYER}">
        <category name="Connexion" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_join"></block>
          <block type="event_player_quit"></block>
        </category>
        <category name="Chat & Commandes" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_chat"></block>
          <block type="event_player_command"></block>
        </category>
        <category name="Interactions" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_interact"></block>
          <block type="event_player_interact_entity"></block>
        </category>
        <category name="Mouvement" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_move"></block>
          <block type="event_player_teleport"></block>
          <block type="event_player_sneak"></block>
          <block type="event_player_sprint"></block>
          <block type="event_player_portal"></block>
        </category>
        <category name="Mort & Respawn" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_death"></block>
          <block type="event_player_respawn"></block>
        </category>
        <category name="Items" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_drop_item"></block>
          <block type="event_player_pickup_item"></block>
          <block type="event_player_consume"></block>
        </category>
        <category name="Lit & Repos" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_bed_enter"></block>
          <block type="event_player_bed_leave"></block>
        </category>
        <category name="Progression" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_exp_change"></block>
          <block type="event_player_level_change"></block>
          <block type="event_player_gamemode_change"></block>
        </category>
        <category name="Activités" colour="${COLORS.EVENT_PLAYER}">
          <block type="event_player_fish"></block>
        </category>
      </category>

      <category name="Events: Bloc" colour="${COLORS.EVENT_BLOCK}">
        <category name="Construction" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_block_break"></block>
          <block type="event_block_place"></block>
        </category>
        <category name="Destruction" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_block_burn"></block>
          <block type="event_block_explode"></block>
        </category>
        <category name="Croissance" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_block_grow"></block>
          <block type="event_block_spread"></block>
        </category>
        <category name="Feu" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_block_ignite"></block>
        </category>
        <category name="Panneaux" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_sign_change"></block>
        </category>
      </category>

      <category name="Events: Entité" colour="${COLORS.EVENT_BLOCK}">
        <category name="Combat" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_entity_damage"></block>
          <block type="event_entity_damage_by_entity"></block>
          <block type="event_entity_death"></block>
          <block type="event_entity_target"></block>
        </category>
        <category name="Spawn" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_entity_spawn"></block>
        </category>
        <category name="Explosions" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_entity_explode"></block>
        </category>
        <category name="Projectiles" colour="${COLORS.EVENT_BLOCK}">
          <block type="event_projectile_hit"></block>
          <block type="event_projectile_launch"></block>
        </category>
      </category>

      <category name="Events: Inventaire" colour="#8e44ad">
        <block type="event_inventory_click"></block>
        <block type="event_inventory_open"></block>
        <block type="event_inventory_close"></block>
        <block type="event_inventory_drag"></block>
        <block type="event_craft_item"></block>
      </category>

      <category name="Events: GUI" colour="#8e44ad">
        <block type="event_gui_click"></block>
      </category>

      <category name="Events: Véhicule" colour="#16a085">
        <block type="event_vehicle_enter"></block>
        <block type="event_vehicle_exit"></block>
        <block type="event_vehicle_damage"></block>
        <block type="event_vehicle_destroy"></block>
      </category>

      <category name="Events: Monde" colour="#27ae60">
        <block type="event_weather_change"></block>
        <block type="event_thunder_change"></block>
        <block type="event_chunk_load"></block>
        <block type="event_chunk_unload"></block>
      </category>

      <sep></sep>

      <category name="Actions Joueur" colour="${COLORS.ACTIONS}">
        <category name="Communication" colour="${COLORS.ACTIONS}">
          <block type="player_send_message"></block>
          <block type="player_send_title"></block>
          <block type="player_send_actionbar"></block>
        </category>
        <category name="Statistiques" colour="${COLORS.ACTIONS}">
          <block type="player_set_health"></block>
          <block type="player_set_food"></block>
          <block type="player_set_saturation"></block>
          <block type="player_heal"></block>
          <block type="player_kill"></block>
        </category>
        <category name="Mode & Admin" colour="${COLORS.ACTIONS}">
          <block type="player_set_gamemode"></block>
          <block type="player_kick"></block>
          <block type="player_ban"></block>
          <block type="player_set_op"></block>
        </category>
        <category name="Expérience" colour="${COLORS.ACTIONS}">
          <block type="player_give_exp"></block>
          <block type="player_set_level"></block>
        </category>
        <category name="Effets de Potion" colour="${COLORS.ACTIONS}">
          <block type="player_add_potion_effect"></block>
          <block type="player_clear_effects"></block>
        </category>
        <category name="Téléportation" colour="${COLORS.ACTIONS}">
          <block type="player_teleport_spawn"></block>
          <block type="player_teleport_bed"></block>
        </category>
        <category name="Mouvement" colour="${COLORS.ACTIONS}">
          <block type="player_set_fly"></block>
          <block type="player_set_walk_speed"></block>
          <block type="player_set_fly_speed"></block>
        </category>
        <category name="Dégâts & Effets" colour="${COLORS.ACTIONS}">
          <block type="player_set_fire"></block>
          <block type="player_strike_lightning"></block>
        </category>
        <category name="Son" colour="${COLORS.ACTIONS}">
          <block type="player_play_sound"></block>
        </category>
      </category>

      <category name="Inventaire" colour="${COLORS.INVENTORY}">
        <category name="Donner Items" colour="${COLORS.INVENTORY}">
          <block type="inventory_give_item"></block>
          <block type="inventory_give_item_custom"></block>
        </category>
        <category name="Retirer Items" colour="${COLORS.INVENTORY}">
          <block type="inventory_clear"></block>
          <block type="inventory_remove_item"></block>
        </category>
        <category name="Armure" colour="${COLORS.INVENTORY}">
          <block type="inventory_set_helmet"></block>
          <block type="inventory_set_chestplate"></block>
          <block type="inventory_set_leggings"></block>
          <block type="inventory_set_boots"></block>
        </category>
        <category name="Items en Main" colour="${COLORS.INVENTORY}">
          <block type="inventory_set_item_in_hand"></block>
          <block type="inventory_set_item_in_offhand"></block>
        </category>
      </category>

      <category name="Actions Monde" colour="#27ae60">
        <category name="Météo & Temps" colour="#27ae60">
          <block type="world_set_time"></block>
          <block type="world_set_weather"></block>
          <block type="world_set_thunder"></block>
        </category>
        <category name="Explosions & Effets" colour="#27ae60">
          <block type="world_create_explosion"></block>
          <block type="world_strike_lightning"></block>
        </category>
        <category name="Entités" colour="#27ae60">
          <block type="world_spawn_entity"></block>
        </category>
        <category name="Blocs" colour="#27ae60">
          <block type="world_set_block"></block>
        </category>
        <category name="Son & Effets" colour="#27ae60">
          <block type="world_play_sound"></block>
          <block type="world_play_effect"></block>
        </category>
        <category name="Règles de Jeu" colour="#27ae60">
          <block type="world_set_gamerule"></block>
        </category>
      </category>

      <sep></sep>

      <category name="GUI Personnalisées" colour="#9b59b6">
        <category name="Créer GUI" colour="#9b59b6">
          <block type="gui_create_and_open"></block>
          <block type="gui_close"></block>
        </category>
        <category name="Boutons Simples" colour="#9b59b6">
          <block type="gui_add_button"></block>
        </category>
        <category name="Boutons Cliquables" colour="#9b59b6">
          <block type="gui_add_button_with_action"></block>
        </category>
        <category name="Boutons Prédéfinis" colour="#9b59b6">
          <block type="gui_add_close_button"></block>
          <block type="gui_add_confirm_button"></block>
          <block type="gui_add_cancel_button"></block>
        </category>
        <category name="Décoration" colour="#9b59b6">
          <block type="gui_fill_decoration"></block>
        </category>
      </category>

      <sep></sep>

      <category name="Commandes" colour="#e67e22">
        <category name="Définition" colour="#e67e22">
          <block type="command_define"></block>
        </category>
        <category name="Sender" colour="#e67e22">
          <block type="command_sender_is_player"></block>
          <block type="command_get_sender_name"></block>
          <block type="command_has_permission"></block>
        </category>
        <category name="Arguments" colour="#e67e22">
          <block type="command_get_arg"></block>
          <block type="command_get_args_length"></block>
          <block type="command_check_args"></block>
          <block type="command_arg_is_number"></block>
          <block type="command_arg_to_number"></block>
          <block type="command_arg_to_double"></block>
          <block type="command_join_args"></block>
        </category>
        <category name="Réponses" colour="#e67e22">
          <block type="command_send_message"></block>
          <block type="command_send_error"></block>
          <block type="command_send_success"></block>
        </category>
        <category name="Retours" colour="#e67e22">
          <block type="command_return_success"></block>
          <block type="command_return_failure"></block>
        </category>
        <category name="Joueurs" colour="#e67e22">
          <block type="command_get_online_player"></block>
          <block type="command_target_player"></block>
        </category>
        <category name="Exécution" colour="#e67e22">
          <block type="command_execute_console"></block>
          <block type="command_execute_as_player"></block>
        </category>
      </category>

      <sep></sep>

      <category name="Général" colour="${COLORS.CANCEL}">
        <block type="event_cancel"></block>
      </category>

      <category name="Données" colour="${COLORS.DATA}">
        <block type="text"></block>
        <block type="math_number"></block>
      </category>
    </xml>
    `;

    // Initialiser Blockly
    try {
        workspace = Blockly.inject('blocklyDiv', {
            theme: darkTheme,
            toolbox: toolboxXML,
            scrollbars: true,
            trashcan: true,
            grid: GRID_CONFIG
        });
    } catch (e) {
        console.error('Erreur lors de l\'initialisation de Blockly:', e);
    }

    // Initialiser le redimensionnement
    initializeWorkspaceResize(workspace);

    // Définir tous les blocs
    defineAllBlocks();
});

/* =========================================
   DÉFINITION DES BLOCS
   ========================================= */
function defineAllBlocks() {
    defineLogicBlocks(javaGenerator);
    defineMinecraftConditionBlocks(javaGenerator);
    defineEventBlocks(javaGenerator);
    defineActionBlocks(javaGenerator);
    defineInventoryBlocks(javaGenerator);
    defineWorldBlocks(javaGenerator);
    defineGUIBlocks(javaGenerator);
    defineCommandBlocks(javaGenerator);
    defineDataBlocks(javaGenerator);
}

/* =========================================
   FONCTIONS DE GÉNÉRATION
   ========================================= */

/**
 * Génère le code Java à partir du workspace
 */
window.manualGenerate = function() {
    if (!workspace) return;

    const pluginName = document.getElementById('pluginName').value || "MonPlugin";
    const selectedVersion = document.getElementById('versionSelect').value;
    const versionInfo = VERSION_DATA[selectedVersion];

    // Générer le code utilisateur
    const userCode = javaGenerator.workspaceToCode(workspace);

    // Générer toutes les classes listener (une par événement)
    cachedCode.listenerClasses = generateAllListenerClasses(userCode);

    // Générer toutes les classes de commandes
    cachedCode.commandClasses = generateAllCommandClasses(userCode);
    cachedCode.commandsList = getCommandsList(userCode);

    // Générer GUIManager
    cachedCode.guiManager = generateGUIManagerClass();

    // Générer Main.java avec tous les listeners et commandes
    cachedCode.main = generateMainClass(pluginName, cachedCode.listenerClasses, cachedCode.commandClasses);

    // Générer pom.xml et plugin.yml
    cachedCode.pom = generatePomXml(pluginName, versionInfo.java, versionInfo.api);
    cachedCode.pluginYml = generatePluginYml(pluginName, cachedCode.commandsList);

    updateCurrentTabDisplay();
};

/**
 * Télécharge le code source en ZIP
 */
window.downloadSourceCode = function() {
    window.manualGenerate();

    const pluginName = document.getElementById('pluginName').value || "MonPlugin";
    const zip = new JSZip();

    // Structure du projet Maven
    const packageFolder = zip.folder("src/main/java/com/mineblockly/plugin");
    packageFolder.file("Main.java", cachedCode.main);
    packageFolder.file("GUIManager.java", cachedCode.guiManager);

    // Créer toutes les classes listener dans le package events
    if (Object.keys(cachedCode.listenerClasses).length > 0) {
        const eventsFolder = zip.folder("src/main/java/com/mineblockly/plugin/events");
        for (const [className, code] of Object.entries(cachedCode.listenerClasses)) {
            eventsFolder.file(`${className}.java`, code);
        }
    }

    // Créer toutes les classes de commandes dans le package commands
    if (Object.keys(cachedCode.commandClasses).length > 0) {
        const commandsFolder = zip.folder("src/main/java/com/mineblockly/plugin/commands");
        for (const [className, code] of Object.entries(cachedCode.commandClasses)) {
            commandsFolder.file(`${className}.java`, code);
        }
    }

    zip.folder("src/main/resources").file("plugin.yml", cachedCode.pluginYml);
    zip.file("pom.xml", cachedCode.pom);

    zip.generateAsync({ type: "blob" }).then(function(content) {
        saveAs(content, pluginName + "_Sources.zip");
    });
};

/**
 * Sauvegarde le projet dans un fichier .mine
 */
window.saveProjectFile = function() {
    if (!workspace) return;

    const state = Blockly.serialization.workspaces.save(workspace);
    const jsonString = JSON.stringify(state);
    const pluginName = document.getElementById('pluginName').value || "Projet";
    const blob = new Blob([jsonString], { type: "application/json" });

    saveAs(blob, pluginName + ".mine");
};

/**
 * Charge un projet depuis un fichier .mine
 */
window.loadProjectFile = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            workspace.clear();
            Blockly.serialization.workspaces.load(json, workspace);
        } catch (err) {
            alert("Erreur lors du chargement du fichier");
            console.error(err);
        }
    };
    reader.readAsText(file);
    input.value = "";
};

/**
 * Change l'onglet actif
 */
window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    if (tabName === 'gui') {
        tabs[0].classList.add('active');
    } else if (tabName === 'listeners') {
        tabs[1].classList.add('active');
    } else if (tabName === 'commands') {
        tabs[2].classList.add('active');
    } else if (tabName === 'main') {
        tabs[3].classList.add('active');
    } else if (tabName === 'pom') {
        tabs[4].classList.add('active');
    } else if (tabName === 'pluginyml') {
        tabs[5].classList.add('active');
    }

    updateCurrentTabDisplay();
};

/**
 * Met à jour l'affichage du code selon l'onglet actif
 */
function updateCurrentTabDisplay() {
    const activeTab = document.querySelector('.tab.active');
    const preview = document.getElementById('codePreview');

    if (!activeTab || !preview) return;

    const tabText = activeTab.textContent;

    if (tabText.includes('GUIManager')) {
        preview.textContent = cachedCode.guiManager || '// GUIManager.java\n// Pas encore généré';
    } else if (tabText.includes('Listeners')) {
        // Afficher tous les listeners
        const allListeners = Object.entries(cachedCode.listenerClasses)
            .map(([name, code]) => `// ========== ${name}.java ==========\n\n${code}`)
            .join('\n\n\n');
        preview.textContent = allListeners || '// Listeners\n// Pas encore généré';
    } else if (tabText.includes('Commands')) {
        // Afficher toutes les commandes
        const allCommands = Object.entries(cachedCode.commandClasses)
            .map(([name, code]) => `// ========== ${name}.java ==========\n\n${code}`)
            .join('\n\n\n');
        preview.textContent = allCommands || '// Commands\n// Pas encore généré';
    } else if (tabText.includes('Main')) {
        preview.textContent = cachedCode.main || '// Main.java\n// Pas encore généré';
    } else if (tabText.includes('pom.xml')) {
        preview.textContent = cachedCode.pom || '// pom.xml\n// Pas encore généré';
    } else if (tabText.includes('plugin.yml')) {
        preview.textContent = cachedCode.pluginYml || '# plugin.yml\n# Pas encore généré';
    }
}
