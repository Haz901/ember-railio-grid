import { isArray }                    from '@ember/array';
import Component                         from '@ember/component';
import { computed, defineProperty, get } from '@ember/object';
import { assign }                        from '@ember/polyfills';
import { htmlSafe, dasherize }           from '@ember/string';

const defaultPropertyObject = {
  format() {
    return Array.prototype.slice.call(arguments, 0).join(', ');
  }
};

const STYLING_PROPERTIES = {
  width:           { suffix: 'em' },
  minWidth:        { suffix: 'em' },
  horizontalAlign: { key: 'text-align' },
  verticalAlign:   { },
  backgroundColor: { },
  fontFamily:      { },
  fontWeight:      { },
  italic:          { key: 'font-style' },
  fontColor:       { key: 'color' },
  borderWidth:     { suffix: 'px' },
  borderColor:     { },
  borderStyle:     { }
};

function copy(object) {
  return assign({}, object);
}

export default Component.extend({
  tagName:           'td',
  attributeBindings: ['style'],

  _property: computed('property', function() {
    return assign({}, defaultPropertyObject, get(this, 'property'));
  }),

  style: computed('_values', '_property.style',
  function() {
    let values = get(this, '_values');
    let style  = copy(get(this, '_property.style'));
    let styles = [];

    // if style property is a function, return style depending on value
    for (let property in style) {
      if (style.hasOwnProperty(property) &&
          typeof style[property] === 'function') {
        style[property] = style[property](...values);
      }
      if (typeof style[property] === 'boolean') {
        style[property] = style[property] ? property : null;
      }

      let value = style[property];
      let stylingProperty = STYLING_PROPERTIES[property];

      if (value && stylingProperty) {
        let key    = stylingProperty.key || dasherize(property);
        let suffix = stylingProperty.suffix || '';

        styles.push(`${key}: ${value}${suffix};`);
      }
    }

    return htmlSafe(styles.join(' '));
  }),

  value: computed('_values', '_property.{format,component}', function() {
    let values    = get(this, '_values');
    let property  = get(this, '_property');
    let format    = get(property, 'format');
    let component = get(property, 'component');

    return component ? values : format(...values);
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    let propertyPaths = get(this, 'property.key');
    if (!isArray(propertyPaths)) {
      propertyPaths = [propertyPaths];
    }

    defineProperty(this, '_values', computed(`item.{${propertyPaths.join(',')}}`,
    function() {
      return propertyPaths.map((key) => {
        return get(this, `item.${key}`);
      });
    }));
  }
});
