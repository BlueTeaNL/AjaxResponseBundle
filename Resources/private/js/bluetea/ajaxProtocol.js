$(function() {
    $.widget( "bluetea.ajaxProtocol", {
        options: {
            defaults: {
                url: null,
                data: null,
                type: 'POST',
                beforeSendCallback: function() { $(document).blockUi('blockUI'); },
                readyCallback: function() { $(document).blockUi('unblockUI'); },
                successCallback: function() {},
                failCallback: function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.responseJSON !== undefined) {
                        var data = jqXHR.responseJSON;
                        if (data.error === undefined && data[0] === undefined) {
                            bootbox.alert('Oh god! Something went terribly wrong :-(');
                        } else if (data.error === undefined) {
                            bootbox.alert('Exception occurred: ' + data[0].message);
                        } else if (data[0] === undefined) {
                            bootbox.alert(data.error.code + ' ' + data.error.message);
                        }
                    }
                }
            },
            translations: {
                submitBlockUiTitle: 'Submitting',
                submitBlockUiMessage: 'Please wait...'
            }
        },

        // Private variables
        _ajaxData: null,

        call: function(options) {
            // Reset ajax data
            this._ajaxData = null;
            // Merge options
            options = array_merge(this.options.defaults, options);
            // Call the URL
            $.ajax({
                url: options.url,
                type: options.type,
                data: options.data,
                beforeSend: options.beforeSendCallback
            })
                .done($.proxy(function(data) {
                    this._ajaxData = data.data;
                    if (data.type === undefined) {
                        alert("Ajax data invalid");
                        return false;
                    }
                    this._handleType(data);
                    this._handleFlashbag(data);
                    // Fire event
                    $(document).trigger('ajax_done', [data.data]);
                    // Execute successCallback
                    options.successCallback(this._ajaxData);
                }, this))
                .fail(options.failCallback)
                .always(options.readyCallback);
        },

        _handleType: function(data) {
            // Switch data type
            switch (data.type) {
                case 'modal':
                    // Create modal
                    this.createModal(data.content);
                    break;
                case 'redirect':
                    // Redirect to page
                    window.location.replace(data.content);
                    break;
                case 'event':
                    // Fire a custom event
                    $(document).trigger(data.content, [data.data]);
                    break;
                case 'data':
                    // Fire a custom event
                    $(document).trigger('ajax_data', [data.content]);
                    this._ajaxData = data.content;
                    break;
            }
        },

        _handleFlashbag: function(data) {
            // Check if flashbag exists
            if (data.flashBag) {
                $.each(data.flashBag, function(type, messages) {
                    $.each(messages, function(index, message) {
                        new PNotify({
                            type: type,
                            text: message
                        });
                    });
                });
            }
        },

        createModal: function(html) {
            $('<div class="modal fade">' + html + '</div>')
                .bootstrapModal({
                    translations: {
                        textBlockUiTitle: this.options.translations.submitBlockUiTitle,
                        textBlockUiMessage: this.options.translations.submitBlockUiMessage
                    }
                })
                .modal()
                .on('hidden.bs.modal', function(){
                    $(this).remove();
                })
                .on('shown.bs.modal', function(){
                    // stuff
                });
        }
    });
});