package com.reactweather;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.GradientDrawable;
import android.graphics.drawable.GradientDrawable.Orientation;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

public class AnimateView extends ViewGroup {

    private final float scale = this.getResources().getDisplayMetrics().density;
    private int repeatCount = Animation.INFINITE;
    private int delay = 0;
    private  float translateY = 0;
    private  int duration = 0;

    public AnimateView(Context context) {
        super(context);
    }


    @Override
    protected void onLayout(boolean changed, int l, int t, int r, int b) {

    }

    //设置延时
    public void setDelay(int delay){
        this.delay = delay;
    }

    //设置Y方向位移
    public void setTranslateY(float y){
        this.translateY = (int) (y*this.scale + 0.5);
    }

    //设置持续时间
    public void setDur(int time){
        this.duration = time;
    }

    //开始动画
    public void start(){
        TranslateAnimation transAnim = new TranslateAnimation(0, 0, 0, this.translateY);
        transAnim.setDuration(this.duration);
        transAnim.setStartOffset(this.delay);
        transAnim.setRepeatCount(this.repeatCount);
        this.clearAnimation();
        this.startAnimation(transAnim);
        System.out.println("start " + this.getContext().getPackageCodePath());
    }
    
    @Override
    protected  void onAttachedToWindow(){
        System.out.println("attach to window");
    }
}