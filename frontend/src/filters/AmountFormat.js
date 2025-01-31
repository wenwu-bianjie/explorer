import Tools from "../util/Tools";
import moveDecimal  from "move-decimal-point";
import BigNumber from 'bignumber.js';


function prototypeToString (value) {
    return Object.prototype.toString.call(value);
}

function afterPointLength(value) {

	let afterPointLengthReg = /(\.[0-9]*[1-9])([0]*)$/g;
	let arr = afterPointLengthReg.exec(String(value));
    if (arr && arr[1]) {
        return arr[1].length - 1;
    }
}

function amountFromatFunc (value, denomArg, fixedValue, ratio) {
    /*
        value 需要转换的数值
        denomArg 自定义单位
        fixedValue 自定义小数点后四舍五入保留位数
        ratio 自定义比率 （10**ratio）次方
    */
    let amount = '';
    if (value) {
        if (prototypeToString(value) === "[object Array]") {
            if (value.length > 0) {
                amount = value
                    .map(
                        it => amountFromatFunc(it, denomArg, fixedValue, ratio)
                    ).filter(it => !!it).join(",");
            }
        } else if (prototypeToString(value) ===  "[object Object]") {
            if (value.amount) {
                value.amount = new BigNumber(value.amount).toFixed();
                if (ratio) {//比率转换
                    value.amount = moveDecimal(String(value.amount) + ".",-ratio);
                }
                let afterPointLen = afterPointLength(value.amount);
                if (!value.denom) {
                    amount = `${Tools.formatPriceToFixed(
                        value.amount, fixedValue || afterPointLen
                    )}${fixedValue && fixedValue < afterPointLen ? '...' : ''} ${denomArg || 'SHARES'}`;
                } else {
                    if (`${value.denom}`.toLowerCase() === "iris-atto") {
                        value.amount = Tools.numberMoveDecimal(value.amount);
                        afterPointLen = afterPointLength(value.amount);
                        amount = `${Tools.formatPriceToFixed(
                            value.amount, fixedValue || afterPointLen
                        )}${fixedValue && fixedValue < afterPointLen ? '...' : ''} ${denomArg || Tools.formatDenom(value.denom).toUpperCase() || ''}`;
                    } else {
                        amount = `${Tools.formatPriceToFixed(
                            value.amount, fixedValue || afterPointLen
                        )}${fixedValue && fixedValue < afterPointLen ? '...' : ''} ${denomArg || Tools.formatDenom(value.denom).toUpperCase() || ''}`;
                    }
                }
            }
        } else if (prototypeToString(value) === "[object Number]" ||  prototypeToString(value) === "[object String]") {
            if (value) {
                value = new BigNumber(value).toFixed();
                if (ratio) {//比率转换
                    value = moveDecimal(String(value) + ".",-ratio);
                }
                let afterPointLen = afterPointLength(value);
                amount = `${Tools.formatPriceToFixed(value, fixedValue || afterPointLen)}${fixedValue && fixedValue < afterPointLen ? '...' : ''} ${denomArg || ''}`;
            }
        }
    }
    return amount.trim();
}

export default {
    name: 'amountFromat',
    filter: amountFromatFunc
}
