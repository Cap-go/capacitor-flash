package ee.forgr.plugin.capacitor_flash;

package nl.xservices.plugins;

import android.Manifest;
import android.annotation.TargetApi;
import android.content.Context;
import android.content.pm.FeatureInfo;
import android.content.pm.PackageManager;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.lang.reflect.Method;
import android.util.Log;

public class CapacitorFlash {

    private static final String ACTION_AVAILABLE = "available";
    private static final String ACTION_SWITCH_ON = "switchOn";
    private static final String ACTION_SWITCH_OFF = "switchOff";

    private static Boolean capable;
    private boolean releasing;

    @SuppressWarnings("deprecation")
    private Camera mCamera;

    private static final int PERMISSION_CALLBACK_CAMERA = 33;
    private String[] permissions = {Manifest.permission.CAMERA};
    private CallbackContext callbackContext;

    public Boolean checkPermissions() {
        Log.i("isAvailable", value);
        return value;
    }


    public Boolean isAvailable() {
        Log.i("isAvailable", value);
        return value;
    }


    public Boolean switchOn(Float intensity) {
        try {
            if (isCapable()) {
                doToggleTorch(switchOn);
            } else {
                return false;
            }
        } catch (Exception e) {
            return false;
        }
    }
    
    public Boolean switchOff() {
        toggleTorch(false);
        releaseCamera();
        return true;
    }
    
    public Boolean isSwitchedOn() {
        Log.i("isAvailable", value);
        return value;
    }

}
