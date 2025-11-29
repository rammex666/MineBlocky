/* =========================================
   BLOCS DE CONDITIONS MINECRAFT
   ========================================= */

/**
 * Définit tous les blocs de conditions spécifiques à Minecraft
 * @param {Object} generator - Générateur Java
 */
function defineMinecraftConditionBlocks(generator) {
    // Permission
    Blockly.Blocks['player_has_permission'] = {
        init: function() {
            this.appendValueInput("PERM")
                .setCheck("String")
                .appendField("Joueur a la permission");
            this.setOutput(true, "Boolean");
            this.setColour(COLORS.CONDITIONS);
        }
    };
    generator.forBlock['player_has_permission'] = function(block) {
        const perm = generator.valueToCode(block, 'PERM', generator.ORDER_ATOMIC) || '"admin"';
        return [`player.hasPermission(${perm})`, generator.ORDER_ATOMIC];
    };

    // IS OP
    Blockly.Blocks['player_is_op'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Joueur est OP (Admin)");
            this.setOutput(true, "Boolean");
            this.setColour(COLORS.CONDITIONS);
        }
    };
    generator.forBlock['player_is_op'] = function(block) {
        return ['player.isOp()', generator.ORDER_ATOMIC];
    };

    // CHANCE (Math Random)
    Blockly.Blocks['math_chance'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("Chance de")
                .appendField(new Blockly.FieldNumber(50, 0, 100), "PERCENT")
                .appendField("%");
            this.setOutput(true, "Boolean");
            this.setColour(COLORS.CONDITIONS);
        }
    };
    generator.forBlock['math_chance'] = function(block) {
        const percent = block.getFieldValue('PERCENT');
        return [`(Math.random() * 100) < ${percent}`, generator.ORDER_ATOMIC];
    };
}
