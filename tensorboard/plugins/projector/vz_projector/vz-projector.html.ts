/* Copyright 2016 The TensorFlow Authors. All Rights Reserved.

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

import {html} from '@polymer/polymer';
import './styles';

export const template = html`
<style include="vz-projector-styles"></style>
    <style>
      :host {
        display: flex;
        flex-direction: column; /* Stack elements vertically */
        width: 100%;
        height: 100%;
      }

      #container, #container-2, #container-3 {
        display: flex;
        flex-direction: column; /* Ensure each container's children are stacked vertically */
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .hidden {
        display: none !important;
      }

      /* Main */

      #main {
        position: relative;
        flex-grow: 2;
      }

      #main .stage {
        position: relative;
        flex-grow: 2;
        height: 500px;
      }

      #scatter {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      #selector {
        display: none;
        height: 100%;
        position: absolute;
        width: 100%;
      }

      #left-pane {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 312px;
        width: 312px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        background: #fafafa;
      }

      #right-pane {
        border-left: 1px solid rgba(0, 0, 0, 0.1);
        background: #fafafa;
        display: flex;
        height: 100%;
        min-width: 300px;
        width: 300px;
      }

      .file-name {
        margin-right: 5px;
      }

      .control input[type='text']:focus {
        outline: none;
        border-bottom: 1px solid rgba(0, 0, 0, 1);
      }

      .control {
        display: inline-block;
        width: 45%;
        vertical-align: top;
        margin-right: 10px;
        overflow-x: hidden;
      }

      .control.last {
        margin-right: 0;
      }

      #notification-dialog {
        width: 400px;
        padding-bottom: 20px;
      }

      #notification-dialog paper-button {
        background: none;
        text-transform: uppercase;
      }

      #notification-dialog .progress {
        --paper-spinner-color: #880e4f;
        --paper-spinner-stroke-width: 2px;
      }

      #notify-msgs {
        text-align: center;
        display: block;
      }

      .notify-msg {
        font-weight: 500;
        margin: 0;
        padding: 0;
      }

      .notify-msg.error {
        text-align: left;
      }

      .brush .extent {
        stroke: #fff;
        fill-opacity: 0.125;
        shape-rendering: crispEdges;
      }

      .origin text {
        font-size: 12px;
        font-weight: 500;
      }

      .origin line {
        stroke: black;
        stroke-opacity: 0.2;
      }

      /* Ink Framework */

      /* - Buttons */
      .ink-button,
      ::shadow .ink-button {
        border: none;
        border-radius: 2px;
        font-size: 13px;
        padding: 10px;
        min-width: 100px;
        flex-shrink: 0;
        background: #e3e3e3;
      }

      .status-bar-panel {
        display: flex;
        align-items: center;
      }

      .status-bar-entry {
        border-left: 1px solid rgba(0, 0, 0, 0.5);
        margin-left: 5px;
        padding-left: 5px;
      }

      /* - Menubar */

      .ink-panel-menubar {
        align-items: center;
        position: relative;
        height: 60px;
        border-bottom: solid 1px #eee;
        padding: 0 24px;
        display: flex;
      }

      .ink-panel-menubar .ink-fabs {
        position: absolute;
        right: 12px;
        top: 40px;
        z-index: 1;
      }

      #bookmark-panel {
        bottom: 0;
        position: absolute;
        width: 300px;
      }
      #bookmark-panel-container {
        bottom: 60px;
        position: absolute;
      }

      .ink-fab {
        margin-left: 8px;
        border: 1px solid rgba(0, 0, 0, 0.02);
        background: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }

      #metadata-card {
        position: absolute;
        right: 5px;
        top: 25px;
      }

      #help-3d-icon {
        position: absolute;
        top: 20px;
        left: 20px;
        background: white;
      }

      #help3dDialog .main {
        margin: 0;
        padding: 20px;
      }

      #help3dDialog h3 {
        margin-top: 20px;
        margin-bottom: 5px;
      }

      #help3dDialog h3:first-child {
        margin-top: 0;
      }

      #data-panel {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        overflow-y: auto;
      }

      #toast {
        display: flex;
        align-items: center;
        --paper-toast-color: #eeff41;
      }
    </style>
    <paper-dialog id="notification-dialog" modal>
      <h2 id="notification-title"></h2>
      <paper-dialog-scrollable>
        <div id="notify-msgs"></div>
      </paper-dialog-scrollable>
      <div style="text-align: center;">
        <paper-spinner-lite active class="progress"></paper-spinner-lite>
      </div>
      <div class="buttons">
        <paper-button class="close-button" dialog-confirm autofocus
          >Close</paper-button
        >
      </div>
    </paper-dialog>
    <div id="container">
      
      <div id="main" class="ink-panel">
        <div class="ink-panel-menubar">
          <paper-icon-button
            id="selectMode"
            alt="Bounding box selection"
            toggles
            icon="image:photo-size-select-small"
          ></paper-icon-button>
          <paper-tooltip
            for="selectMode"
            position="bottom"
            animation-delay="0"
            fit-to-visible-bounds
            >Bounding box selection</paper-tooltip
          >

          <paper-icon-button
            id="editMode"
            alt="Edit current selection"
            toggles
            icon="image:exposure"
          ></paper-icon-button>
          <paper-tooltip
            for="editMode"
            position="bottom"
            animation-delay="0"
            fit-to-visible-bounds
            >Edit current selection</paper-tooltip
          >

          <paper-icon-button
            id="nightDayMode"
            alt="Enable/disable night mode"
            toggles
            icon="image:brightness-2"
          ></paper-icon-button>
          <paper-tooltip
            for="nightDayMode"
            position="bottom"
            animation-delay="0"
            fit-to-visible-bounds
            >Enable/disable night mode</paper-tooltip
          >

          <paper-icon-button
            id="labels3DMode"
            alt="Enable/disable 3D labels mode"
            toggles
            icon="font-download"
          ></paper-icon-button>
          <paper-tooltip
            for="labels3DMode"
            position="bottom"
            animation-delay="0"
            fit-to-visible-bounds
            >Enable/disable 3D labels mode</paper-tooltip
          >
          <div class="status-bar-panel">
            <div class="status-bar-entry">
              Points: <span class="numDataPoints">Loading...</span>
            </div>
            <div class="status-bar-entry">
              Dimension: <span class="dim">Loading...</span>
            </div>
            <div
              id="status-bar"
              class="status-bar-entry"
              style="display: none;"
            ></div>
          </div>
          <div class="ink-fabs">
            <paper-icon-button
              id="reset-zoom"
              class="ink-fab"
              alt="Reset zoom to fit all points"
              icon="home"
            ></paper-icon-button>
            <paper-tooltip for="reset-zoom" position="left" animation-delay="0"
              >Reset zoom to fit all points</paper-tooltip
            >
          </div>
        </div>
        <div class="stage">
          <div id="scatter">
            <svg id="selector"></svg>
          </div>
          <vz-projector-metadata-card
            id="metadata-card"
          ></vz-projector-metadata-card>
          <paper-icon-button
            raised
            on-click="_toggleHelp3dDialog"
            icon="help-outline"
            id="help-3d-icon"
          ></paper-icon-button>
          <paper-tooltip animation-delay="0" for="help-3d-icon"
            >Help with interaction controls.</paper-tooltip
          >
          <paper-dialog id="help3dDialog" with-backdrop>
            <div class="main" dialog-confirm autofocus>
              <h3>3D controls</h3>
              <b>Rotate</b> Mouse left click.<br />
              <b>Pan</b> Mouse right click.<br />
              <b>Zoom</b> Mouse wheel.<br />
              Holding <b>ctrl</b> reverses the mouse clicks.
              <h3>2D controls</h3>
              <b>Pan</b> Mouse left click.<br />
              <b>Zoom</b> Mouse wheel.
              <div class="dismiss-dialog-note">Click anywhere to dismiss.</div>
            </div>
          </paper-dialog>
        </div>
      </div>

     </div>
     <div id="container-2">

      <br/><br/><br/><br/>
      <div id="left-pane" class="ink-panel">
        <vz-projector-data-panel id="data-panel"></vz-projector-data-panel>
        <vz-projector-projections-panel
          id="projections-panel"
        ></vz-projector-projections-panel>
      </div>
     </div>
     <div id="container-3">
      <div id="right-pane" class="ink-panel">
        <div class="ink-panel-content active">
          <vz-projector-inspector-panel
            id="inspector-panel"
          ></vz-projector-inspector-panel>
        </div>
        <div id="bookmark-panel-container">
          <vz-projector-bookmark-panel
            id="bookmark-panel"
          ></vz-projector-bookmark-panel>
        </div>
      </div>


    </div>
    <paper-toast id="toast" always-on-top></paper-toast>
  </template>
`;
