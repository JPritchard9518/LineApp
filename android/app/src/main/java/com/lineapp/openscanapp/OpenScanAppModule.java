package com.lineapp.openscanapp;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import android.app.*;
import android.content.*;
import android.content.pm.*;

import java.util.List;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

public class OpenScanAppModule extends ReactContextBaseJavaModule {
  public Context context;
  @Override
  public String getName() {
    /**
     * return the string name of the NativeModule which represents this class in JavaScript
     * In JS access this module through React.NativeModules.OpenScanApp
     */
    return "OpenScanApp";
  }
  // https://stackoverflow.com/questions/2780102/open-another-application-from-your-own-intent?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
  // **** READ THESE DOCS
  @ReactMethod
  public void openSettings1(Callback cb){
    // Intent intent = new Intent(Intent.ACTION_MAIN);
    // intent.setComponent(ComponentName.unflattenFromString("android.intent.action.MAIN"));
    // intent.addCategory(Intent.CATEGORY_LAUNCHER);
    // intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    // context.startActivity(intent);

    openApp(context,"android.intent.action.MAIN");



    // Intent intent = new Intent(Intent.ACTION_Dial,"308-641-2361");
    // Intent intent = new Intent(com.digitalpersona.uareu.UareUSampleJava.CaptureFingerprintActivity);
    // PackageManager packageManager = context.getPackageManager();
    // // PackageManager packageManager = getActivity().getPackageManager();
    // List<ResolveInfo> activities = packageManager.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY);
    // boolean isIntentSafe = activities.size() > 0;
    // cb.invoke(isIntentSafe);
    
    
    
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
  public void openSettings2(Callback cb){
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      cb.invoke(false);
      return;
    }

    try {
      currentActivity.startActivity(new Intent(android.provider.Settings.ACTION_NETWORK_OPERATOR_SETTINGS));
      cb.invoke(true);
    } catch (Exception e) {
      cb.invoke(e.getMessage());
    }
  }
  @ReactMethod
  public void openScanAppAndValidate(Callback cb) {
    // int number = UruConnection.init_reader(m_connection);
    // cb.invoke(number);
    cb.invoke("5aba6683b3a25d0019f5cbc2");
    
  }
  
  @ReactMethod
  public void openScanAppAndEnroll(Callback cb) {
    cb.invoke("XXXXXXXXXXXXXXXXXXXXX");
    
  }

  public static boolean openApp(Context context, String packageName) {
    PackageManager manager = context.getPackageManager();
    try {
      Intent i = manager.getLaunchIntentForPackage(packageName);
      if (i == null) {
        return false;
        // throw new ActivityNotFoundException();
      }
      i.addCategory(Intent.CATEGORY_LAUNCHER);
      context.startActivity(i);
      return true;
    } catch (ActivityNotFoundException e) {
      return false;
    }
  }

  /* constructor */
  public OpenScanAppModule(ReactApplicationContext reactContext) {
    super(reactContext);
    context = reactContext;
  }
}


// https://stackoverflow.com/questions/41677735/react-native-unable-to-open-device-settings-from-my-android-app