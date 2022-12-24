import { trigger, state, style, transition, animate, group } from '@angular/animations';

export const ActiviteInOutAnimation = [
    trigger('activiteInOut', [
        state('true',
            style({
            'display': 'block',
            'position': 'absolute',
            'left': '0',
            'width': '70%',
            'z-index': '1',
            'padding': '1%',
            'border': 'solid 1px black',
            'background-color': 'white'
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
                'background-color': 'white',
                'left': '0',
                'width': '70%',
                'padding': '1%',
                'z-index': '1'
            })),
            animate('600ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'background-color': 'white',
                'opacity': '0',
                'left': '0',
                'width': '70%',
                'padding': '1%',
                'z-index': '1',
                'transform': 'translateY(-150px)',
            }))
        ]
        )]),
        transition('false => true', [group([
            animate('1ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '0',
                'background-color': 'white',
                'left': '0',
                'width': '70%',
                'padding': '1%',
                'z-index': '1',
                'border': 'solid 1px black',
                'transform': 'translateY(-200px)',
            })),
            animate('600ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '1',
                'background-color': 'white',
                'left': '0',
                'width': '70%',
                'padding': '1%',
                'z-index': '1',
                'border': 'solid 1px black',
                'transform': 'translateY(0)'
            }))
        ]
        )])
    ]),
]