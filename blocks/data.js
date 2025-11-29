/* =========================================
   BLOCS DE DONNÉES
   ========================================= */

/**
 * Définit tous les blocs de données (texte, nombres)
 * @param {Object} generator - Générateur Java
 */
function defineDataBlocks(generator) {
    // Texte
    generator.forBlock['text'] = function(block) {
        const text = block.getFieldValue('TEXT');
        return [`"${text}"`, generator.ORDER_ATOMIC];
    };

    // Nombre
    generator.forBlock['math_number'] = function(block) {
        const number = block.getFieldValue('NUM');
        return [number, generator.ORDER_ATOMIC];
    };
}
