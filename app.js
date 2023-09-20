var app = {

    // TODO:
    // Add audio for access granted/denied
    // Add photos
    // Animation for awaiting card scan
    // Animation for scanning card




    // App properties
    ncfReader: null,
    nfcCardData: [
        {
            serialNumber: "04:9a:ad:99:78:00:00",
            name: "Jason Brenner",
            title: "Tech Specialist"
        },
        {
            serialNumber: "test1",
            name: "Shannon Brenenr",
            title: "Master Spy"
        }
    ],

    
    // UI elements
    headerDiv: null,
    enableScanningDiv: null,
    enableScanningButton: null,
    awaitingScanDiv: null,
    scanningActiveDiv: null,
    accessGrantedDiv: null,
    accessDeniedDiv: null,
    messageDiv: null,
    scanningAudio: null,

    color_red: "#ff0000",
    color_blue: "#005de9",
    color_green: "#0ab40a",


    // Event: page load
    load: function() {
        app.getUIElementReferences();
        app.initializeScanner();
    },

    // Event: enable scanning button click
    enableScanningButtonClick: function(e) {
        app.addMessage("Enable scanning button click");
        
        // TODO: commented out for testing
        // if (app.ncfReader) {
        //     app.ncfReader.scan().then(function() {
        //         app.transitionTo_AwaitingScan(app.enableScanningDiv);

        //         app.ncfReader.onreading = (event) => {
        //             console.log("Message read", event);
        //             app.addMessage("Message read: " + event.serialNumber);
        //             app.handleScannerResponse(event.serialNumber);
        //         }

        //         app.ncfReader.onreadingerror  = (event) => {
        //             console.log("Message read error", event);
        //             app.addMessage("Message read error");
        //             app.handleScannerResponse(null);
        //         }

        //     }).catch(function(error) {
        //         console.log("Scan promise error", error);
        //         app.addMessage("Scan promise error");
        //     });
        // } else {
        //     console.log("NFC reader is null");
        //     app.addMessage("NFC reader is null");
        // }


        // TODO: for testing
        app.transitionTo_AwaitingScan(app.enableScanningDiv);
        setTimeout(function() {
            app.handleScannerResponse("04:9a:ad:99:78:00:00");
        }, 5000)

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

        app.scanningAudio = document.querySelector("#scanning-audio");
        app.scanningAudio.loop = true;
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

    // Helper function: change content visibility
    changeContentVisibility: function(contentElement, isVisible) {
        if (isVisible) {
            contentElement.classList.remove("hidden");
        } else {
            contentElement.classList.add("hidden")
        }
    },

    // Helper function: transition UI to awaiting scan
    transitionTo_AwaitingScan: function(previousContentElement) {
        app.addMessage("Transition to awaiting scan");
        app.changeContentVisibility(previousContentElement, false);
        app.changeContentVisibility(app.awaitingScanDiv, true);
        app.updateHeader("INSERT ACCESS CARD", app.color_blue, true);
    },

    // Helper function: transition UI to scanning active
    transitionTo_ScanningActive: function() {
        app.addMessage("Transition to scanning active");
        app.changeContentVisibility(app.awaitingScanDiv, false);
        app.changeContentVisibility(app.scanningActiveDiv, true);
        app.updateHeader("ACCESS CARD INSERTED", app.color_blue, true);
        app.scanningAudio.play();
        setTimeout(function() {
            app.scanningAudio.pause();
            app.scanningAudio.currentTime = 0;
        }, 3200)
    },

    // Helper function: transition UI to access granted
    transitionTo_AccessGranted: function(cardData) {
        app.addMessage("Transition to access granted");
        app.changeContentVisibility(app.scanningActiveDiv, false);
        app.accessGrantedDiv.innerHTML = `${cardData.name}<br>${cardData.title}<br>`
        app.changeContentVisibility(app.accessGrantedDiv, true);
        app.updateHeader("ACCESS GRANTED", app.color_green, true);
    },

    // Helper function: transition UI to access denied
    transitionTo_AccessDenied: function() {
        app.addMessage("Transition to access denied");
        app.changeContentVisibility(app.scanningActiveDiv, false);
        app.accessDeniedDivDiv.innerHTML = "Invalid card"
        app.changeContentVisibility(app.accessGrantedDiv, true);
        app.updateHeader("ACCESS DENIED", app.color_red, true);
    },

    // Helper method: handle scanner response
    handleScannerResponse: function(scannedSerialNum) {
        app.transitionTo_ScanningActive();

        const cardData = app.nfcCardData.find(({ serialNumber }) => serialNumber == scannedSerialNum);
        if (cardData) {
            setTimeout(function() {
                app.transitionTo_AccessGranted(cardData);
            }, 3200)
            setTimeout(function() {
                app.transitionTo_AwaitingScan(app.accessGrantedDiv);
            }, 6000)
        } else {
            setTimeout(function() {
                app.transitionTo_AccessDenied();
            }, 3200)
            setTimeout(function() {
                app.transitionTo_AwaitingScan(app.accessDeniedDiv);
            }, 6000)
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



