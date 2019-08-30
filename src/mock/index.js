import api from './api';
import menu from './menu';
import admin from './admin';

/**
 * 模拟数据mock
 *
 * mock是否开启模拟数据拦截
 */

api({mock: true});

menu({mock: true});

admin({mock: true});
