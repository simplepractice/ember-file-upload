import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import uuid from '../system/uuid';
import { tracked } from '@glimmer/tracking';
import deprecateNonCamelCaseEvents from '../utils/deprecate-non-camel-case-events';

/**
  Whether multiple files can be selected when uploading.
  @argument multiple
  @type {boolean}
  */

/**
  The name of the queue to upload the file to.

  @argument name
  @type {string}
  @required
  */

/**
  If set, disables input and prevents files from being added to the queue

  @argument disabled
  @type {boolean}
  @default false
  */

/**
  A comma-separated list of MIME types / extensions to be accepted by the input, as documented here https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept
  @argument accept
  @type {string}
  */

/**
  `onFileAdd` is called when a file is selected.

  When multiple files are selected, this function
  is called once for every file that was selected.

  @argument onFileAdd
  @type {function}
  @required
  */

/**
  Specify capture devices which the user may select for file input.
  @see https://www.w3.org/TR/html-media-capture/
  @argument capture
  @type {string}
  */

/**
  `FileUpload` is a component that will users to upload files using
  their browser's file chooser.

  ```hbs
  <FileUpload
    @name="photos"
    @accept="image/*"
    @multiple=true
    @onFileAdd={{perform this.uploadImage}}
    as |queue|
  >
    <a tabindex="0">Add an image.</a>
    {{#if queue.files.length}}
      Uploading {{queue.files.length}} files. ({{queue.progress}}%)
    {{/if}}
  </FileUpload>
  ```

  ```js
  import Component from '@glimmer/component';
  import { task } from 'ember-concurrency';

  export default class ExampleComponent extends Component {
    @task({ maxConcurrency: 3, enqueue: true })
    *uploadImage(file) {
      const response = yield file.upload(url, options);
      ...
    }
  }
  ```

  @class FileUploadComponent
  @type Ember.Component
  @yield {Queue} queue
 */
export default class FileUploadComponent extends Component {
  @service fileQueue;

  @tracked _value = null;

  get onFileAdd() {
    if (this.args.onfileadd) {
      deprecateNonCamelCaseEvents('onfileadd', 'onFileAdd');
      return this.args.onfileadd;
    }
    return this.args.onFileAdd;
  }

  get queue() {
    if (!this.args.name) return null;

    return (
      this.fileQueue.find(this.args.name) ||
      this.fileQueue.create(this.args.name)
    );
  }

  get for() {
    return this.args.for || `file-input-${uuid.short()}`;
  }

  @action
  change(event) {
    const { files } = event.target;
    this.queue._addFiles(files, 'browse');
    this._value = null;
  }
}
