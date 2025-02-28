import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import File from 'ember-file-upload/file';

module('service:file-queue', function (hooks) {
  setupTest(hooks);

  test('the size of the queue is the aggregate of all queues', function (assert) {
    var queue = this.owner.lookup('service:file-queue');
    var queue1 = queue.create('queue1');
    var queue2 = queue.create('queue2');
    queue.create('queue3');

    assert.equal(queue.files.length, 0);
    assert.equal(queue.size, 0);
    assert.equal(queue.loaded, 0);
    assert.equal(queue.progress, 0);

    queue1.push({
      id: 'test',
      name: 'test-filename.jpg',
      size: 2000,
      loaded: 0,
    });

    assert.equal(queue.files.length, 1);
    assert.equal(queue.size, 2000);
    assert.equal(queue.loaded, 0);
    assert.equal(queue.progress, 0);

    queue2.push({
      id: 'test1',
      name: 'test-filename.jpg',
      size: 3500,
      loaded: 0,
    });

    assert.equal(queue.files.length, 2);
    assert.equal(queue.size, 5500);
    assert.equal(queue.loaded, 0);
    assert.equal(queue.progress, 0);

    queue2.push({
      id: 'test2',
      name: 'test-filename.jpg',
      size: 1400,
      loaded: 0,
    });

    assert.equal(queue.files.length, 3);
    assert.equal(queue.size, 6900);
    assert.equal(queue.loaded, 0);
    assert.equal(queue.progress, 0);
  });

  test('the uploaded size of the queue is the aggregate of all queues', function (assert) {
    var queue = this.owner.lookup('service:file-queue');
    var queue1 = queue.create('queue1');

    assert.equal(queue.files.length, 0);
    assert.equal(queue.size, 0);
    assert.equal(queue.loaded, 0);
    assert.equal(queue.progress, 0);

    queue1.push({
      id: 'test',
      name: 'test-filename.jpg',
      size: 2000,
      loaded: 500,
    });

    assert.equal(queue.files.length, 1);
    assert.equal(queue.size, 2000);
    assert.equal(queue.loaded, 500);
    assert.equal(queue.progress, 25);

    var queue2 = queue.create('queue2');

    queue2.push({
      id: 'test1',
      name: 'test-filename.jpg',
      size: 3500,
      loaded: 500,
    });

    assert.equal(queue.files.length, 2);
    assert.equal(queue.size, 5500);
    assert.equal(queue.loaded, 1000);
    assert.equal(queue.progress, 18);

    queue.create('queue3');

    queue2.push({
      id: 'test2',
      name: 'test-filename.jpg',
      size: 1400,
      loaded: 1000,
    });

    assert.equal(queue.files.length, 3);
    assert.equal(queue.size, 6900);
    assert.equal(queue.loaded, 2000);
    assert.equal(queue.progress, 28);
  });

  test('the queue is emptied when all files are completed', function (assert) {
    var queue = this.owner.lookup('service:file-queue');
    var queue1 = queue.create('queue1');

    const file0 = new File();
    file0.state = 'queued';

    queue1.push(file0);

    assert.equal(queue.files.length, 1);

    const file1 = new File();
    file1.state = 'queued';

    queue1.push(file1);

    assert.equal(queue.files.length, 2);

    const file2 = new File();
    file2.state = 'uploaded';

    queue1.push(file2);

    assert.equal(queue.files.length, 3);

    file0.state = 'aborted';

    assert.equal(queue.files.length, 3);

    file1.state = 'aborted';

    assert.equal(queue.files.length, 0);
    assert.equal(queue1.files.length, 0);
  });
});
