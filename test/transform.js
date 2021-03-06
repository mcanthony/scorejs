var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var Score = require('../')

vows.describe('Score transform').addBatch({
  'transform object': {
    'simple object transform': function () {
      var s = Score('a b c', { transpose: 'M2' })
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'b4', 'c#5', 'd4' ])
    },
    'multiple transformations': function () {
      var s = Score('a b |', { repeat: 2, transpose: 'M3' })
      assert.deepEqual(_.pluck(s.sequence, 'value'), [ 'c#5', 'd#5', 'c#5', 'd#5' ])
    }
  },
  'transform function': {
    'simple transform': function () {
      var s = Score('a b', function (event) {
        event.value = event.value.toUpperCase()
        event.duration = event.duration * 2
        event.position = event.position + 1
        return event
      })
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['A', 'B'])
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1 / 2, 1 / 2])
      assert.deepEqual(_.pluck(s.sequence, 'position'), [1, 1.25])
    },
    'scores are always ordered': function () {
      var s = Score('a b', function (event) {
        if (event.value === 'a') event.position += 10
        return event
      })
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['b', 'a'])
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1 / 4, 1 / 4])
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0.25, 10])
    },
    'transformations are compacted': function () {
      var s = Score('a b a c', function (event) {
        if (event.value !== 'a') return event
      })
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['b', 'c'])
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [1 / 4, 1 / 4])
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0.25, 0.75])
    },
    'transformations are flattened': function () {
      var s = Score('a b', function (event) {
        return [event, Score.event(event, { value: event.value.toUpperCase() })]
      })
      assert.deepEqual(_.pluck(s.sequence, 'value'), ['a', 'A', 'b', 'B'])
      assert.deepEqual(_.pluck(s.sequence, 'duration'), [0.25, 0.25, 0.25, 0.25])
      assert.deepEqual(_.pluck(s.sequence, 'position'), [0, 0, 0.25, 0.25])
    }
  }
}).export(module)
