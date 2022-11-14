import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('true', style({
            'opacity': '1',
            'position': 'absolute',
            'z-index': '9999',
            'padding': '0 6% 1% 6%',
            'background-color': 'white',
            'visibility': 'visible',
        })),
        state('false', style({
            'position': 'absolute',
            'opacity': '0', 
            'visibility': 'hidden',
            'transform': 'translateY(-60px)'
        })),
        transition('true => false', [group([
            animate('400ms ease-in-out', style({
                'padding': '0 6% 1% 6%',
                'opacity': '0'
            })),
            animate('600ms ease-in-out', style({
                'padding': '0 6% 1% 6%',
                'transform': 'translateY(-45px)'
            })),
            animate('700ms ease-in-out', style({
                'visibility': 'hidden'
            }))
        ]
        )]),
        transition('false => true', [group([
            animate('1ms ease-in-out', style({
                'visibility': 'visible',
                'padding': '0 6% 1% 6%',
                'transform': 'translateY(-45px)'
            })),
            animate('300ms ease-in-out', style({
                'background-color': 'white',
                'z-index': '9999',
                'padding': '0 6% 1% 6%',
                'transform': 'translateY(0)'
            })),
            animate('600ms ease-in-out', style({
                'opacity': '1'
            }))
        ]
        )])
    ]),
]