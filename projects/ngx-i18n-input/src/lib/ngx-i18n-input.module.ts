import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxI18nInputComponent } from './ngx-i18n-input.component';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NGX_I18N_INPUT_CONFIG, NGX_I18N_INPUT_DEFAULT_CONFIGS, NgxI18nInputConfig } from './types';



@NgModule({
  declarations: [
    NgxI18nInputComponent,
  ],
  imports: [
    NgTemplateOutlet,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
    NgSwitch,
    NgSwitchDefault,
    NgSwitchCase,
    NgClass,

    // DEVELOPMENT
    JsonPipe
  ],
  exports: [
    NgxI18nInputComponent
  ]
})
export class NgxI18nInputModule {
  static forRoot(configs: Partial<NgxI18nInputConfig>): ModuleWithProviders<NgxI18nInputModule> {
    return {
      ngModule: NgxI18nInputModule,
      providers: [
        {
          provide: NGX_I18N_INPUT_CONFIG,
          useValue: {...configs}
        }
      ]
    }
  }
}
