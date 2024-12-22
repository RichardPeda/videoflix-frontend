import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appMouseOutside]',
  standalone: true,
})
export class MouseOutsideDirective {
  @Output() mouseOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('mouseleave', ['$event'])
  public onLeave(e: MouseEvent) {
   
      this.mouseOutside.emit();
    
  }
}
