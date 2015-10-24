$("document").ready(function(){
    var tax_list = {"食品":0.05, "酒类":0.3, "其它":0.1};
    $('.btn-number').click(function(e){
        e.preventDefault();        
        fieldName = $(this).attr('data-field');
        type      = $(this).attr('data-type');
        var input = $("input[name='"+fieldName+"']");
        var currentVal = parseInt(input.val());
        if (!isNaN(currentVal)) {
            if(type == 'minus') {
                
                if(currentVal > input.attr('min')) {
                    input.val(currentVal - 1).change();
                } 
                if(parseInt(input.val()) == input.attr('min')) {
                    $(this).attr('disabled', true);
                }

            } else if(type == 'plus') {
                if(currentVal < input.attr('max')) {
                    input.val(currentVal + 1).change();
                }
                if(parseInt(input.val()) == input.attr('max')) {
                    $(this).attr('disabled', true);
                }
            }
        } else {
            input.val(0);
        }
    });
    $('.input-number').focusin(function(){
        $(this).data('oldValue', $(this).val());
    });
    $('.input-number').change(function() {        
        minValue =  parseInt($(this).attr('min'));
        maxValue =  parseInt($(this).attr('max'));
        valueCurrent = parseInt($(this).val());
        var name = $(this).attr('name');
        var indicator = $(this).attr('i');
        var category = $('.category-'+indicator).val();
        
        var tax = parseFloat((category in tax_list)? tax_list[category] : 0.1);       
        var price = parseFloat($('.price-quant-'+indicator).val());
        var count = parseInt($('.count-'+indicator).val());

        console.log("tax, price, count", category, tax, price, count);

        var item_fee = price * count * (tax+1);
        $('.total-with-tax-quant-'+indicator).text(parseFloat(item_fee.toFixed(3)));

        console.log("valueCurrent, minValue, maxValue",valueCurrent, minValue, maxValue);
        if(valueCurrent >= minValue) {
            $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled');
        } else {
            alert('Sorry, the minimum value was reached');
            $(this).val($(this).data('oldValue'));
        }
        
        if(valueCurrent <= maxValue) {
            $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled');
        } else {
            alert('Sorry, the maximum value was reached');
            $(this).val($(this).data('oldValue'));
        }

        var t = document.getElementsByClassName("form-item-total-fee");
        console.log("t", t);
        var total_fee = 0;
        for(var i = 0; i<t.length; i++){
            console.log(t[i].innerHTML);
            total_fee = total_fee + parseFloat(t[i].innerHTML);            
        }
        console.log(total_fee);
        $('.total-fee').text(total_fee.toFixed(2));
    });
    $(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $('.item-wrapper a').mouseenter(function () {
        $('.panel').show();
        // if ($(this).data('panel')) {
        //     $('.panel').hide();
        //     // $('#' + $(this).data('panel')).show();
        // }
    });
    $('.item-wrapper a').mouseleave(function () {
        $('.panel').hide();
    });

    $("#upload-file-btn").click(function(){
        $("#manually-input-form").hide();
        $("#upload-file-form").show();
    });
    $("#manually-input-btn").click(function(){
        $("#upload-file-form").hide();
        $("#manually-input-form").show();
    });


    // $("#manually-input-form").click(function(event){
    //     event.preventDefault();
    //     $.post({
            


    //     })

    // })
});