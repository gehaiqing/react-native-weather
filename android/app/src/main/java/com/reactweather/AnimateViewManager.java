package com.reactweather;


import android.widget.Toast;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class AnimateViewManager extends ViewGroupManager<AnimateView> {

    public static final int COMMAND_START = 1;

    // React-Native官方大多数自定义View都是用RCT开头，这里保持规范性
    private static final String REACT_CLASS = "RCTAnimateView";

    //JS中使用的组件名称
    @Override
    public String getName() {
        // 此处name在后面JS组件开发时会用到，需要统一命名
        return REACT_CLASS;
    }

    @Override
    protected AnimateView createViewInstance(ThemedReactContext reactContext) {
        // AnimateView实例
        return new AnimateView(reactContext);
    }

    //与JS映射。 属性 dur
    @ReactProp(name = "dur", customType = "int")
    public void setDur(AnimateView view,  int dur ){
        view.setDur(dur);
    }

    //与js映射。 属性 delay 
    @ReactProp(name = "delay", customType = "int")
    public void setDelay(AnimateView view, int delay ){
        view.setDelay(delay);
    }

    //与js映射。 属性 translateY 
    @ReactProp(name = "translateY", customType = "float")
    public void setMoveY(AnimateView view,  float translateY ){
        view.setTranslateY(translateY);
    }

    //从react继承
    //返回命令序列
    //JS根据返回的命令列表，向Native发送命令，Native根据接受到的命令处理，如方法调用
    @Override
    public Map<String, Integer> getCommandsMap() {
        System.out.println("getcommandsmap");
        return MapBuilder.of(
                "start",
                COMMAND_START
        );
    }

    //接受由js发送过来的命令
    @Override
    public void receiveCommand(AnimateView view, int commandId,  ReadableArray args) {
        String msg = "recieve command " + commandId;
        System.out.println(msg);
        switch (commandId) {
            case COMMAND_START: {
                    view.start();
            }
        }
    }

}