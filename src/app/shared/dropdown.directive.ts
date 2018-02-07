import { Directive, HostListener, HostBinding } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen =false;
    // binds to isOpen, attaches if true
    @HostListener('click') toggleOpen(){
        this.isOpen = !this.isOpen;
    }
}