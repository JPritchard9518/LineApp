package com.lineapp.fingerprint;

import com.digitalpersona.uareu.ReaderCollection;
import com.digitalpersona.uareu.UareUException;
import com.digitalpersona.uareu.UareUGlobal;
import com.digitalpersona.uareu.Reader;
import com.digitalpersona.uareu.Reader.Capabilities;


import android.app.Activity;

import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

import android.content.Context;

import android.app.Application;

import com.digitalpersona.uareu.Reader;
import com.digitalpersona.uareu.Reader.Priority;
import com.digitalpersona.uareu.UareUException;

import com.digitalpersona.uareu.dpfpddusbhost.DPFPDDUsbHost;
import com.digitalpersona.uareu.dpfpddusbhost.DPFPDDUsbException;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.os.Bundle;

import android.content.Context;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
// import android.content.Context;

//import com.lineapp.UareUSampleJava.Globals;


public class FingerprintModule extends ReactContextBaseJavaModule {

    // private String m_deviceName = "";
    private ReaderCollection readers;
//    private static Globals instance;
//    static
//    {
//        instance = new Globals();
//    }

    private Context applContext;

    public FingerprintModule(ReactApplicationContext reactContext) {
        super(reactContext);
        applContext = reactContext.getApplicationContext();
    }

    @Override
    public String getName() {
        return "Fingerprint";
    }

    @ReactMethod
    public void getReaders(Callback returnVal){
        returnVal.invoke("This came from the fingerprint Native Module");
//         try {
//             readers = UareUGlobal.GetReaderCollection(applContext);
// //            readers = UareUGlobal.getInstance().getReaders(applContext);
//             readers.GetReaders();
//             returnVal.invoke(readers);
//         } catch (UareUException e) {
//             returnVal.invoke("Error");
//             // onBackPressed();
//         }
    }
}