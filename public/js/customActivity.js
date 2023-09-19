define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    
    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    var lastStepEnabled = false;
    var steps = [{ "label": "Configure Postcard", "key": "step1" }];

    var currentStep = steps[0].key;

    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedSchema', handelSchema)
    //connection.on('requestedInteraction', onRequestedInteraction);
    //connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    //connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestSchema')
        //connection.trigger('requestInteraction');
        //connection.trigger('requestTriggerEventDefinition');
        //connection.trigger('requestDataSources');  

    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function handelSchema(schema) {
        console.log("####Schema without strignify#####",schema);
        console.log('*** Schema ***', JSON.stringify(schema))
        $("#schema_info").text(JSON.stringify(schema));
        var getattributes = '';
        for(i=0;i<=schema.length;i++){
            getattributes += schema.schema[i].name+',';
        }
        $("#attribute_name").text(getattributes);
    }


    
    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        // var newData = handelSchema();

        // console.log("$$$$$$$$$$$$ New Data coming $$$$$$$",JSON.stringify(newData));
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
               if (key === 'postcardURL') {
                    $('#postcard-url').val(val);
                    $('.postcard - preview - content').css('background - image', "url('" + $('#postcard-url').val()); 
                }

                if (key === "postcardText")
                    $('#postcard-text').val(val);
                    $('#postcard-preview-text').html($('#postcard - text').val());
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        var postcardURLValue = $('#postcard-url').val();
        var postcardTextValue = $('#postcard-text').val();

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            "postcardText": postcardTextValue,
            "postcardURL":postcardURLValue
        }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }

    $('#btn-preview').click(function () {
        $('#postcard-preview-text').html($('#postcard-text').val());
        $('.postcard-preview-content').css('background-image',"url('" + $('#postcard-url').val() + "')");
    });

});