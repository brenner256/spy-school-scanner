var app = {

    // App properties
    ncfReader: null,

    
    // UI elements
    headerDiv: null,
    enableScanningDiv: null,
    enableScanningButton: null,
    awaitingScanDiv: null,
    scanningActiveDiv: null,
    accessGrantedDiv: null,
    accessDeniedDiv: null,
    messageDiv: null,


    // Event: page load
    load: function() {
        app.getUIElementReferences();
        app.initializeScanner();
    },

    // Event: enable scanning button click
    enableScanningButtonClick: function(e) {
        app.addMessage("Enable scanning button click");
        
        // TODO: commented out for testing
        if (app.ncfReader) {
            app.ncfReader.scan().then(function() {
                app.addMessage("Scan started");
                app.changeVisibility_EnableScanningDiv(false);
                app.changeVisibility_AwaitingScanDiv(false);
                app.updateHeader("SCAN TO ENTER", "#ff0000", true);

                app.ncfReader.onreading = (event) => {
                    console.log("Message read", nfcEvt);
                    app.addMessage("Message read");
                    //app.scannerReading(nfcEvt);
                }
                app.ncfReader.onreadingerror  = (event) => {
                    console.log("Message read error", event);
                    app.addMessage("Message read error");
                }

            }).catch(function(error) {
                app.addMessage("Scan promise error");
            });
        } else {
            app.addMessage("NFC reader is null");
        }


        // // TODO: for testing
        // app.changeVisibility_EnableScanningDiv(false);
        // app.changeVisibility_AwaitingScanDiv(true);
        // app.updateHeader("SCAN TO ENTER", "#aa0a00", true);
        // setTimeout(function() {
        //     app.changeVisibility_AwaitingScanDiv(false);
        //     app.changeVisibility_ScanningActiveDiv(true);
        // }, 15000)
        // setTimeout(function() {
        //     app.changeVisibility_ScanningActiveDiv(false);
        //     app.changeVisibility_AccessGrantedDiv(true);
        //     app.updateHeader("ACCESS GRANTED", "#0ab40a", true);
        // }, 20000)
        // setTimeout(function() {
        //     app.changeVisibility_AccessGrantedDiv(false);
        //     app.changeVisibility_AwaitingScanDiv(true)
        //     app.updateHeader("SCAN TO ENTER", "#aa0a00", true);
        // }, 25000)

    },

    // Event: scanner reading
    scannerReading: function(e) {
        if (e) {
            for (const [key, value] of Object.entries(e)) {
                app.addMessage(`${key}: ${value}`);
            }
        } else {
            app.addMessage("Scan event obj is null");
        }


        // const message = e.message;
        // for (const record of message.records) {
        //     console.log("Record type:  " + record.recordType);
        //     console.log("MIME type:    " + record.mediaType);
        //     console.log("Record id:    " + record.id);


        //     app.addMessage("Record type: " + record.recordType);
        //     app.addMessage("Mime type: " + record.mediaType);
        //     app.addMessage("Record id: " + record.id);
            
        //     // switch (record.recordType) {
        //     // case "text":
        //     //     // TODO: Read text record with record data, lang, and encoding.
        //     //     break;
        //     // case "url":
        //     //     // TODO: Read URL record with record data.
        //     //     break;
        //     // default:
        //     //     // TODO: Handle other records with record data.
        //     // }
        // }
    },

    // Event: scanner read error
    scannerReadError: function(e) {
        app.addMessage("Cannot read data from NFC tag");
    },




    // Helper method: get UI element references
    getUIElementReferences: function() {
        app.headerDiv = document.querySelector("#header-div");
        
        app.enableScanningDiv = document.querySelector("#enable-scanning-div");
        app.enableScanningButton = document.querySelector("#enable-scanning-button");
        app.enableScanningButton.addEventListener("click", this.enableScanningButtonClick);

        app.awaitingScanDiv = document.querySelector("#awaiting-scan-div");

        app.scanningActiveDiv = document.querySelector("#scanning-active-div");

        app.accessGrantedDiv = document.querySelector("#access-granted-div");

        app.accessDeniedDiv = document.querySelector("#access-denied-div");

        app.messageDiv = document.querySelector("#message-div");
    },

    // Helper method: initialize NFC scanner
    initializeScanner: function() {
        if ('NDEFReader' in window) { 
            app.ncfReader = new NDEFReader();
        } else {
            app.addMessage("NFC reader NOT supported");
            // TODO: error message
        }
    },

    // Helper function: update header
    updateHeader: function(text, color, isVisible) {
        if (isVisible) {
            app.headerDiv.classList.remove("hidden");
        } else {
            app.headerDiv.classList.add("hidden");
        }

        app.headerDiv.innerHTML = text;
        app.headerDiv.style.color = color;
    },

    // Helper function: change visibility for enable scanning div
    changeVisibility_EnableScanningDiv: function(isVisible) {
        if (isVisible) {
            app.enableScanningDiv.classList.remove("hidden");
        } else {
            app.enableScanningDiv.classList.add("hidden")
        }
    },

    // Helper function: change visibility for awaiting scan div
    changeVisibility_AwaitingScanDiv: function(isVisible) {
        if (isVisible) {
            app.awaitingScanDiv.classList.remove("hidden");
        } else {
            app.awaitingScanDiv.classList.add("hidden");
        }
    },

    // Helper function: change visibility for scanning active div
    changeVisibility_ScanningActiveDiv: function(isVisible) {
        if (isVisible) {
            app.scanningActiveDiv.classList.remove("hidden");
        } else {
            app.scanningActiveDiv.classList.add("hidden");
        }
    },

    // Helper function: change visibility for access granted div
    changeVisibility_AccessGrantedDiv: function(isVisible) {
        if (isVisible) {
            app.accessGrantedDiv.classList.remove("hidden");
        } else {
            app.accessGrantedDiv.classList.add("hidden");
        }
    },

    // Helper function: change visibility for access denied div
    changeVisibility_AccessDeniedDiv: function(isVisible) {
        if (isVisible) {
            app.accessDeniedDiv.classList.remove("hidden");
        } else {
            app.accessDeniedDiv.classList.add("hidden");
        }
    },




    // Helper method: add message
    addMessage: function(messageText) {
        app.messageDiv.innerHTML += `${messageText}<br>`;
    }

}

window.addEventListener("DOMContentLoaded", function() {   
    app.load();
}); 



