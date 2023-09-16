var app = {

    // App properties
    ncfReader: null,

    
    // UI elements
    scanCardButton: null,
    messageDiv: null,


    // Event: page load
    load: function() {
        app.getUIElementReferences();
        app.initializeScanner();
    },

    // Event: scan card button click
    scanCardButtonClick: function(e) {
        app.addMessage("Scan button click");
        if (app.ncfReader) {
            app.addMessage("Starting scan");
            app.ncfReader.scan();
        } else {
            app.addMessage("NFC reader is null");
        }
    },

    // Event: scanner reading
    scannerReading: function(e) {
        const message = e.message;
        for (const record of message.records) {
            console.log("Record type:  " + record.recordType);
            console.log("MIME type:    " + record.mediaType);
            console.log("Record id:    " + record.id);


            app.addMessage("Record type: " + record.recordType);
            app.addMessage("Mime type: " + record.mediaType);
            app.addMessage("Record id: " + record.id);
            
            // switch (record.recordType) {
            // case "text":
            //     // TODO: Read text record with record data, lang, and encoding.
            //     break;
            // case "url":
            //     // TODO: Read URL record with record data.
            //     break;
            // default:
            //     // TODO: Handle other records with record data.
            // }
        }
    },

    // Event: scanner read error
    scannerReadError: function(e) {
        app.addMessage("Cannot read data from NFC tag");
    },



    // Helper method: get UI element references
    getUIElementReferences: function() {
        app.scanCardButton = document.querySelector("#scan-card-button");
        app.scanCardButton.addEventListener("click", this.scanCardButtonClick);
        app.messageDiv = document.querySelector("#message-div");
    },

    // Helper method: initialize NFC scanner
    initializeScanner: function() {
        if ('NDEFReader' in window) { 
            app.addMessage("NFC reader supported");
            app.ncfReader = new NDEFReader();
            app.ncfReader.addEventListener("reading", this.scannerReading);
            app.ncfReader.addEventListener("readingerror", this.scannerReadError)
        } else {
            app.addMessage("NFC reader NOT supported");
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



