//vant组件的常用方法
import {showNotify, showDialog, showConfirmDialog, showToast, allowMultipleToast} from 'vant';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';

/**
 * 轻提示
 * @param msg
 */
function toast(msg: string = '') {
    showToast(msg);
}

/**
 * 错误警告
 * @param msg
 * @param time
 */
function errorMsg(msg: string = 'error', time: number = 3000) {
    showNotify({
        type: 'danger',
        message: msg,
        duration: time
    });
}

/**
 * 成功提示
 * @param msg
 * @param time
 */
function successMsg(msg: string = 'success', time: number = 3000) {
    showNotify({
        type: 'success',
        message: msg,
        duration: time
    });
}

/**
 * 弹窗
 * @param title
 * @param message
 * @param theme
 * @param confirmButtonText
 * @param confirmButtonColor
 * @param overlay
 * @param closeOnClickOverlay
 * @param lockScroll
 * @param allowHtml
 * @param confirm
 */
function alert(
    {
        title = '提示',
        message = '',
        theme = '',
        confirmButtonText = '确认',
        confirmButtonColor = '#ee0a24',
        overlay = true,
        closeOnClickOverlay = false,
        lockScroll = true,
        allowHtml = false,
        confirm = function () {

        }
    } = {}) {
    showDialog({
        title,
        message,
        theme,
        confirmButtonText,
        confirmButtonColor,
        overlay,
        closeOnClickOverlay,
        lockScroll,
        allowHtml
    }).then(() => {
        confirm();
    });
}

/**
 * 确认弹窗
 *
 * @param title
 * @param message
 * @param theme
 * @param confirmButtonText
 * @param confirmButtonColor
 * @param cancelButtonText
 * @param cancelButtonColor
 * @param overlay
 * @param closeOnClickOverlay
 * @param lockScroll
 * @param allowHtml
 * @param confirm
 * @param cancel
 */
function confirm(
    {
        title = '提示',
        message = '',
        theme = '',
        confirmButtonText = '确认',
        confirmButtonColor = '#ee0a24',
        cancelButtonText = '取消',
        cancelButtonColor = 'black',
        overlay = true,
        closeOnClickOverlay = false,
        lockScroll = true,
        allowHtml = false,
        confirm = function () {

        },
        cancel = function () {

        }
    } = {}) {
    showConfirmDialog({
        title,
        message,
        theme,
        showCancelButton: true,
        confirmButtonText,
        confirmButtonColor,
        cancelButtonText,
        cancelButtonColor,
        overlay,
        closeOnClickOverlay,
        lockScroll,
        allowHtml
    }).then(() => {
        try {
            confirm();
        } catch (e) {
            console.error(e);
        }
    }).catch(() => {
        cancel();
    });
}

//对外抛出方法
export default {
    toast,
    errorMsg,
    successMsg,
    alert,
    confirm,
}