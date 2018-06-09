/* eslint-disable no-undef */
require('../../lib');
const schema = require('../../lib/schema');
const fixture = require('../../lib/fixture');
const { assert } = require('chai');

const getActual = async (id) => {
  const method = 'app.record.index.edit.show';
  kintone.events.on(method, event => event);
  const event = await kintone.events.do(method, { recordId: id });
  kintone.events.off(method);
  return event.record;
};

schema.load();
fixture.load();

describe('record GET', () => {
  it('レコードが取得できること（コールバック）', async () => {
    let actual;
    await kintone.api(
      '/k/v1/record',
      'GET',
      { app: 2, id: 1 },
      (resp) => {
        actual = resp.record.数値.value;
      },
      (err) => {
        actual = err.message;
      },
    );
    assert.equal(actual, '99');
  });

  it('レコードが取得できること（kintone.Promise）', async () => {
    let actual;
    await kintone.api('/k/v1/record', 'GET', { app: 2, id: 1 }).then(
      (resolve) => {
        actual = resolve.record.数値.value;
      },
      (reject) => {
        actual = reject.message;
      },
    );
    assert.equal(actual, '99');
  });

  describe('URLが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/reco',
        'GET',
        { app: 2, id: 0 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid pathOrUrl');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/reco', 'GET', { app: 2, id: 0 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid pathOrUrl');
    });
  });

  describe('メソッドが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'DELETE',
        { app: 2, id: 0 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid method [DELETE]');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'DELETE', { app: 2, id: 0 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid method [DELETE]');
    });
  });

  describe('appが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'GET',
        { app: 9, id: 1 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'GET', { app: 9, id: 1 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });

  describe('idが誤っている場合', () => {
    it('レコードが取得できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'GET',
        { app: 2, id: 0 },
        (resp) => {
          actual = resp.record.数値.value;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが取得できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'GET', { app: 2, id: 0 }).then(
        (resolve) => {
          actual = resolve.record.数値.value;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });
});

describe('record POST', () => {
  afterEach(() => {
    schema.load();
    fixture.load();
  });

  it('レコードが登録できること（コールバック）', async () => {
    let actual;
    await kintone.api(
      '/k/v1/record',
      'POST',
      {
        app: 2,
        record: {
          文字列__1行: {
            value: 'ABC',
          },
        },
      },
      (resp) => {
        actual = resp;
      },
      (err) => {
        actual = err.message;
      },
    );
    assert.deepEqual(actual, {
      id: '4',
      revision: '1',
    });
  });

  it('レコードが登録できること（kintone.Promise）', async () => {
    let actual;
    await kintone
      .api('/k/v1/record', 'POST', {
        app: 2,
        record: {
          文字列__1行: {
            value: 'ABC',
          },
        },
      })
      .then(
        (resolve) => {
          actual = resolve;
        },
        (reject) => {
          actual = reject.message;
        },
      );
    assert.deepEqual(actual, {
      id: '4',
      revision: '1',
    });
  });

  it('未設定の項目が初期値で補完されること（kintone.Promise）', async () => {
    await kintone.api('/k/v1/record', 'POST', {
      app: 2,
      record: {
        数値: {
          value: 1234,
        },
      },
    });
    const record = await getActual(4);
    assert.equal(record.数値.value, '1234');
    assert.equal(record.ラジオボタン.value, 'sample1');
  });

  describe('appが誤っている場合', () => {
    it('レコードが登録できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'POST',
        { app: 9, id: 1 },
        (resp) => {
          actual = resp;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが登録できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'POST', { app: 9, id: 1 }).then(
        (resolve) => {
          actual = resolve;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });

  describe('recordが未設定の場合', () => {
    it('レコードが登録できないこと（コールバック）', async () => {
      let actual;
      await kintone.api(
        '/k/v1/record',
        'POST',
        { app: 2 },
        (resp) => {
          actual = resp;
        },
        (err) => {
          actual = err.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });

    it('レコードが登録できないこと（kintone.Promise）', async () => {
      let actual;
      await kintone.api('/k/v1/record', 'POST', { app: 2 }).then(
        (resolve) => {
          actual = resolve;
        },
        (reject) => {
          actual = reject.message;
        },
      );
      assert.equal(actual, 'Invalid params');
    });
  });
});
