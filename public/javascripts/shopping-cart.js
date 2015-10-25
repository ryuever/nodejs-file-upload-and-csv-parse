$("document").ready(function(){    

    var price = 0;
    var tax = 0;
    var count = 0;
    var tax_list = {"食品":0.05, "酒类":0.3, "其它":0.1};
    var category = '';
    var total_price = 0;
    var total_value = 0;
    var total_tax_fee = 0;
    var tax_fee = 0;
    var total_list = document.getElementsByClassName('total');
    for(var i = 0; i<total_list.length; i++){
        price = parseFloat($('.item-price-'+i).text());
        count = parseFloat($('.item-count-'+i).text());
        category = $('.item-category-'+i).text();
        tax = parseFloat((category in tax_list)? tax_list[category] : 0.1);
        console.log("price, count", price, count, tax, category);
        tax_fee = tax * price * count;
        total_price = price * count + tax_fee;
        $('.item-tax-fee-'+i).text(parseFloat(tax_fee.toFixed(3)));
        $('.item-total-fee-'+i).text(parseFloat(total_price.toFixed(3)));
        total_value = total_value + parseFloat(total_price.toFixed(2));
        total_tax_fee = total_tax_fee + tax_fee;
    }
    $('.list-total-tax-fee').text(parseFloat(total_tax_fee.toFixed(3)));
    $('.list-total-fee').text(parseFloat(total_value.toFixed(2)));


});
