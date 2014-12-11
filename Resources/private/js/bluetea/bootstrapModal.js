$(function() {
    $.widget('bluetea.bootstrapModal', {
        // Default options
        options: {
            content: null,
            translations: {
                textBlockUiTitle: 'Submitting',
                textBlockUiMessage: 'Please wait...'
            }
        },
        _element: null,

        _create: function() {
            // Save element in private variable _element
            this._element = this.element;

            // Initialize event listener for this modal
            this._initEventListeners();
        },

        _initEventListeners: function()
        {
            this._on($(this._element).find('form'), {
                submit: function(event) {
                    // this.element = div / modal
                    // event.currentTarget = form
                    event.preventDefault();
                    this._submitForm(event.currentTarget);
                }
            });
        },

        _submitForm: function(form) {
            var type = $(form).attr('method');
            var url = $(form).attr('action');
            var data = $(form).serialize();
            $(document).ajaxProtocol("call", {
                url: url,
                data: data,
                type: type,
                beforeSendCallback: $.proxy(function() {
                    $(document).blockUi(
                        'blockUI',
                        this.options.translations.textBlockUiTitle,
                        this.options.translations.textBlockUiMessage
                    );
                }, this)
            });
            $(document).bind('ajax_done', $.proxy(function(event, data) {
                this.destroy();
            }, this));
        },

        _destroy: function() {
            $(this._element)
                .modal('hide');
        }
    });
}(jQuery));