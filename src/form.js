export function getForm(){
    const get = id => document.getElementById(id);

    return{
        theme         : get('theme-toggle'),
        root          : document.documentElement,
        themeicon     : get('icon-toggle'),
        equity        : get('equity'),
        risk          : get('risk'),
        riskRange     : get('risk-range'),
        leverage      : get('leverage'),
        leverageRange : get('leverage-range'),
        entryPrice    : get('entry-price'),
        slPrice       : get('sl-price'),

        position      : get('position'),
        positionSize  : get('position-size'),
        marginSize    : get('margin-size'),
        riskSize      : get('risk-size'),
        tp1           : get('tp1'),
        tp2           : get('tp2'),
        tp3           : get('tp3'),

        calculate     : get('calculate'),

        messageEntry  : get('message-entry'),
    };
}