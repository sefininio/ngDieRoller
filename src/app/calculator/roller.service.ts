import { Injectable } from '@angular/core';
import { RollerModel } from './roller.model';
import { isEmpty } from 'lodash';

@Injectable()
export class RollerService {

    private readonly operatorSet = '+-*/^+-d';
    public rollerModel: RollerModel;

    constructor() {
        this.rollerModel = new RollerModel();
    }

    public evaluate(str: string, argObj?: any) {
        if (argObj === null) {
            argObj = {};
        }
        str = str.replace(/\s+/g, '');

        // trim off the space if any
        if (str === '') {
            return 0;
        }

        // search for  +,-,*,/,*    , skip string in parenthesis and cut into two pieces accordingly
        // after this step ,  only function, parenthesis, variable or number are  left
        const str2 = this.maskParenthesis(str);
        let start;
        for (let k = 0; k < this.operatorSet.length; k++) {
            // be careful, we should check from right to left, not left to right
            const op = this.operatorSet.charAt(k);
            start = str.length - 1;
            let i = 0;

            while ((i = str2.lastIndexOf(op, start)) >= 0) {
                if ((k <= 1) && this.operatorSet.indexOf(str2.charAt(i - 1)) >= 0) {
                    // something like 3*-4;
                    start = i - 1;
                    // ################continue
                    continue;
                }

                const lStr = str.substr(0, i);
                const rStr = str.substr(i + 1, str.length - i - 1);
                return this.handleOperator(op, lStr, rStr, argObj);
            }
        }

        // now we get only the parenthesis, function and pure number/variable here; now check function
        // while (_loc_4 < operatorSet.length)
        start = str.indexOf('(');
        if (start >= 0) {
            const functionName = (str.substr(0, start)).toLowerCase();
            const contentInParenthesis = str.substr(start + 1, str.length - start - 2);
            return this.handleFunction(functionName, contentInParenthesis, argObj);
        }

        // After those steps , only variable and pure number are left here, now check variable
        if (isNaN(Number(str))) {
            if (Math[str] !== undefined) {
                return Math[str];

            } else if (argObj[str] !== undefined && typeof argObj[str] === 'number') {
                return argObj[str];
            }
        }

        // variable are screened off, here is pure value
        return Number(str);
    }

    public clear() {
      this.rollerModel = new RollerModel();
    }

    private handleOperator(operator, lStr, rStr, argObj) {
        let val;
        const num1 = this.evaluate(lStr, argObj);
        const num2 = this.evaluate(rStr, argObj);

        switch (operator) {
            case '+':
                val = num1 + num2;
                this.rollerModel.resRolls.push(num1 + ' + ' + num2 + ' = ' + val);
                break;

            case '-':
                val = num1 - num2;
                this.rollerModel.resRolls.push(num1 + ' - ' + num2 + ' = ' + val);
                break;

            case '*':
                val = num1 * num2;
                this.rollerModel.resRolls.push(num1 + ' * ' + num2 + ' = ' + val);
                break;

            case '/':
                val = num1 / num2;
                this.rollerModel.resRolls.push(num1 + ' / ' + num2 + ' = ' + val);
                break;

            case '^':
                val = Math.pow(num1, num2);
                this.rollerModel.resRolls.push(num1 + ' ^ ' + num2 + ' = ' + val);
                break;

            case 'd':
                val = this.rollDice(num1, num2);
                break;

            default:
                val = 0;
                break;

        }

        this.rollerModel.grandTotal = val;
        return val;
    }

    private maskParenthesis(str) {
        let parenthesisStack = 0;
        let temp = '';

        for (let i = 0; i < str.length; i++) {
            const char = str.substr(i, 1);
            if (char === '(' ) {
                parenthesisStack++;
            }

            if (char === ')' ) {
                parenthesisStack--;
            }

            temp += (parenthesisStack === 0 ? char : '(');
        }

        if (parenthesisStack !== 0 ) {
            throw new Error('The number of ( and ) does not match');
        }
        return temp;
    }

    private handleFunction(functionName, contentInParenthesis, argObj) {
        if (functionName.length <= 0) {
            // pure parenthesis
            return this.evaluate(contentInParenthesis, argObj);
        }

        // It is a function, now check how many parameters
        let str2 = this.maskParenthesis(contentInParenthesis);
        let str = contentInParenthesis;
        const params = [];

        if (str !== '' && str2 !== '') {
            let i = -1;
            while ((i = str2.indexOf(',')) >= 0) {
                const lStr = str.substr(0, i);
                str2 = str2.substr(i + 1, str2.length - i - 1);
                str = str.substr(i + 1, str.length - i - 1);
                params.push(this.evaluate(lStr, argObj));
            }

            params.push(this.evaluate(str, argObj));
        }

        let val;

        if (Math[functionName] !== undefined) {
            val = Math[functionName].apply(null, params);

        } else if (argObj[functionName] !== undefined) {
            val = argObj[functionName].apply(null, params);

        }

        return val;
    }

    private rollDice(numOfRolls, dieSides) {
        let roll;
        let totalRollsResult = 0;
        const rolls = [];

        dieSides = (dieSides === 0 ? 1 : dieSides);

        for (let i = 0; i < numOfRolls; i++) {
            roll = this.rollDie(dieSides);
            this.rollerModel.rolls.push('d' + dieSides + ' rolled ' + roll);
            /*        if (roll >= Consts.SUCCESS_THRESHOLD) {
             RollerModel.getInstance().successes++;
             } else if (roll <= Consts.FAILURE_THRESHOLD) {
             RollerModel.getInstance().failures++;
             }
             */
            rolls.push(roll);
            totalRollsResult += roll;
        }

        this.rollerModel.addRollSeries(dieSides, rolls);
        this.rollerModel.resRolls.push('Total d' + dieSides + ' rolled = ' + totalRollsResult);
        return totalRollsResult;
    }

    private rollDie(dieSides) {
        const rand = Math.random();
        const roll = Math.floor(rand * dieSides) + 1;

        return roll;
    }
}
