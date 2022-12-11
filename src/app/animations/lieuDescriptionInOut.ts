import { trigger, state, style, transition, animate, group } from '@angular/animations';

export const LieuInOutAnimation = [
    trigger('lieuInOut', [
        state('true',
            style({
            'display': 'block',
            'position': 'absolute',
            'background-color': 'white',
            'left': '0',
            'width': '75%',
            'z-index': '1',
            'padding': '1%'
            })),
        state('false', 
            style({
            'display': 'none'
            })
        ),
        transition('true => false', [group([
            animate('1ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '1',
                'width': '75%',
                'padding': '1%',
                'z-index': '1',
            })),
            animate('600ms ease-in-out', style({
                'opacity': '0',
                'transform': 'translateY(-100px)',
            }))
        ]
        )]),
        transition('false => true', [group([
            animate('1ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '0',
                'left': '0',
                'width': '75%',
                'padding': '1%',
                'z-index': '1',
                'transform': 'translateY(-100px)',
            })),
            animate('600ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '1',
                'background-color': 'white',
                'transform': 'translateY(0px)'
            }))
        ]
        )])
    ]),
]