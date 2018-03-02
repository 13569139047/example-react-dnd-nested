import React, { Component, PropTypes } from 'react'
import { DragSource, DropTarget } from 'react-dnd';
import Item from './Item'

const flexDirection = {
  'vertical': 'column',
  'horizontal': 'row'
}

class _Box extends Component {
  render() {
    const { connectDropTarget, connectDragPreview, connectDragSource, direction = 'vertical', items, find, move, contains, id } = this.props;

    return connectDragPreview(
      connectDropTarget(
        connectDragSource(
          <div style={{
            display: 'flex',
            flexDirection: flexDirection[direction],
            border: '10px solid #2a2',
            opacity: 0.6,
            minHeight: 50
          }}>
            {items.map(child => {
              return child.type === 'BOX' ? <Box find={find} move={move} contains={contains} key={id} {...child} /> : <Item
                key={child.id}
                {...child}
                find={find}
                move={move}
                contains={contains}
              />
            })}
          </div>
        )
      )
    )
  }
}

const source = {
  beginDrag(props) {
    return {
      id: props.id
    };
  },

  isDragging(props, monitor) {
    return props.id == monitor.getItem().id;
  }
};

const target = {
  canDrop(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: dropId, contains } = props;

    if (draggedId === dropId) return false;
    if (!monitor.isOver({ shallow: true })) return false;

    // prevent dropping ancestor into child and dropping direct child into it's parent
    if (contains(draggedId, dropId) || contains(dropId, draggedId, true)) return false;

    return true;
  },

  drop(props, monitor, component) {
    const { id: draggedId } = monitor.getItem();
    const { id: dropId, contains } = props;

    props.move(draggedId, dropId);
  }
}

const TYPE = 'ITEM';
const Box = DropTarget(TYPE, target, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))(DragSource(TYPE, source, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(_Box));

export default Box;
