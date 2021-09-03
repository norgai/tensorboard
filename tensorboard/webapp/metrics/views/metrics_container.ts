/* Copyright 2020 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {State} from '../../app_state';
import {getIsTimeSeriesPromotionEnabled} from '../../selectors';

@Component({
  selector: 'metrics-dashboard',
  template: `
    <metrics-promo-notice
      *ngIf="isButterBarEnabled$ | async"
      class="notice"
    ></metrics-promo-notice>
    <tb-dashboard-layout>
      <runs-selector sidebar></runs-selector>
      <metrics-main-view main></metrics-main-view>
    </tb-dashboard-layout>
  `,
  styleUrls: ['metrics_container.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsDashboardContainer {
  constructor(private readonly store: Store<State>) {}

  readonly isButterBarEnabled$: Observable<boolean> = this.store.select(
    getIsTimeSeriesPromotionEnabled
  );
}
