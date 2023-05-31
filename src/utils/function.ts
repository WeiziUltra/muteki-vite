//引入全局常量
import $global from './global';
//md5
import {hex_md5} from './md5.js';
//vant组件的常用方法
import {showToast, allowMultipleToast} from 'vant';

//允许同时存在多个toast
allowMultipleToast();

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
    return hex_md5(str);
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
        showToast(`复制成功`);
    } else {
        showToast(`复制失败`);
    }
    input.blur();
    document.body.removeChild(input);
}

/**
 * 图片压缩
 * @param file
 * @param fileType
 * @param fileName
 * @param quality
 * @param success
 * @param error
 */
function compressImg({
                         file = null,
                         fileType = null,
                         fileName = null,
                         quality = null,
                         success = function () {

                         },
                         error = function () {

                         }
                     } = {}) {
    try {
        if ('image/png' === file['type'] || file['name'].endsWith('.png')) {
            console.warn('png格式图片不建议压缩');
        }
        // @ts-ignore
        let fileSize: number = (file['size'] / 1024 / 1024).toFixed(2);
        if (null == quality) {
            //不指定压缩率，默认压缩率
            if (1 > fileSize) {
                try {
                    console.log('因图片小于1M，不进行压缩。');
                    console.log('  原图片：', file);
                    // @ts-ignore
                    success(file);
                } catch (e) {
                    console.error(e);
                }
                return;
            } else if (2 > fileSize && 1 <= fileSize) {
                quality = 0.8;
            } else if (3 > fileSize && 2 <= fileSize) {
                quality = 0.7;
            } else if (6 > fileSize && 3 <= fileSize) {
                quality = 0.5;
            } else {
                quality = 0.3;
            }
        }
        let read = new FileReader();
        read.readAsDataURL(file);
        let img = new Image();
        read.onload = function (e) {
            // @ts-ignore
            img.src = e['target']['result'];
            img.onload = function () {
                //默认按比例压缩
                // @ts-ignore
                let w = this.width,
                    // @ts-ignore
                    h = this.height;
                //生成canvas
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                // 创建属性节点
                canvas.setAttribute("width", w);
                canvas.setAttribute("height", h);
                // @ts-ignore
                ctx.drawImage(this, 0, 0, w, h);
                let base64 = canvas.toDataURL(fileType || file['type'], quality);
                let arr = base64.split(','),
                    bStr = atob(arr[1]),
                    n = bStr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bStr.charCodeAt(n);
                }
                let files = new File([u8arr], fileName || file['name']);
                console.log('图片压缩成功：');
                console.log('  压缩前：', file);
                console.log('  压缩后：', files);
                try {
                    // @ts-ignore
                    success(files);
                } catch (e) {
                    console.error(e);
                }
            };
        };
    } catch (e) {
        console.warn('图片压缩异常,file:', file, '异常详情：', e);
        try {
            // @ts-ignore
            error(e);
        } catch (e) {
            console.error(e);
        }
    }
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
    compressImg,
};