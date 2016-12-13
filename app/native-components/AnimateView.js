/**
 * @providesModule RCTGradientColorView
 * 自定义native UI组件
*/

'use strict';

import React, { Component, PropTypes } from 'react';
import {
    View,
    requireNativeComponent,
    findNodeHandle,
    UIManager,
    Platform
} from 'react-native';

class AnimateView extends Component {

    shouldComponentUpdate(nextProps) {
        return false;
    }
    /**
     * 开始动画
     * 通过`dispatchViewManagerCommand`调用自定义组件中的方法
     * `UIManager.RCTAnimateView.Commands`.start 是在JAVA层中定义的
     * `RCTAnimateView` 为JAVA层中定义的名称
     * @memberOf AnimateView
     */
    start() {
        UIManager.dispatchViewManagerCommand(findNodeHandle(this), UIManager.RCTAnimateView.Commands.start,
            [Platform.OS === 'android' ? JSON.stringify(this.data || []) : null]);
    }
    /**
     * 组件更新后
     * 由于`redux`原因，需延迟500ms开始动画
     * 
     * @memberOf AnimateView
     */
    componentDidUpdate() {
        this.timer = setTimeout(() => {
            this.start();
        }, 500)
    }
    /**
     * 由于redux原因，需延迟500ms开始动画
     * 
     * @memberOf AnimateView
     */
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.start();
        }, 500)
    }
    /**
     * 组件卸载时清除未开始的定时器 
     * 
     * @memberOf AnimateView
     */
    componentWillUnmount(){
        clearTimeout(this.timer);
    }
    render() {
        return (
            <NativeAnimateView
                {...this.props}>
                {this.props.children}
            </NativeAnimateView>
        );
    }
};
// 与Java层AnimateView中@ReactProp注解的方法参数保持一致
/**
 * 配置propTypes
 */
AnimateView.propTypes = {
    delay: PropTypes.number,
    dur: PropTypes.number,
    translateY: PropTypes.number,
    ...View.propTypes //这个必须要有
}


var NativeAnimateView = requireNativeComponent('RCTAnimateView', AnimateView);

module.exports = AnimateView;