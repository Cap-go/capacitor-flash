package ee.forgr.plugin.capacitor_flash;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(
    name = "CapacitorFlash",
    permissions = {
        @Permission(
            alias = "camera",
            strings = { Manifest.permission.CAMERA }
        ),
        @Permission(
            alias = "flashlight",
            strings = { Manifest.permission.FLASHLIGHT }
        ),
    }
)
public class CapacitorFlashPlugin extends Plugin {

    private CapacitorFlash implementation = new CapacitorFlash();
    static final String CAMERA = "camera";

    @Override
    public void load() {

    }

    /**
     * Completes the plugin call after a camera permission request
     *
     * @see #getPhoto(PluginCall)
     * @param call the plugin call
     */
    @PermissionCallback
    private void permissionsCallback(PluginCall call) {
        if (settings.getSource() == CameraSource.CAMERA && getPermissionState(CAMERA) != PermissionState.GRANTED) {
            Logger.debug(getLogTag(), "User denied camera permission: " + getPermissionState(CAMERA).toString());
            call.reject(PERMISSION_DENIED_ERROR_CAMERA);
            return;
        }
        if (settings.getSource() == CameraSource.FLASHLIGHT && getPermissionState(FLASHLIGHT) != PermissionState.GRANTED) {
            Logger.debug(getLogTag(), "User denied flashlight permission: " + getPermissionState(FLASHLIGHT).toString());
            call.reject(PERMISSION_DENIED_ERROR_CAMERA);
            return;
        }
        doShow(call);
    }

    @Override
    @PluginMethod
    public void requestPermissions(PluginCall call) {
        // If the camera permission is defined in the manifest, then we have to prompt the user
        // or else we will get a security exception when trying to present the camera. If, however,
        // it is not defined in the manifest then we don't need to prompt and it will just work.
        if (isPermissionDeclared(CAMERA)) {
            // just request normally
            super.requestPermissions(call);
        } else {
            // the manifest does not define camera permissions, so we need to decide what to do
            // first, extract the permissions being requested
            JSArray providedPerms = call.getArray("permissions");
            List<String> permsList = null;
            try {
                permsList = providedPerms.toList();
            } catch (JSONException e) {}

            if (permsList != null && permsList.size() == 1 && permsList.contains(CAMERA)) {
                // the only thing being asked for was the camera so we can just return the current state
                checkPermissions(call);
            } else {
                // we need to ask about photos so request storage permissions
                requestPermissionForAlias(PHOTOS, call, "checkPermissions");
            }
        }
    }

    @Override
    public Map<String, PermissionState> getPermissionStates() {
        Map<String, PermissionState> permissionStates = super.getPermissionStates();

        // If Camera is not in the manifest and therefore not required, say the permission is granted
        if (!isPermissionDeclared(CAMERA)) {
            permissionStates.put(CAMERA, PermissionState.GRANTED);
        }

        return permissionStates;
    }

    private boolean checkPermissions(PluginCall call) {
        // if the manifest does not contain the camera permissions key, we don't need to ask the user
        boolean hasCameraPerms = getPermissionState(CAMERA) == PermissionState.GRANTED;


        else if (!hasCameraPerms) {
            requestPermissionForAlias(CAMERA, call, "permissionsCallback");
            return false;
        }
        return true;
    }

    @PermissionCallback
    private void flashPermsCallback(PluginCall call) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            implementation(call);
        } else {
            call.reject("Permission is required to use flashlight");
        }
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        if (getPermissionState("camera") == PermissionState.GRANTED) {
            implementation(call);
        } else {
            call.reject("Permission is required to use flashlight");
        }
        JSObject ret = new JSObject();
        ret.put("value", implementation.isAvailable());
        call.resolve(ret);
    }

    @PluginMethod
    public void switchOn(PluginCall call) {
        String value = call.getString("instensity");

        JSObject ret = new JSObject();
        ret.put("value", implementation.switchOn(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void switchOff(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("value", implementation.switchOn());
        call.resolve(ret);
    }
    
    @PluginMethod
    public void isSwitchedOn(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("value", implementation.isSwitchedOn());
        call.resolve(ret);
    }
    
}
