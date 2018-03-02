import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';


class _Item extends Component {
  static propTypes = {
    id: PropTypes.any.isRequired,
    type: PropTypes.string.isRequired,
    move: PropTypes.func,
    find: PropTypes.func
  };

  render() {
    const {
      connectDropTarget,
      connectDragPreview,
      connectDragSource,
      id,
      type,
      move,
      find,
      isDragging
    } = this.props;

    return connectDragPreview(
        connectDropTarget(
            connectDragSource(
              <div
                style={{
                  flexGrow: 1,
                  height: 100,
                  background: 'skyblue',
                  border: '1px solid #fff'
                }}
              >
                {find(id).content}
              </div>
            )
        )
    );
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
};

const TYPE = 'ITEM';
const Item = DropTarget(TYPE, target, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(TYPE, source, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }))(_Item)
);

export default Item;
