import { getForm } from './form.js';
const el    = getForm();

// ========  theme  ========
function localTheme(){
    const currentTheme = el.root.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('app-theme', currentTheme);
}

function iconTheme(){
    const isTheme = el.root.classList.contains('dark') ? 'dark_mode' : 'light_mode';
    el.themeicon.innerHTML = isTheme;
}

function initTheme(){
    const appTheme = localStorage.getItem('app-theme');
    if (appTheme) {
        appTheme === 'dark' ? el.root.classList.add('dark') : el.root.classList.remove('dark');
    }else{
        el.root.classList.contains('dark') ? el.root.classList.add('dark') : el.root.classList.remove('dark');
    }
    iconTheme();
}

el.theme.addEventListener('click', () => {
    el.root.classList.toggle('dark');
    localTheme();
    iconTheme();
});

function currencyFormat(ammount){
    const formatted = ammount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatted.replace('$', '$ ');
}

function thousandSeparator(ammount){
    if (typeof ammount !== 'number') {
        ammount = Number(ammount);
        if (isNaN(ammount)) return '';
    }
    const formatted = ammount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    });
    return formatted;
}
// ========  theme  ========

// ========  calculate  ========
function calculate(){
    const numEquity   = parseFloat(el.equity.value);
    const numEntry    = parseFloat(el.entryPrice.value);
    const numSL       = parseFloat(el.slPrice.value);
    const numRisk     = parseFloat(el.risk.value);
    const numLeverage = parseFloat(el.leverage.value);

    const formValidate = [
        numEquity, numEntry , numSL, numRisk, numLeverage
    ];
    const result = document.getElementById('result');
    result.classList.toggle('hidden', formValidate.some(isNaN));

    // position
    const position = (isNaN(numEntry) || isNaN(numSL)) ? '' : ((numEntry > numSL) ? 'Long <span class="ml-1 badge long">L</span>' : 'Short <span class="ml-1 badge short">S</span>');
    el.position.innerHTML = position;
    
    // risk size
    const rsize = numEquity * (numRisk / 100);
    el.riskSize.innerHTML = isNaN(numSL) || isNaN(rsize) ? '' : `${currencyFormat(rsize)} (at ${thousandSeparator(numSL)})`;
    
    // position size
    const slRange = numEntry - numSL;
    const slRangeVal = (slRange > 0) ? (numEntry - numSL) : (numSL - numEntry);
    const positionSize = rsize / slRangeVal;
    el.positionSize.innerHTML = isNaN(positionSize) ? '' : `${thousandSeparator(positionSize)} units`;
    
    // take profit
    for (let i = 1; i <= 3 ; i++) {        
        const tp = numEntry + (slRange * i);
        const profitSize = (numEquity * (numRisk / 100)) * i;
        el['tp'+i].innerHTML = isNaN(tp) || isNaN(profitSize) ? '' : `${currencyFormat(profitSize)} (at ${thousandSeparator(tp)})`;
    }

    // margin size
    const margin = (positionSize * numEntry) / numLeverage;
    el.marginSize.innerHTML = isNaN(margin) ? '' : currencyFormat(margin);
}

el.calculate.addEventListener('click', () => {
    calculate();
})
// ========  calculate  ========


// ========  form localStorage  ========
function localEq(){
    const localEquity = el.equity.value;
    localStorage.setItem('localEquity', localEquity);
}
// ========  form localStorage  ========

// ========  form handling  ========
function validateRange(input){
    const inputValue = input.value;
    const minValue = input.min;
    const maxValue = input.max;

    if (isNaN(inputValue)) {
        input.value = minValue;
        return; 
    }
    input.value = Math.max(minValue, Math.min(inputValue, maxValue));
    calculate();
}

el.risk.addEventListener('input', () => {
    validateRange(el.risk);
    el.riskRange.value = el.risk.value;
});

el.riskRange.addEventListener('input', () =>{
    el.riskRange.focus();
    el.risk.value = el.riskRange.value;
    calculate();
});

el.leverage.addEventListener('input', () => {
    validateRange(el.leverage);
    el.leverageRange.value = el.leverage.value;
});

el.leverageRange.addEventListener('input', () =>{
    el.leverageRange.focus();
    el.leverage.value = el.leverageRange.value;
    calculate();
});

el.equity.addEventListener('input', () => {
    localEq();
    calculate();
});

function validateEntryExit(){
    if (el.entryPrice.value == el.slPrice.value) {
        el.slPrice.value = '';
        el.slPrice.focus();
        el.messageEntry.innerHTML = '<b class="text-primary dark:text-accent">SL Price</b> must be <b class="text-primary dark:text-accent">above</b> or <b class="text-primary dark:text-accent">below</b> entry price.'
    }else{
        el.messageEntry.innerHTML = ''
    }
}

el.entryPrice.addEventListener('input', () =>{
    validateEntryExit();
    calculate();
});

el.slPrice.addEventListener('input', () =>{
    validateEntryExit();
    calculate();
});

el.reset.addEventListener('click', () => {
    el.entryPrice.value = '';
    el.slPrice.value = '';

    el.entryPrice.focus();
    calculate();
});
// ========  form handling  ========

// ========  app initialize  ========
function appinit(){
    initTheme();

    el.equity.value = localStorage.getItem('localEquity') || '';
    (el.equity.value ? el.entryPrice : el.equity).focus();
}

appinit();
// ========  app initialize  ========