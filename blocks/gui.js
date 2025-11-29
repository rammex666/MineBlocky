/* =========================================
   BLOCS DE GUI PERSONNALISÉES
   ========================================= */

/**
 * Définit tous les blocs pour créer des GUI personnalisées
 * @param {Object} generator - Générateur Java
 */
function defineGUIBlocks(generator) {

    /* ========================================
       CRÉATION DE GUI
       ======================================== */

    // Créer et ouvrir une GUI
    Blockly.Blocks['gui_create_and_open'] = {
        init: function() {
            this.appendValueInput("TITLE")
                .setCheck("String")
                .appendField("Ouvrir GUI avec titre");
            this.appendDummyInput()
                .appendField("taille")
                .appendField(new Blockly.FieldDropdown([
                    ["9 (1 ligne)", "9"],
                    ["18 (2 lignes)", "18"],
                    ["27 (3 lignes)", "27"],
                    ["36 (4 lignes)", "36"],
                    ["45 (5 lignes)", "45"],
                    ["54 (6 lignes)", "54"]
                ]), "SIZE");
            this.appendStatementInput("BUTTONS")
                .appendField("boutons :");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_create_and_open'] = function(block) {
        const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '"Menu"';
        const size = block.getFieldValue('SIZE');
        const buttons = generator.statementToCode(block, 'BUTTONS');

        return `    org.bukkit.inventory.Inventory gui = org.bukkit.Bukkit.createInventory(null, ${size}, ${title});\n${buttons}    player.openInventory(gui);\n`;
    };

    /* ========================================
       BOUTONS DE GUI
       ======================================== */

    // Ajouter un bouton simple
    Blockly.Blocks['gui_add_button'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Ajouter bouton")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND"],
                    ["ÉMERAUDE", "EMERALD"],
                    ["OR", "GOLD_INGOT"],
                    ["REDSTONE", "REDSTONE"],
                    ["LAPIS", "LAPIS_LAZULI"],
                    ["CHARBON", "COAL"],
                    ["ÉPÉE", "DIAMOND_SWORD"],
                    ["PIOCHE", "DIAMOND_PICKAXE"],
                    ["POMME", "APPLE"],
                    ["LIVRE", "BOOK"],
                    ["PANCARTE", "OAK_SIGN"],
                    ["CLOCHE", "BELL"],
                    ["BARRIÈRE", "BARRIER"],
                    ["PORTE", "OAK_DOOR"],
                    ["COFFRE", "CHEST"],
                    ["TNT", "TNT"],
                    ["ÉTOILE", "NETHER_STAR"],
                    ["TÊTE", "PLAYER_HEAD"],
                    ["LAINE VERTE", "GREEN_WOOL"],
                    ["LAINE ROUGE", "RED_WOOL"],
                    ["VITRE", "GLASS_PANE"]
                ]), "ITEM");
            this.appendDummyInput()
                .appendField("slot")
                .appendField(new Blockly.FieldNumber(0, 0, 53), "SLOT");
            this.appendValueInput("NAME")
                .setCheck("String")
                .appendField("nom");
            this.appendValueInput("LORE")
                .setCheck("String")
                .appendField("description");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_add_button'] = function(block) {
        const item = block.getFieldValue('ITEM');
        const slot = block.getFieldValue('SLOT');
        const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Bouton"';
        const lore = generator.valueToCode(block, 'LORE', generator.ORDER_ATOMIC) || '""';

        return `    ItemStack btn${slot} = new ItemStack(Material.${item});\n    org.bukkit.inventory.meta.ItemMeta meta${slot} = btn${slot}.getItemMeta();\n    meta${slot}.setDisplayName(${name});\n    if (!${lore}.isEmpty()) {\n        meta${slot}.setLore(java.util.Arrays.asList(${lore}));\n    }\n    btn${slot}.setItemMeta(meta${slot});\n    gui.setItem(${slot}, btn${slot});\n`;
    };

    // Ajouter un bouton avec action
    Blockly.Blocks['gui_add_button_with_action'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Bouton cliquable")
                .appendField(new Blockly.FieldDropdown([
                    ["DIAMANT", "DIAMOND"],
                    ["ÉMERAUDE", "EMERALD"],
                    ["OR", "GOLD_INGOT"],
                    ["ÉPÉE", "DIAMOND_SWORD"],
                    ["LIVRE", "BOOK"],
                    ["BARRIÈRE", "BARRIER"],
                    ["ÉTOILE", "NETHER_STAR"],
                    ["LAINE VERTE", "GREEN_WOOL"],
                    ["LAINE ROUGE", "RED_WOOL"]
                ]), "ITEM");
            this.appendDummyInput()
                .appendField("slot")
                .appendField(new Blockly.FieldNumber(0, 0, 53), "SLOT");
            this.appendValueInput("NAME")
                .setCheck("String")
                .appendField("nom");
            this.appendStatementInput("ACTION")
                .appendField("quand cliqué :");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
            this.setTooltip("Bouton qui exécute une action au clic");
        }
    };
    generator.forBlock['gui_add_button_with_action'] = function(block) {
        const item = block.getFieldValue('ITEM');
        const slot = block.getFieldValue('SLOT');
        const name = generator.valueToCode(block, 'NAME', generator.ORDER_ATOMIC) || '"Bouton"';
        const action = generator.statementToCode(block, 'ACTION');

        // Créer un identifiant unique pour ce bouton
        const buttonId = `button_${slot}_${Math.random().toString(36).substr(2, 9)}`;

        return `    ItemStack btn${slot} = new ItemStack(Material.${item});\n    org.bukkit.inventory.meta.ItemMeta meta${slot} = btn${slot}.getItemMeta();\n    meta${slot}.setDisplayName(${name});\n    // Ajouter un tag invisible pour identifier le bouton\n    java.util.List<String> lore${slot} = new java.util.ArrayList<>();\n    lore${slot}.add("§r§8[${buttonId}]");\n    meta${slot}.setLore(lore${slot});\n    btn${slot}.setItemMeta(meta${slot});\n    gui.setItem(${slot}, btn${slot});\n    \n    // Enregistrer l'action du bouton via GUIManager\n    GUIManager.registerButtonAction("${buttonId}", (clicker, clickedItem) -> {\n${action}    });\n`;
    };

    /* ========================================
       ÉVÉNEMENT CLIC SUR GUI
       ======================================== */

    // Événement quand on clique dans une GUI
    Blockly.Blocks['event_gui_click'] = {
        init: function() {
            this.appendValueInput("TITLE")
                .setCheck("String")
                .appendField("Quand clic dans GUI");
            this.appendStatementInput("ACTIONS")
                .appendField("actions :");
            this.setColour("#8e44ad");
            this.setTooltip("Détecte tous les clics dans une GUI spécifique");
        }
    };
    generator.forBlock['event_gui_click'] = function(block) {
        const title = generator.valueToCode(block, 'TITLE', generator.ORDER_ATOMIC) || '"Menu"';
        const actions = generator.statementToCode(block, 'ACTIONS');

        return `@EventHandler
public void onGUIClick(org.bukkit.event.inventory.InventoryClickEvent event) {
    if (event.getView().getTitle().equals(${title})) {
        event.setCancelled(true); // Empêche de prendre l'item
        Player player = (Player) event.getWhoClicked();
        ItemStack clickedItem = event.getCurrentItem();

        if (clickedItem != null && clickedItem.hasItemMeta()) {
            // Vérifier si c'est un bouton avec action
            org.bukkit.inventory.meta.ItemMeta meta = clickedItem.getItemMeta();
            if (meta.hasLore()) {
                for (String loreLine : meta.getLore()) {
                    if (loreLine.contains("[button_")) {
                        String buttonId = loreLine.replaceAll("§.", "").replaceAll("[\\[\\]]", "");
                        GUIManager.executeButtonAction(buttonId, player, clickedItem);
                    }
                }
            }
        }
${actions}    }
}
`;
    };

    /* ========================================
       ACTIONS DANS LES GUI
       ======================================== */

    // Fermer la GUI
    Blockly.Blocks['gui_close'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Fermer la GUI");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_close'] = function(block) {
        return `    player.closeInventory();\n`;
    };

    /* ========================================
       BOUTONS PRÉDÉFINIS
       ======================================== */

    // Bouton de fermeture
    Blockly.Blocks['gui_add_close_button'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Ajouter bouton FERMER")
                .appendField("slot")
                .appendField(new Blockly.FieldNumber(0, 0, 53), "SLOT");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_add_close_button'] = function(block) {
        const slot = block.getFieldValue('SLOT');
        const buttonId = `close_button_${slot}`;

        return `    ItemStack closeBtn = new ItemStack(Material.BARRIER);\n    org.bukkit.inventory.meta.ItemMeta closeMeta = closeBtn.getItemMeta();\n    closeMeta.setDisplayName("§c✖ Fermer");\n    java.util.List<String> closeLore = new java.util.ArrayList<>();\n    closeLore.add("§r§8[${buttonId}]");\n    closeMeta.setLore(closeLore);\n    closeBtn.setItemMeta(closeMeta);\n    gui.setItem(${slot}, closeBtn);\n    \n    GUIManager.registerButtonAction("${buttonId}", (clicker, clickedItem) -> {\n        clicker.closeInventory();\n    });\n`;
    };

    // Bouton de confirmation
    Blockly.Blocks['gui_add_confirm_button'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Bouton CONFIRMER")
                .appendField("slot")
                .appendField(new Blockly.FieldNumber(0, 0, 53), "SLOT");
            this.appendStatementInput("ACTION")
                .appendField("action :");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_add_confirm_button'] = function(block) {
        const slot = block.getFieldValue('SLOT');
        const action = generator.statementToCode(block, 'ACTION');
        const buttonId = `confirm_button_${slot}_${Math.random().toString(36).substr(2, 9)}`;

        return `    ItemStack confirmBtn = new ItemStack(Material.GREEN_WOOL);\n    org.bukkit.inventory.meta.ItemMeta confirmMeta = confirmBtn.getItemMeta();\n    confirmMeta.setDisplayName("§a✔ Confirmer");\n    java.util.List<String> confirmLore = new java.util.ArrayList<>();\n    confirmLore.add("§r§8[${buttonId}]");\n    confirmMeta.setLore(confirmLore);\n    confirmBtn.setItemMeta(confirmMeta);\n    gui.setItem(${slot}, confirmBtn);\n    \n    GUIManager.registerButtonAction("${buttonId}", (clicker, clickedItem) -> {\n${action}        clicker.closeInventory();\n    });\n`;
    };

    // Bouton d'annulation
    Blockly.Blocks['gui_add_cancel_button'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Bouton ANNULER")
                .appendField("slot")
                .appendField(new Blockly.FieldNumber(0, 0, 53), "SLOT");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_add_cancel_button'] = function(block) {
        const slot = block.getFieldValue('SLOT');
        const buttonId = `cancel_button_${slot}`;

        return `    ItemStack cancelBtn = new ItemStack(Material.RED_WOOL);\n    org.bukkit.inventory.meta.ItemMeta cancelMeta = cancelBtn.getItemMeta();\n    cancelMeta.setDisplayName("§c✖ Annuler");\n    java.util.List<String> cancelLore = new java.util.ArrayList<>();\n    cancelLore.add("§r§8[${buttonId}]");\n    cancelMeta.setLore(cancelLore);\n    cancelBtn.setItemMeta(cancelMeta);\n    gui.setItem(${slot}, cancelBtn);\n    \n    GUIManager.registerButtonAction("${buttonId}", (clicker, clickedItem) -> {\n        clicker.closeInventory();\n    });\n`;
    };

    /* ========================================
       DÉCORATION DE GUI
       ======================================== */

    // Remplir avec un item de décoration
    Blockly.Blocks['gui_fill_decoration'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Remplir vides avec")
                .appendField(new Blockly.FieldDropdown([
                    ["VITRE NOIRE", "BLACK_STAINED_GLASS_PANE"],
                    ["VITRE GRISE", "GRAY_STAINED_GLASS_PANE"],
                    ["VITRE BLANCHE", "WHITE_STAINED_GLASS_PANE"],
                    ["VITRE", "GLASS_PANE"],
                    ["RIEN", "AIR"]
                ]), "ITEM");
            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setColour("#9b59b6");
        }
    };
    generator.forBlock['gui_fill_decoration'] = function(block) {
        const item = block.getFieldValue('ITEM');
        if (item === "AIR") return '';

        return `    ItemStack deco = new ItemStack(Material.${item});\n    org.bukkit.inventory.meta.ItemMeta decoMeta = deco.getItemMeta();\n    decoMeta.setDisplayName(" ");\n    deco.setItemMeta(decoMeta);\n    for (int i = 0; i < gui.getSize(); i++) {\n        if (gui.getItem(i) == null) {\n            gui.setItem(i, deco);\n        }\n    }\n`;
    };
}
