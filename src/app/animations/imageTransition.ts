import { trigger, style, transition, animate} from '@angular/animations';

export const ImageTransition = [
    trigger("fade", [
        transition("false=>true", [
          style({ opacity: 1 }),
          animate("2500ms", style({ opacity: 1 }))
        ]),
        transition("true=>false", [
          style({ opacity: 1 }),
          animate("1500ms", style({ opacity: 0.7 }))
        ])
    ]),
]