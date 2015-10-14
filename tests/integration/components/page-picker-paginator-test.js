import { moduleForComponent, test } from 'ember-qunit';
import Paginator from 'ember-railio-grid/utils/paginator';
import hbs from 'htmlbars-inline-precompile';

let $currentPage;

moduleForComponent('page-picker-paginator', 'Integration | Component | {{page-picker-paginator}}', {
  integration: true,

  beforeEach: function() {
    this.set('paginator', Paginator.create({
      content: [1, 2, 3, 4, 5, 6],
      pageSize: 1
    }));

    this.render(hbs`{{page-picker-paginator paginator=paginator}}`);
    $currentPage = this.$('.paginator__number-input');
  }
});

test('input arrow up increases page', function(assert) {
  $currentPage.trigger('focusin');
  $currentPage.trigger($.Event('keydown', { keyCode: 38 }));
  assert.equal($currentPage.val(), '2', 'arrow up increases page');
  assert.equal(this.get('paginator.page'), 2, 'arrow up increases paginator page');
});

test('input arrow down decreases page', function(assert) {
  this.set('paginator.page', 3);

  $currentPage.trigger('focusin');
  $currentPage.trigger($.Event('keydown', { keyCode: 40 }));
  assert.equal($currentPage.val(), '2', 'arrow down decreases page');
  assert.equal(this.get('paginator.page'), 2, 'arrow down decreases paginator page');
});

test('press previous page button', function(assert) {
  this.set('paginator.page', 3);
  this.$('.paginator__button--previous:eq(0)').trigger('click');
  assert.equal($currentPage.val(), '2', 'previous page selected');
  assert.equal(this.get('paginator.page'), 2, 'paginator previous page selected');
});

test('press next page button', function(assert) {
  this.$('.paginator__button--next:eq(0)').trigger('click');
  assert.equal($currentPage.val(), '2', 'next page selected');
  assert.equal(this.get('paginator.page'), 2, 'paginator next page selected');
});

test('press last page button', function(assert) {
  this.$('.paginator__button--last:eq(0)').trigger('click');
  assert.equal($currentPage.val(), '6', 'last page selected');
  assert.equal(this.get('paginator.page'), 6, 'paginator last page selected');
});

test('press first page button', function(assert) {
  this.set('paginator.page', 4);
  this.$('.paginator__button--first:eq(0)').trigger('click');
  assert.equal($currentPage.val(), '1', 'first page selected');
  assert.equal(this.get('paginator.page'), 1, 'paginator first page selected');
});