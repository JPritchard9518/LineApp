package com.lineapp.openscanapp;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class OpenScanAppModule extends ReactContextBaseJavaModule {

  @Override
  public String getName() {
    /**
     * return the string name of the NativeModule which represents this class in JavaScript
     * In JS access this module through React.NativeModules.OpenScanApp
     */
    return "OpenScanApp";
  }

  @ReactMethod
  public void openScanAppAndValidate(Callback cb) {
    cb.invoke("5aba6683b3a25d0019f5cbc2");
    // Activity currentActivity = getCurrentActivity();

    // if (currentActivity == null) {
    //   cb.invoke(false);
    //   return;
    // }

    // try {
    //   currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_SETTINGS));
    //   cb.invoke(true);
    // } catch (Exception e) {
    //   cb.invoke(e.getMessage());
    // }
  }
  
  @ReactMethod
  public void openScanAppAndEnroll(Callback cb) {
    cb.invoke("XXXXXXXXXXXXXXXXXXXXX");
    // Activity currentActivity = getCurrentActivity();

    // if (currentActivity == null) {
    //   cb.invoke(false);
    //   return;
    // }

    // try {
    //   currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_NETWORK_OPERATOR_SETTINGS));
    //   cb.invoke(true);
    // } catch (Exception e) {
    //   cb.invoke(e.getMessage());
    // }
  }

  /* constructor */
  public OpenScanAppModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }
}


// https://stackoverflow.com/questions/41677735/react-native-unable-to-open-device-settings-from-my-android-app