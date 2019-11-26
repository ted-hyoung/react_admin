// base
import React from 'react';

// modules
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

interface IDndListProps {
  children?: JSX.Element[];
}

function DndList(props: IDndListProps) {
  const { children } = props;

  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

export default DndList;
