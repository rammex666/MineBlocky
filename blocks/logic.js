/* =========================================
   BLOCS DE LOGIQUE STANDARD
   ========================================= */

/**
 * Définit tous les blocs de logique standard (IF, comparaisons, opérations booléennes)
 * @param {Object} generator - Générateur Java
 */
function defineLogicBlocks(generator) {
    // IF / ELSE IF / ELSE
    generator.forBlock['controls_if'] = function(block) {
        let code = '';

        // Condition IF principale
        const ifCondition = generator.valueToCode(block, 'IF0', generator.ORDER_NONE) || 'false';
        const ifBranch = generator.statementToCode(block, 'DO0');
        code += `if (${ifCondition}) {\n${ifBranch}}`;

        // Conditions ELSE IF
        for (let n = 1; n <= block.elseifCount_; n++) {
            const elseIfCondition = generator.valueToCode(block, 'IF' + n, generator.ORDER_NONE) || 'false';
            const elseIfBranch = generator.statementToCode(block, 'DO' + n);
            code += ` else if (${elseIfCondition}) {\n${elseIfBranch}}`;
        }

        // Bloc ELSE
        if (block.elseCount_) {
            const elseBranch = generator.statementToCode(block, 'ELSE');
            code += ` else {\n${elseBranch}}`;
        }

        return code + '\n';
    };

    // COMPARAISON (==, !=, <, >)
    generator.forBlock['logic_compare'] = function(block) {
        const operator = COMPARISON_OPERATORS[block.getFieldValue('OP')];
        const argA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC) || '0';
        const argB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC) || '0';

        // En Java, les String utilisent .equals()
        if (isStringValue(argA) || isStringValue(argB)) {
            if (operator === '==') {
                return [`${argA}.equals(${argB})`, generator.ORDER_ATOMIC];
            }
            if (operator === '!=') {
                return [`!${argA}.equals(${argB})`, generator.ORDER_ATOMIC];
            }
        }

        const code = `${argA} ${operator} ${argB}`;
        return [code, generator.ORDER_ATOMIC];
    };

    // OPÉRATIONS LOGIQUES (ET / OU)
    generator.forBlock['logic_operation'] = function(block) {
        const operator = (block.getFieldValue('OP') === 'AND') ? '&&' : '||';
        const argA = generator.valueToCode(block, 'A', generator.ORDER_ATOMIC);
        const argB = generator.valueToCode(block, 'B', generator.ORDER_ATOMIC);
        const code = `${argA} ${operator} ${argB}`;
        return [code, generator.ORDER_ATOMIC];
    };

    // NÉGATION (NON)
    generator.forBlock['logic_negate'] = function(block) {
        const value = generator.valueToCode(block, 'BOOL', generator.ORDER_ATOMIC) || 'true';
        return [`!${value}`, generator.ORDER_ATOMIC];
    };

    // BOOLÉEN (VRAI/FAUX)
    generator.forBlock['logic_boolean'] = function(block) {
        const value = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
        return [value, generator.ORDER_ATOMIC];
    };
}
