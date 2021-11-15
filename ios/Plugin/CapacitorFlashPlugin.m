#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(CapacitorFlashPlugin, "CapacitorFlash",
           CAP_PLUGIN_METHOD(isAvailable, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(switchOn, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(switchOff, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(isSwitchedOn, CAPPluginReturnPromise);
)
