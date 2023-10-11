import { NgModule } from '@angular/core';
import {StylePaginatorDirective} from "./directives/style-paginator.directive";
import {NumberOldDirective} from "./directives/number-input-old.directive";
import {NumberDirective} from "./directives/number-input.directive";



@NgModule({
  imports: [],
  declarations: [StylePaginatorDirective,NumberOldDirective,NumberDirective],
  exports: [StylePaginatorDirective,NumberOldDirective,NumberDirective]
})
export class DirectivesModule {

}
