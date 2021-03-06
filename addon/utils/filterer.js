import EmberObject, { get } from '@ember/object';
import { A, wrap }          from 'ember-array/utils';
import computed             from 'ember-computed';
import ContentContextMixin  from '../mixins/content-context';

const FILTERS = {
  eq(value, comparison) {
    return value.toUpperCase() === comparison.toUpperCase();
  },
  cont(value, contains) {
    return value.toUpperCase().indexOf(contains.toUpperCase()) !== -1;
  },
  gt(value, comparison) {
    return value > comparison;
  },
  gte(value, comparison) {
    return value >= comparison;
  },
  lt(value, comparison) {
    return value < comparison;
  },
  lte(value, comparison) {
    return value <= comparison;
  },
  start(value, part) {
    return value.toUpperCase().indexOf(part.toUpperCase()) === 0;
  },
  end(value, part) {
    let valueLength = value.length;
    let partLength = part.length;

    return value.toUpperCase().indexOf(part.toUpperCase()) ===
           (valueLength - partLength);
  }
};

function filter(filters, list) {
  if (!list) { return []; }

  return list.filter(function(item) {
    let isOk = true;

    filters.forEach(function(filter) {
      let filterFn = FILTERS[filter.filter.filter];
      let properties = A(wrap(filter.propertyPath));

      let OK = properties.any((property) => {
        return filterFn(get(item, property), filter.value);
      });

      if (!OK) { isOk = false; }
    });

    return isOk;
  });
}

export default EmberObject.extend(ContentContextMixin, {
  filteredContent: computed(
  'content.[]', 'handler.filters.@each.{value,propertyPath}', function() {
    return filter(get(this, 'handler.filters'), get(this, 'content'));
  }),

  filters: computed(function() {
    return A();
  })
});
