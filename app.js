var app = {

    // TODO:
    // Look into caching on local device



    // App properties
    appVersion: "1.7",
    toggleDebugModeCount: 0,
    resetDebugModeCountTimeout: null,
    isDebugMode: false,
    ncfReader: null,
    isNfcReading: false,
    nfcCardData: [
        {
            serialNumber: "04:9a:ad:99:78:00:00",
            name: "Jason Brenner",
            status: "Active",
            position: "Director, Technical Branch",
            codeName: "Basil Pesto",
            photo: "Jason.png"
        },
        {
            serialNumber: "04:a6:8e:98:78:00:00",
            name: "Shannon Brenenr",
            status: "Retired",
            position: "Spymaster",
            codeName: "Tenacious Gnome",
            photo: "Shan.jpg"
        },
        {
            serialNumber: "04:1a:7f:98:78:00:00",
            name: "Becky McLaughlin",
            status: "Retired",
            position: "Spymaster",
            codeName: "Squawking Goat",
            photo: "Becky.jpg"
        },
        {
            serialNumber: "04:8f:ee:98:78:00:00",
            name: "Amanda Baker",
            status: "Active",
            position: "Agent in Training",
            codeName: "Sugar Baby",
            photo: "Amanda.jpg"
        }
    ],

    
    // UI elements
    titleDiv: null,
    headerDiv: null,
    enableScanningDiv: null,
    enableScanningButton: null,
    awaitingScanDiv: null,
    scanningActiveDiv: null,
    accessGrantedDiv: null,
    spyPhotoImg: null,
    nameCell: null,
    statusCell: null,
    positionCell: null,
    codeNameCell: null,
    accessDeniedDiv: null,
    messageDiv: null,
    scanningAudio: null,
    accessGrantedAudio: null,
    accessDeniedAudio: null,

    color_red: "#ff0000",
    color_blue: "#005de9",
    color_green: "#0ab40a",


    // Event: page load
    load: function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register("worker.js");
        }
        
        app.getUIElementReferences();
        app.initializeScanner();
    },

    // Event: title div click
    titleDivClick: function(e) {
        clearTimeout(app.resetDebugModeCountTimeout)
        app.toggleDebugModeCount++;

        if (app.toggleDebugModeCount >= 7) {
            app.isDebugMode = !app.isDebugMode;
            app.toggleDebugModeCount = 0;
            app.messageDiv.innerHTML = "";
            
            if (app.isDebugMode) {
                app.addMessage("Debug mode enabled, app ver " + app.appVersion);
            }
        } else {
            app.resetDebugModeCountTimeout = setTimeout(() => {
                app.toggleDebugModeCount = 0;
            }, 5000);
        }
    },

    // Event: enable scanning button click
    enableScanningButtonClick: function(e) {
        app.addMessage("Enable scanning button click");
        
        if (app.ncfReader) {
            app.ncfReader.scan().then(function() {
                app.transitionTo_AwaitingScan(app.enableScanningDiv);

                app.ncfReader.onreading = (event) => {
                    console.log("Message read", event);
                    app.addMessage("Message read: " + event.serialNumber);
                    if (!app.isNfcReading) {
                        app.isNfcReading = true;
                        app.transitionTo_ScanningActive(event.serialNumber);
                    }
                }

                app.ncfReader.onreadingerror  = (event) => {
                    console.log("Message read error", event);
                    app.addMessage("Message read error");
                    if (!app.isNfcReading) {
                        app.isNfcReading = true;
                        app.transitionTo_ScanningActive(null);
                    }
                }
                
            }).catch(function(error) {
                console.log("Scan promise error", error);
                app.addMessage("Scan promise error");
            });
        } else {
            console.log("NFC reader is null");
            app.addMessage("NFC reader is null");
        }


        // TODO: for testing
        // app.transitionTo_AwaitingScan(app.enableScanningDiv);
        // setTimeout(function() {
        //     app.transitionTo_ScanningActive("04:9a:ad:99:78:00:00");
        // }, 5000)

    },


    // Helper method: get UI element references
    getUIElementReferences: function() {
        app.titleDiv = document.querySelector("#title-div");
        app.titleDiv.addEventListener("click", app.titleDivClick)

        app.headerDiv = document.querySelector("#header-div");
        
        app.enableScanningDiv = document.querySelector("#enable-scanning-div");
        app.enableScanningButton = document.querySelector("#enable-scanning-button");
        app.enableScanningButton.addEventListener("click", app.enableScanningButtonClick);

        app.awaitingScanDiv = document.querySelector("#awaiting-scan-div");

        app.scanningActiveDiv = document.querySelector("#scanning-active-div");

        app.accessGrantedDiv = document.querySelector("#access-granted-div");
        app.spyPhotoImg = document.querySelector("#spy-photo-img");
        app.nameCell = document.querySelector("#name-cell");
        app.statusCell = document.querySelector("#status-cell");
        app.positionCell = document.querySelector("#position-cell");
        app.codeNameCell = document.querySelector("#codename-cell");

        app.accessDeniedDiv = document.querySelector("#access-denied-div");

        app.messageDiv = document.querySelector("#message-div");

        app.scanningAudio = document.querySelector("#scanning-audio");
        app.accessGrantedAudio = document.querySelector("#access-granted-audio");
        app.accessDeniedAudio = document.querySelector("#access-denied-audio");
    },

    // Helper method: initialize NFC scanner
    initializeScanner: function() {
        if ('NDEFReader' in window) { 
            app.ncfReader = new NDEFReader();            
        } else {
            app.addMessage("NFC reader NOT supported");
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
        app.isNfcReading = false;
    },

    // Helper function: transition UI to scanning active
    transitionTo_ScanningActive: function(scannedSerialNum) {
        app.addMessage("Transition to scanning active");
        app.changeContentVisibility(app.awaitingScanDiv, false);
        app.changeContentVisibility(app.scanningActiveDiv, true);
        app.updateHeader("ACCESS CARD INSERTED", app.color_blue, true);
        app.playAudio(app.scanningAudio, 3, () => {
            app.handleScannerResponse(scannedSerialNum);
        });
    },

    // Helper function: transition UI to access granted
    transitionTo_AccessGranted: function(cardData) {
        app.addMessage("Transition to access granted");
        app.changeContentVisibility(app.scanningActiveDiv, false);
        app.nameCell.innerHTML = cardData.name;
        app.statusCell.innerHTML = cardData.status;
        app.positionCell.innerHTML = cardData.position;
        app.codeNameCell.innerHTML = cardData.codeName;
        app.spyPhotoImg.src = "images/spy-photos/" + cardData.photo;
        app.changeContentVisibility(app.accessGrantedDiv, true);
        app.updateHeader("ACCESS GRANTED", app.color_green, true);
        app.playAudio(app.accessGrantedAudio, 1, null);
    },

    // Helper function: transition UI to access denied
    transitionTo_AccessDenied: function() {
        app.addMessage("Transition to access denied");
        app.changeContentVisibility(app.scanningActiveDiv, false);
        app.accessDeniedDiv.innerHTML = "Invalid card"
        app.changeContentVisibility(app.accessDeniedDiv, true);
        app.updateHeader("ACCESS DENIED", app.color_red, true);
        app.playAudio(app.accessDeniedAudio, 1, null);
    },

    // Helper method: handle scanner response
    handleScannerResponse: function(scannedSerialNum) {
        const cardData = app.nfcCardData.find(({ serialNumber }) => serialNumber == scannedSerialNum);
        if (cardData) {
            app.transitionTo_AccessGranted(cardData);
            setTimeout(function() {
                app.transitionTo_AwaitingScan(app.accessGrantedDiv);
            }, 5000)
        } else {
            app.transitionTo_AccessDenied();
            setTimeout(function() {
                app.transitionTo_AwaitingScan(app.accessDeniedDiv);
            }, 5000)
        }
    },

    // Helper function: play auto
    playAudio: function(audioElement, playCount, endedCallback) {
        let plays = 0;
        audioElement.onended = function() {
            plays++;
            if (plays < playCount) {
                audioElement.play();
            } else {
                if (endedCallback) {
                    endedCallback();
                }
            }
        }
        audioElement.play();
    },

    // Helper method: add message
    addMessage: function(messageText) {
        if (app.isDebugMode) {
            app.messageDiv.innerHTML += `${messageText}<br>`;
        }
    }

}

window.addEventListener("DOMContentLoaded", function() {   
    app.load();
}); 



