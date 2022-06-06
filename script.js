"use strict";

let modalQt = 1;
let modalKey = 0;
let cart = [];

const query    = (el) => document.querySelector(el);
const queryAll = (el) => document.querySelectorAll(el);

pizzaJson.map( (item, index) => {

    // Clone dos items para as pizzas
    let pizzaItem = query('.models .pizza-item').cloneNode(true);

    // Acrescenta um data key para cada item
    pizzaItem.setAttribute('data-key', index);

    // Monta Detalhes da pizza
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${ item.price.toFixed(2) }`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML  = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML  = item.description;

    // Monta o Modal das pizzas, no click
    pizzaItem.querySelector('a').addEventListener('click', (e) => {

        e.preventDefault();
        
        // Monta as informações do modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        modalQt  = 1;
        modalKey = key;

        // Imagem da pizza no modal
        query('.pizzaBig img').src = pizzaJson[key].img;

        query('.pizzaInfo h1').innerHTML    = pizzaJson[key].name;
        query('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        query('.pizzaInfo--actualPrice').innerHTML = `R$ ${ pizzaJson[key].price.toFixed(2) }`;

        // Limpa selecionado
        query('.pizzaInfo--size.selected').classList.remove('selected');

        // Seletor de tamaho
        queryAll('.pizzaInfo--size').forEach( (size, sizeIndex) => {

            if (sizeIndex == 2) {

                // Seleção de tamalho padrão
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        // Inicia Qty de item
        query('.pizzaInfo--qt').innerHTML = modalQt;

        query('.pizzaWindowArea').style.opacity = 0;
        query('.pizzaWindowArea').style.display = 'flex';

        // Efeito do modal
        setTimeout(() => {

            query('.pizzaWindowArea').style.opacity = 1;

        }, 200);

    });

   // Controi todo o layout para as pizzas
   query('.pizza-area').append( pizzaItem );
});

// Botão de cancelar e voltar
queryAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => {

    item.addEventListener('click', closeModal);
});

// Btão de qty -
query('.pizzaInfo--qtmenos').addEventListener('click', () => {

    if (modalQt > 1) {

        modalQt --;
        query('.pizzaInfo--qt').innerHTML = modalQt;
    }

});

// Btão de qty +
query('.pizzaInfo--qtmais').addEventListener('click', () => {

    modalQt ++;
    query('.pizzaInfo--qt').innerHTML = modalQt;

});

// Seletor de tamaho
queryAll('.pizzaInfo--size').forEach( (size, sizeIndex) => {

    size.addEventListener('click', (e) => {

        query('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

    });

});

// Modal do Carrinho
query('.pizzaInfo--addButton').addEventListener('click', () => {

    let size = parseInt(query('.pizzaInfo--size.selected').getAttribute('data-key'));

    // Cria identificador para qtd de pizza 
    let identifier = pizzaJson[modalKey].id + '&' + size;

    // Verifica se há identificador repeditos
    let keyIdent = cart.findIndex( (item) => item.identifier == identifier );

    // Caso há, soma ++
    if (keyIdent > - 1) {

        cart[keyIdent].qty += modalQt;

    } else {
        
        cart.push({
            
            id : pizzaJson[modalKey].id,
            identifier,
            size,
            qty : modalQt
    
        });
    }

    updateCart();
    closeModal();

});

// Abre o Modal do mobile
query('.menu-openner').addEventListener('click', () => {

    if (cart.length > 0) {

        query('aside').style.left = '0';
    }

});

// Fexa modal do mobile
query('.menu-closer').addEventListener('click', () => {

    query('aside').style.left = '100vw';
});

/**
 * Evento do Modal de cancelar
 */
 function closeModal() {

    query('.pizzaWindowArea').style.opacity = 0;

    setTimeout( () => {

        query('.pizzaWindowArea').style.display = 'none';
    }, 500);

}

/**
 * Atualiza Carrinho
 */
function updateCart() {

    // Atualiza qty no cart do mobile
    query('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {

        // Mostra o Cart
        query('aside').classList.add('show');

        // Limpa o cart depois de add
        query('.cart').innerHTML = '';

        let subTotal = 0;
        let descount = 0;
        let total    = 0;
        
        for (let i in cart) {
            
            // Pega pizza Adicionada, e acrescenta no Cart
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subTotal += pizzaItem.price * cart[i].qty;
            
            // Clonas os itens
            let cartItem  = query('.models .cart--item').cloneNode(true);

            // Nomeia os Tamanhos da pizza
            let pizzaSizeName = '';
            switch (cart[i].size) {
                case 0 :
                    pizzaSizeName = 'P';
                    break;
                case 1 :
                    pizzaSizeName = 'M';
                    break;
                case 2 :
                    pizzaSizeName = 'G';
                    break;
            };

            // Nome e Tamanho da pizza
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            
            // Detalhes da pizza no cart
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qty;
            
            // Evento no Btão de - no cart
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                
                if ( cart[i].qty > 1) {

                    cart[i].qty--;

                } else {

                    cart.splice(i, 1);
                }

                updateCart();
            });
            
            // Evento no Btão de + no cart
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                
                cart[i].qty++;
                updateCart();
            });


            // Add item no cart
            query('.cart').append(cartItem);
        }

        descount = subTotal * 0.1;
        total    = subTotal - descount;

        query('.subtotal span:last-child').innerHTML = `R$ ${ subTotal.toFixed(2) }`;
        query('.desconto span:last-child').innerHTML = `R$ ${ descount.toFixed(2) }`;
        query('.total span:last-child').innerHTML    = `R$ ${ total.toFixed(2) }`;

    } else {

        // Esconde cart vazio
        query('aside').classList.remove('show');

        // Esconde cart mobile vazio
        query('aside').style.left = '100vw';
    }
}
