import React, { Component } from 'react'
import Box from '../components/Box'

export default class Index extends Component {
  state = {
    items: [{
      id: 'item_1',
      content: 'ITEM_1'
    }, {
      id: 'item_2',
      content: 'ITEM_2'
    }, {
      id: 'item_3',
      content: 'ITEM_3'
    }],
    layout: {
      type: 'BOX',
      id: 'box_0',
      direction: 'vertical',
      items: [{
        type: 'BOX',
        id: 'box_1',
        direction: 'horizontal',
        items: [{
          type: 'ITEM',
          id: 'item_1'
        }, {
          type: 'ITEM',
          id: 'item_2'
        }]
      }, {
        type: 'ITEM',
        id: 'item_3'
      }]
    }
  }

  find = (id) => {
    const item = this.state.items.filter(it => it.id === id)[0];
    return item;
  }

  move = (from, to) => {
    const { layout } = this.state;
    // find items
    let nextLayout = JSON.parse(JSON.stringify(layout));
    let items = [];
    this.findItem(nextLayout, nextLayout, '', [from, to], items);
    let [fromItem, toItem] = items;
    
    // update model
    // drop to box, append
    if (toItem.value.type === 'BOX') {
      toItem.value.items.push(fromItem.value);
      fromItem.parent.splice(fromItem.key, 1);
    }
    // drop to item, insert before/after
    else {
      // delete from
      const tmpItem = fromItem.parent.splice(fromItem.key, 1)[0];
      // insert to
      if (fromItem.parent === toItem.parent && fromItem.key < toItem.key) {
        // swap adjacent item
        if (toItem.key - fromItem.key === 1) {
          toItem.parent.splice(toItem.key - 1, 1, toItem.value, tmpItem);
        }
        else {
          toItem.parent.splice(toItem.key - 1, 0, tmpItem);
        }
      }
      else {
        toItem.parent.splice(toItem.key, 0, tmpItem);
      }
    }

    // sync UI state
    console.log(`${from} -> ${to}`);
    this.setState({
      layout: nextLayout
    });
  }

  findItem = (boxOrItem, parent, key, itemIds, result, shadow) => {
    // fill with null, then reduce() works
    if (result.length !== itemIds.length) {
      for (let i = 0; i < itemIds.length; i++) {
        result[i] = null;
      }
    }
    itemIds.forEach((id, i) => {
      if (boxOrItem.id === id) {
        result[i] = {
          value: boxOrItem,
          parent,
          key
        };
      }
    });
    if (result.reduce((a, v) => a && v, true)) return;

    if (!shadow && boxOrItem.type === 'BOX') {
      boxOrItem.items.forEach((item, i) => this.findItem(item, boxOrItem.items, i, itemIds, result));
    }
  }

  contains = (from, to, strict) => {
    const { layout } = this.state;
    let items = [];
    this.findItem(layout, layout, '', [from], items);
    let fromItem = items[0];
    items = [];
    this.findItem(fromItem.value, fromItem.parent, fromItem.key, [to], items, strict);
    return !!items[0];
  }

  render() {
    const { layout } = this.state;
    const { direction, id } = layout;

    return <div style={{width: 300, backgroundColor: '#eee'}}>
      <Box id={id} items={layout.items} direction={direction} find={this.find} move={this.move} contains={this.contains} />
    </div>
  }
}
