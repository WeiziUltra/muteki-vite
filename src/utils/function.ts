//引入全局常量
import $global from './global';
//md5
// @ts-ignore
import jsMd5 from 'js-md5';
//vant组件的常用方法
import {Toast} from 'vant';

/**
 * 判断是否为空
 * @param str
 * @returns {boolean}
 */
function isBlank(str: string | number) {
    if (null == str) {
        return true;
    }
    return '' === ('' + str).replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 判断不是手机号
 * @param phone
 * @returns {boolean}
 */
function notPhone(phone: string) {
    return !(/^1([3456789])\d{9}$/.test(phone));
}

/**
 * 不是车牌号码
 * @param carNumber
 * @returns {boolean}
 */
function notCarNumber(carNumber: string) {
    return !(/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/.test(carNumber));
}

/**
 * 生成uuid
 * @returns {string}
 */
function createUUID() {
    let s: any = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    // bits 12-15 of the time_hi_and_version field to 0010
    s[14] = "4";
    // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "";
    return s.join("").toUpperCase();
}

/**
 * 字符串反转
 * @param value
 */
function reverse(value: string) {
    return value.split('').reverse().join('');
}

/**
 * 格式化时间戳
 * @param timestamp
 * @param format
 * @returns {string}
 */
function timestampFormat(timestamp: number, format: string = 'yyyy-MM-dd') {
    if (null == timestamp || 0 > timestamp) {
        return '';
    }
    let date: Date = new Date(timestamp);
    let o: any = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + ""));
    }
    for (let k in o) {
        if (o.hasOwnProperty(k)) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
    }
    return format;
}

/**
 * 获取今天日期
 * @returns {string}
 */
function getNowDate() {
    let date: Date = new Date();
    let year: number | string = date.getFullYear();
    let month: number | string = date.getMonth() + 1;
    month = month > 9 ? month : '0' + month;
    let day: number | string = date.getDate();
    day = day > 9 ? day : '0' + day;
    return `${year}-${month}-${day}`;
}

/**
 * 获取session存储的数据
 * @param key
 * @returns {*}
 */
function getSessionStorage(key: string) {
    if (null == key) {
        return null;
    }
    key = `${$global.storagePrefix}-${key}`;
    // @ts-ignore
    return JSON.parse(sessionStorage.getItem(key));
}

/**
 * 将数据保存到session中
 * @param key
 * @param value
 */
function setSessionStorage(key: string, value: any = '') {
    if (null == key) {
        return;
    }
    key = `${$global.storagePrefix}-${key}`;
    sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * 将数据从session中删除
 * @param key
 */
function removeSessionStorage(key: string) {
    if (null == key) {
        return;
    }
    key = `${$global.storagePrefix}-${key}`;
    sessionStorage.removeItem(key);
}

/**
 * 获取location存储的数据
 * @param key
 * @returns {*}
 */
function getLocationStorage(key: string) {
    if (null == key) {
        return null;
    }
    key = `${$global.storagePrefix}-${key}`;
    // @ts-ignore
    return JSON.parse(localStorage.getItem(key));
}

/**
 * 将数据保存到location中
 * @param key
 * @param value
 */
function setLocationStorage(key: string, value: any = '') {
    if (null == key) {
        return;
    }
    key = `${$global.storagePrefix}-${key}`;
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 删除location存储的数据
 * @param key
 * @returns {*}
 */
function removeLocationStorage(key: string) {
    if (null == key) {
        return;
    }
    key = `${$global.storagePrefix}-${key}`;
    localStorage.removeItem(key);
}

/**
 * md5加密
 * @param str
 */
function md5(str: string) {
    return jsMd5(str);
}

/**
 * 校验身份证
 * @param value
 */
function isIdNumber(value) {
    let reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!reg.test(value)) {
        return false;
    }
    let weightingFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    let num = 0;
    for (let i = 0; i < value.length - 1; i++) {
        num += parseInt(value.substring(i, i + 1)) * weightingFactor[i];
    }
    let remainder = num % 11;
    let remainderArr = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
    let last = '' + value.substring(value.length - 1, value.length);
    return remainderArr[remainder] === last;
}

/**
 * 拨打电话
 */
function callPhone(phone = '') {
    window.location.href = `tel:${phone}`;
}

/**
 * 复制到剪切板
 * @param value
 */
function copyClipboard(value = '') {
    let input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', value);
    document.body.appendChild(input);
    input.focus();
    input.setSelectionRange(0, 99999);
    if (document.execCommand) {
        document.execCommand('copy');
        Toast({
            message: '内容已复制',
            position: 'bottom',
        });
    } else {
        Toast({
            message: '当前浏览器不支持复制功能',
            position: 'bottom',
        });
    }
    input.blur();
    document.body.removeChild(input);
}

/**
 * 将方法暴露出去
 */
export default {
    isBlank,
    notPhone,
    notCarNumber,
    createUUID,
    reverse,
    timestampFormat,
    getNowDate,
    getSessionStorage,
    setSessionStorage,
    removeSessionStorage,
    getLocationStorage,
    setLocationStorage,
    removeLocationStorage,
    md5,
    isIdNumber,
    callPhone,
    copyClipboard,
};