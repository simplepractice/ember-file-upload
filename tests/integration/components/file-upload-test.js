import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { selectFiles } from 'ember-file-upload/test-support';

module('Integration | Component | FileUpload', function (hooks) {
  setupRenderingTest(hooks);

  test('uploading a file calls onFileAdd', async function (assert) {
    this.onFileAdd = (file) => assert.step(file.name);

    await render(
      hbs`<FileUpload @name="test" @onFileAdd={{this.onFileAdd}} />`
    );

    await selectFiles('input[type="file"]', new File([], 'dingus.txt'));

    assert.verifySteps(['dingus.txt']);
  });

  test('deprecated: uploading a file calls onfileadd', async function (assert) {
    this.onFileAdd = (file) => assert.step(file.name);

    await render(
      hbs`<FileUpload @name="test" @onfileadd={{this.onFileAdd}} />`
    );

    await selectFiles('input[type="file"]', new File([], 'dingus.txt'));

    assert.verifySteps(['dingus.txt']);
  });

  test('uploading multiple files calls onFileAdd multiple times', async function (assert) {
    this.onFileAdd = (file) => assert.step(file.name);

    await render(
      hbs`<FileUpload @name="test" @onFileAdd={{this.onFileAdd}} />`
    );

    await selectFiles(
      'input[type="file"]',
      new File([], 'dingus.txt'),
      new File([], 'dingus.png')
    );

    assert.verifySteps(['dingus.txt', 'dingus.png']);
  });

  test('deprecated: uploading multiple files calls onfileadd multiple times', async function (assert) {
    this.onFileAdd = (file) => assert.step(file.name);

    await render(
      hbs`<FileUpload @name="test" @onfileadd={{this.onFileAdd}} />`
    );

    await selectFiles(
      'input[type="file"]',
      new File([], 'dingus.txt'),
      new File([], 'dingus.png')
    );

    assert.verifySteps(['dingus.txt', 'dingus.png']);
  });

  test('assigns attributes to input', async function (assert) {
    await render(hbs`<FileUpload
      @name="test"
      @for="test-id"
      @accept="image/*"
      @capture={{true}}
      @multiple={{true}}
      @disabled={{true}}
    />`);

    assert.dom('input[type="file"]').hasAttribute('id', 'test-id');
    assert.dom('input[type="file"]').hasAttribute('accept', 'image/*');
    assert.dom('input[type="file"]').hasAttribute('multiple');
    assert.dom('input[type="file"]').hasAttribute('disabled');
    assert.dom('input[type="file"]').hasAttribute('capture');
  });
});
