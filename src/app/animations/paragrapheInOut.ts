import { trigger, state, style, transition,
    animate, group, query, stagger, keyframes
} from '@angular/animations';

export const SlideInOutAnimation = [
    trigger('slideInOut', [
        state('true',
            style({
            'display': 'block',
            'position': 'absolute',
            'top': '70%',
            'left': '{{leftValue}}%',
            'width': '300%',
            'z-index': '1',
            'padding': '5%',
            'color': 'black',
            'background-color': 'white'
            }),
            {params: {leftValue: 0}}),
        state('false', 
            style({
            'display': 'none',
            'transform': 'translateY(-400px)'
            })
        ),
        transition('true => false', [group([
            animate('1ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'background-color': 'white',
                'opacity': '1',
                'left': '{{leftValue}}%',
                'width': '300%',
                'padding': '5%',
                'z-index': '1',
                'transform': 'translateY(-95px)',
            })),
            animate('300ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'background-color': 'white',
                'opacity': '.7',
                'left': '{{leftValue}}%',
                'width': '300%',
                'padding': '5%',
                'z-index': '1',
                'transform': 'translateY(-100px)',
            })),
            animate('600ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'background-color': 'white',
                'opacity': '.3',
                'left': '{{leftValue}}%',
                'width': '300%',
                'padding': '5%',
                'z-index': '1',
                'transform': 'translateY(-200px)',
            }))
        ]
        )]),
        transition('false => true', [group([
            animate('200ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '.1',
                'background-color': 'white',
                'left': '{{leftValue}}%',
                'width': '300%',
                'padding': '5%',
                'z-index': '1',
                'transform': 'translateY(-400px)',
            })),
            animate('400ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '.3',
                'background-color': 'white',
                'left': '{{leftValue}}%',
                'width': '300%',
                'padding': '5%',
                'z-index': '1',
                'transform': 'translateY(-200px)'
            })),
            animate('600ms ease-in-out', style({
                'display': 'block',
                'position': 'absolute',
                'opacity': '.8',
                'background-color': 'white',
                'left': '{{leftValue}}%',
                'width': '300%',
                'padding': '5%',
                'z-index': '1',
                'transform': 'translateY(-95px)'
            }))
        ]
        )])
    ]),
]