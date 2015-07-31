$(function() {
    $.widget('bluetea.blockUi', {
        // Default options
        options: {
            textBlockUiTitle: 'Loading',
            textBlockUiMessage: 'Please wait...'
        },

        // Private variables
        _isUiBlocked: false,
        _blockCount: 0,

        /**
         * Block UI
         *
         * @param title
         * @param message
         * @param className
         */
        blockUI: function(title, message, className) {
            if (title == undefined) {
                title = this.options.textBlockUiTitle;
            }

            if ( message == undefined) {
                message = this.options.textBlockUiMessage;
            }

            if(!this._isUiBlocked){
                this._isUiBlocked = true;

                var htmlMessage = $('<div></div>')
                        .addClass('content').addClass(className)
                        .append($('<p></p>').html(title).addClass('title'))
                        .append($('<p></p>').html(message).addClass('message'))
                    ;

                /* $.blockUI.defaults.css = {}; */
                $.blockUI({
                    message: htmlMessage,
                    css: { backgroundColor: 'transparent', color: '#fff', border:0, zIndex: 2001 },
                    overlayCSS:  { zIndex: 2000, backgroundColor: '#000', opacity: 0.9, cursor: 'wait' }
                });
            }
            this._blockCount++;
        },

        /**
         * Unblock the UI
         */
        unblockUI: function() {
            this._blockCount--;
            if (this._blockCount <= 0 ) {
                this._isUiBlocked = false;
                $.unblockUI();
                this._blockCount = 0;
            }
        },

        blockElement: function(element, title, message, className) {
            if (title == undefined) {
                title = this.options.textBlockUiTitle;
            }

            if ( message == undefined) {
                message = this.options.textBlockUiMessage;
            }

            var htmlMessage = $('<div></div>').addClass('wrapper').addClass(className)
                    .append(
                    $('<div></div>').addClass('pull-left fa fa-spinner fa-pulse fa-5x'),
                    $('<div></div>').addClass('pull-left content').append(
                        $('<p></p>').html(title).addClass('title'),
                        $('<p></p>').html(message).addClass('message')
                    )
                )
                ;

            $(element).block({
                message: htmlMessage,
                css: { backgroundColor: 'transparent', color: '#fff', border:0, zIndex: 100, textAlign: 'left' },
                overlayCSS:  { zIndex: 99, backgroundColor: '#000', opacity: 0.9, cursor: 'wait' }
            });
        },

        unblockElement: function(element) {
            $(element).unblock();
        },

        /**
         * Is called with a hash of all options that are changing always refresh when changing options
         *
         * @private
         */
        _setOptions: function() {
            // _super and _superApply handle keeping the right this-context
            this._superApply(arguments);
        },

        /**
         * Is called for each individual option that is changing
         *
         * @param key
         * @param value
         * @private
         */
        _setOption: function(key, value) {
            this._super(key, value);
        },

        /**
         * Called when created, and later when changing options
         *
         * @private
         */
        _refresh: function() {

        },

        /**
         * Events bound via _on are removed automatically
         *
         * @private
         */
        _destroy: function() {
            // Call the base destroy function
            $.Widget.prototype.destroy.call(this);
        }
    });
}(jQuery));