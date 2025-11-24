package ee.forgr.plugin.capacitor_flash;

import android.Manifest;
import android.content.Context;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.os.Build;
import androidx.annotation.RequiresApi;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

@CapacitorPlugin(name = "CapacitorFlash", permissions = { @Permission(alias = "camera", strings = { Manifest.permission.CAMERA }) })
public class CapacitorFlashPlugin extends Plugin {

    private final String pluginVersion = "7.1.20";

    private String cameraId;
    boolean isFlashStateOn = false;

    private CameraManager cameraManager;

    @Override
    public void load() {
        cameraManager = (CameraManager) this.bridge.getContext().getSystemService(Context.CAMERA_SERVICE);
        try {
            if (cameraManager != null) {
                cameraId = cameraManager.getCameraIdList()[0];
            }
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.M && getPermissionState("camera") != PermissionState.GRANTED) {
            requestPermissionForAlias("camera", call, "cameraPermsCallback");
        } else {
            getAvailability(call);
        }
    }

    @PermissionCallback
    private void getAvailability(PluginCall call) {
        JSObject ret = new JSObject();
        if (cameraManager == null) {
            ret.put("value", false);
            call.resolve(ret);
            return;
        }
        try {
            boolean flashAvailable = cameraManager.getCameraCharacteristics(cameraId).get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
            ret.put("value", flashAvailable);
        } catch (CameraAccessException e) {
            e.printStackTrace();
            ret.put("value", false);
        }
        call.resolve(ret);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @PluginMethod
    public void switchOn(PluginCall call) {
        Float intensity = call.getFloat("intensity", 1.0f);
        JSObject ret = new JSObject();
        if (cameraManager == null) {
            ret.put("value", false);
            call.resolve(ret);
            return;
        }
        try {
            // Android 13+ (API 33) supports torch brightness control
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                switchOnWithIntensity(intensity);
            } else {
                // For older Android versions, only on/off is supported
                cameraManager.setTorchMode(cameraId, true);
            }
            isFlashStateOn = true;
            ret.put("value", true);
        } catch (Exception e) {
            e.printStackTrace();
            ret.put("value", false);
        }
        call.resolve(ret);
    }

    @RequiresApi(api = Build.VERSION_CODES.TIRAMISU)
    private void switchOnWithIntensity(Float intensity) throws CameraAccessException {
        // Clamp intensity between 0.0 and 1.0
        float clampedIntensity = Math.max(0.0f, Math.min(1.0f, intensity));

        // Get max torch strength level using reflection for API 33+ compatibility
        try {
            // CameraCharacteristics.FLASH_INFO_STRENGTH_MAX_LEVEL is an API 33+ constant
            java.lang.reflect.Field field = CameraCharacteristics.class.getField("FLASH_INFO_STRENGTH_MAX_LEVEL");
            CameraCharacteristics.Key<Integer> key = (CameraCharacteristics.Key<Integer>) field.get(null);
            Integer maxLevel = cameraManager.getCameraCharacteristics(cameraId).get(key);

            if (maxLevel != null && maxLevel > 1) {
                // Convert 0.0-1.0 range to device's torch level range (1 to maxLevel)
                // Level 1 is minimum brightness, maxLevel is maximum
                int torchLevel = Math.max(1, Math.round(clampedIntensity * maxLevel));
                cameraManager.turnOnTorchWithStrengthLevel(cameraId, torchLevel);
            } else {
                // Fallback if max level is not available
                cameraManager.setTorchMode(cameraId, true);
            }
        } catch (Exception e) {
            // If reflection fails, fall back to simple on mode
            cameraManager.setTorchMode(cameraId, true);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @PluginMethod
    public void switchOff(PluginCall call) {
        JSObject ret = new JSObject();
        if (cameraManager == null) {
            ret.put("value", false);
            call.resolve(ret);
            return;
        }
        try {
            cameraManager.setTorchMode(cameraId, false);
            isFlashStateOn = false;
            ret.put("value", true);
        } catch (Exception e) {
            e.printStackTrace();
            ret.put("value", false);
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void isSwitchedOn(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("value", isFlashStateOn);
        call.resolve(ret);
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @PluginMethod
    public void toggle(PluginCall call) {
        JSObject ret = new JSObject();
        if (cameraManager == null) {
            ret.put("value", false);
            call.resolve(ret);
            return;
        }
        try {
            isFlashStateOn = !isFlashStateOn;
            cameraManager.setTorchMode(cameraId, isFlashStateOn);
            ret.put("value", isFlashStateOn);
        } catch (Exception e) {
            e.printStackTrace();
            ret.put("value", false);
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void getPluginVersion(final PluginCall call) {
        try {
            final JSObject ret = new JSObject();
            ret.put("version", this.pluginVersion);
            call.resolve(ret);
        } catch (final Exception e) {
            call.reject("Could not get plugin version", e);
        }
    }
}
